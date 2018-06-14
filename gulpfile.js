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


var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-uglify' ),
	rename 			= require( 'gulp-rename' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' ),
	typescript		= require( 'gulp-typescript' ),
	merge			= require( 'merge-stream' ),
	fs 				= require( 'fs' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	customDir 		= null,
	build 			='./' + inputDir + '/_build.json';


function sanitizeNamespaceForUmd( file )
{
	path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}
function concatUmdJS( files, name )
{
	var stream = gulp.src( files )
		.pipe( concat( name ) );

	if ( build.umd )
	{
		stream = stream.pipe( umd({
			dependencies: function() { return [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}));
	}
	return stream.pipe( gulp.dest( outputDir ) );
}


function getOption( opt ) {
	var index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) != '--' ) ? opt : false;
	}
	return false;
}


function start( callback ) {

	var o = getOption( 'o' ),
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
		var b = './' + c + '/_build.json';
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

gulp.task( 'default', function() {
	start(function() {
		gulp.start( [ 'js', 'css' ] );
	});
});

gulp.task( 'watch', function() {
	start(function() {
		gulp.watch( inputDir + '/**/*.scss'	, [ 'css' ] );
		gulp.watch( inputDir + '/**/*.ts'	, [ 'js'  ] );
	});
});




/*
	$ gulp css
*/

gulp.task( 'css', [ 'css-concat' ] );


//	1)	Concatenate variables
gulp.task( 'css-variables', function() {

	var files  	= {
		variables: [ 
			inputDir + '/core/**/_variables.scss',
			inputDir + '/addons/**/_variables.scss',
			inputDir + '/extensions/**/_variables.scss'
		],
		mixins: [
			inputDir + '/core/**/_mixins.scss',
			inputDir + '/addons/**/_mixins.scss',
			inputDir + '/extensions/**/_mixins.scss'
		]
	};

	if ( customDir )
	{
		//	With the globstar, the file does not need to excist
		files.variables.unshift( customDir + '/**/_variables.custom.scss' );
	}
	
	var mixins = gulp.src( files.mixins )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( gulp.dest( inputDir ) );

	var variables = gulp.src( files.variables )
		.pipe( concat( '_variables.scss' ) )
		.pipe( gulp.dest( inputDir ) );

	return merge.apply( this, [ variables, mixins ] );
});

//	2) 	Compile CSS
gulp.task( 'css-compile', [ 'css-variables' ], function() {

	var files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' + build.files.core.join( '|' ) + ')/*.scss',
		inputDir + '/**/addons/@(' + build.files.addons.join( '|' ) + ')/*.scss',
		inputDir + '/**/extensions/@(' + build.files.extensions.join( '|' ) + ')/*.scss'
	];

	return gulp.src( files )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( gulp.dest( outputDir ) );
});

//	3) 	Concatenate CSS
gulp.task( 'css-concat', [ 'css-compile' ], function() {

	//	Core
	var files = [
		outputDir + '/core/oncanvas/*.css',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.css',
	];

	var core = gulp.src( files )
		.pipe( concat( 'jquery.mmenu.css' ) )
		.pipe( gulp.dest( outputDir ) );

	//	Add addons and extensions
	files.push( outputDir + '/addons/**/*.css' );
	files.push( outputDir + '/extensions/**/*.css' );

	var all = gulp.src( files )
		.pipe( concat( build.name + '.css' ) )
		.pipe( gulp.dest( outputDir ) );

	return merge.apply( this, [ core, all ] );
});





/*
	$ gulp js
*/

gulp.task( 'js', [ 'js-translations' ] );


//	1) 	Compile JS
gulp.task( 'js-compile', function() {

	var files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' + build.files.core.join( '|' ) + ')/*.ts',
		inputDir + '/**/addons/@(' + build.files.addons.join( '|' ) + ')/*.ts',
		inputDir + '/**/wrappers/@(' + build.files.wrappers.join( '|' ) + ')/*.ts'
	];

	return gulp.src( files )
		.pipe( typescript() )
		.pipe( uglify({ 
			preserveComments: 'license',
			output: {
				comments: "/^!/"
			}
		}) )
		.pipe( gulp.dest( outputDir ) );
});

//	2) 	Concatenate JS
gulp.task( 'js-concat', [ 'js-compile' ], function() {

	//	Core
	var files = [
		outputDir + '/core/oncanvas/*.js',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.js'
	];
	var core = concatUmdJS( files, 'jquery.mmenu.js' );

	//	Add addons
	files.push( outputDir + '/addons/**/[!_]*.js' );	//	Files that are NOT prefixed with an underscore need to be added first.
	files.push( outputDir + '/addons/**/[_]*.js' );		//	Files that are prefixed with an underscore can be added later.
	files.push( outputDir + '/wrappers/**/*.js' );
	var all = concatUmdJS( files, build.name + '.js' );

	return merge.apply( this, [ core, all ] );
});

//	3)	Translations
gulp.task( 'js-translations', [ 'js-concat' ], function() {

	var streams = [],
		stream;

	for ( var t = 0; t < build.files.translations.length; t++ )
	{
		var lang = build.files.translations[ t ];
		var files = [
			inputDir + '/core/@(' + build.files.core.join( '|' ) + ')/translations/jquery.mmenu.' + lang + '.ts',
			inputDir + '/addons/@(' + build.files.addons.join( '|' ) + ')/translations/jquery.mmenu.' + lang + '.ts'
		];

		stream = gulp.src( files )
			.pipe( typescript() )
			.pipe( uglify({
				preserveComments: 'license',
				output: {
					comments: "/^!/"
				}
			}) )
			.pipe( concat( 'jquery.mmenu.' + lang + '.js' ) )
			.pipe( gulp.dest( outputDir + '/translations/' + lang ) );

		streams.push( stream );
	}

	return merge.apply( this, streams );
});
