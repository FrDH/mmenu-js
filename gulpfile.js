/*
	Tasks:

	$ gulp 					: Runs "css" and "js" tasks
	$ gulp watch			: Starts a watch on "css" and "js" tasks


	Flags:

	--o ../path/to 	: Sets the "output" directory to the specified directory
	--c ../path/to 	: Creates a "custom build" using _build.json and _variables.custom.scss from the specified directory


	Examples:

	$ gulp --c ../mmenu-custom --o ../my-custom-build
	$ gulp watch --c ../mmenu-custom --o ../my-custom-build



	Generate a _build.json by running:
	$ php bin/build.php ../path/to
*/


const gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-terser' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' ),
	typescript		= require( 'gulp-typescript' ),
	merge			= require( 'merge-stream' ),
	fs 				= require( 'fs' );


const inputDir 		= 'src';
let outputDir 		= 'dist',
	customDir 		= null,
	build 			='./' + inputDir + '/_build.json';


function sanitizeNamespaceForUmd( file )
{
	let path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}
function concatUmdJS( files, name )
{
	let stream = gulp.src( files )
		.pipe( concat( name ) );

	if ( build.umd )
	{
		stream = stream.pipe( umd({
			dependencies: function() { return [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ]; },
			exports: function() { return 'jQuery.mmenu'; },
			namespace: sanitizeNamespaceForUmd
		}));
	}
	return stream.pipe( gulp.dest( outputDir ) );
}


function getOption( opt ) {
    const index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) !== '--' ) ? opt : false;
	}
	return false;
}


function start( callback ) {

    const o = getOption( 'o' ),
		c = getOption( 'c' );

	//	Set output dir 
	if ( o )
	{
		outputDir = o;
	}

	//	Set custom dir
	if ( c )
	{
		customDir = c;

		//	Try custom _build.json file
        const b = './' + c + '/_build.json';
		fs.stat( b, function( err, stat ) {
			if ( err == null )
			{
				build = require( b );
			}
			else
			{
				build = require( build );
			}
			callback();
		});
	}
	else
	{
		build = require( build );
		callback();
	}
}




/*
	$ gulp
*/

const defaultTask = function( cb ) {
	start( gulp.parallel( js, css ) );
	cb();
};
exports.default = defaultTask;


const watchTask = function( cb ) {
	start(function() {
		gulp.watch( inputDir + '/*/**/*.scss'	, css );
		gulp.watch( inputDir + '/*/**/*.ts'	, js );
	});
	cb();
};
exports.watch = watchTask;




/*
	$ gulp css
*/

//	1)	Concatenate variables and mixins
const cssVariables = function() {

    const files  	= {
		variables: [ 
			inputDir + '/core/oncanvas/_variables.scss',	//	Oncanvas needs to be first
			inputDir + '/core/**/_variables.scss',
			inputDir + '/addons/**/_variables.scss',
			inputDir + '/extensions/**/_variables.scss',
			inputDir + '/wrappers/**/_variables.scss'
		],
		mixins: [
			inputDir + '/core/**/_mixins.scss',
			inputDir + '/addons/**/_mixins.scss',
			inputDir + '/extensions/**/_mixins.scss',
			inputDir + '/wrappers/**/_mixins.scss'
		]
	};

	if ( customDir )
	{
		//	With the globstar, the file does not need to exist
		files.variables.unshift( customDir + '/**/_variables.custom.scss' );
	}

    const mixins = gulp.src( files.mixins )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( gulp.dest( inputDir ) );

    const variables = gulp.src( files.variables )
		.pipe( concat( '_variables.scss' ) )
		.pipe( gulp.dest( inputDir ) );

	return merge.apply( this, [ variables, mixins ] );
};

//	2) 	Compile CSS
const cssCompile = function() {

    const files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' + build.files.core.join( '|' ) + ')/*.scss',
		inputDir + '/**/addons/@(' + build.files.addons.join( '|' ) + ')/*.scss',
		inputDir + '/**/extensions/@(' + build.files.extensions.join( '|' ) + ')/*.scss',
		inputDir + '/**/wrappers/@(' + build.files.wrappers.join( '|' ) + ')/*.scss'
	];

	return gulp.src( files )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( gulp.dest( outputDir ) );
};

//	3) 	Concatenate CSS
const cssConcat = function() {

	//	Core
    const files = [
		outputDir + '/core/oncanvas/*.css',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.css',
	];

    const core = gulp.src( files )
		.pipe( concat( 'jquery.mmenu.css' ) )
		.pipe( gulp.dest( outputDir ) );

	//	Add addons, extensions and wrappers
	files.push( outputDir + '/addons/**/*.css' );
	files.push( outputDir + '/extensions/**/*.css' );
	files.push( outputDir + '/wrappers/**/*.css' );

    const all = gulp.src( files )
		.pipe( concat( build.name + '.css' ) )
		.pipe( gulp.dest( outputDir ) );

	return merge.apply( this, [ core, all ] );
};

const css = gulp.series( cssVariables, cssCompile, cssConcat );




/*
	$ gulp js
*/

//	1) 	Compile core + add-ons
const jsCompile = function() {

    const files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' + build.files.core.join( '|' ) + ')/*.ts',
		inputDir + '/**/addons/@(' + build.files.addons.join( '|' ) + ')/*.ts',
		inputDir + '/**/wrappers/@(' + build.files.wrappers.join( '|' ) + ')/*.ts'
	];

	return gulp.src( files )
		.pipe( typescript() )
		.pipe( uglify({ 
			output: {
				comments: "/^!/"
			}
		}) )
		.on('error', function (err) { console.log(err) } )
		.pipe( gulp.dest( outputDir ) );
};

//	2)	Compile translations
const jsTranslations = function() {

    const streams = [];
    let stream;

	for ( let t = 0; t < build.files.translations.length; t++ )
	{
        const lang = build.files.translations[ t ];
        const files = [
			inputDir + '/core/@(' + build.files.core.join( '|' ) + ')/translations/jquery.mmenu.' + lang + '.ts',
			inputDir + '/addons/@(' + build.files.addons.join( '|' ) + ')/translations/jquery.mmenu.' + lang + '.ts'
		];

		stream = gulp.src( files )
			.pipe( typescript() )
			.pipe( uglify({
				output: {
					comments: "/^!/"
				}
			}) )
			.pipe( concat( 'jquery.mmenu.' + lang + '.js' ) )
			.pipe( gulp.dest( outputDir + '/translations/' + lang ) );

		streams.push( stream );
	}

	return ( build.files.translations.length > 0 )
		? merge.apply( this, streams )
		: gulp.src([]); 
};

//	3) 	Concatenate JS
const jsConcat = function() {

	//	Core
    const files = [
		outputDir + '/core/oncanvas/*.js',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.js'
	];
    const core = concatUmdJS( files, 'jquery.mmenu.js' );

	//	Add addons, wrappers and translations
	files.push( outputDir + '/addons/**/[!_]*.js' );	//	Files that are NOT prefixed with an underscore need to be added first.
	files.push( outputDir + '/addons/**/[_]*.js' );		//	Files that are prefixed with an underscore can be added later.
	files.push( outputDir + '/wrappers/**/*.js' );
	files.push( outputDir + '/translations/**/*.js' );

    const all = concatUmdJS( files, build.name + '.js' );

	return merge.apply( this, [ core, all ] );
};

const js = gulp.series( jsCompile, jsTranslations, jsConcat );
