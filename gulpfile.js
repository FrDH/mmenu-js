/*
	Tasks:

	$ gulp 					: Runs "css" and "js" tasks.
	$ gulp watch			: Starts a watch on "css" and "js" tasks.


	Flags:

	--o ../path/to 	: Sets the "output" directory to the specified directory.
	--c ../path/to 	: Creates a "custom build" using _build.json and _variables.custom.scss from the specified directory.


	Examples:

	$ gulp --c ../mmenu-custom --o ../my-custom-build
	$ gulp watch --c ../mmenu-custom --o ../my-custom-build



	Generate a _build.json by running:
	$ php bin/build.php ../path/to
*/


var { src, dest, watch, series, parallel } = require( 'gulp' );

var sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-terser' ),
	concat 			= require( 'gulp-concat' ),
	typescript		= require( 'gulp-typescript' ),
	fs 				= require( 'fs' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	customDir 		= null,
	build 			='./' + inputDir + '/_build.json';



const getOption = ( opt ) => {
	var index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) != '--' ) ? opt : false;
	}
	return false;
}


const start = ( cb ) => {

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
		fs.stat( b, ( err, stat ) => {
			if ( err == null )
			{
				build = require( b );
			}
			else
			{
				build = require( build );
			}
			cb();
		});
	}
	else
	{
		build = require( build );
		cb();
	}
}



/*
	$ gulp
*/
const defaultTask = ( cb ) => {
	start( parallel( css, js ) );
	cb();
};
exports.default = defaultTask;


/*
	$ gulp watch
*/
const watchTask = ( cb ) => {
	start(() => {
		watch( inputDir + '/**/*.scss'	, css );
		watch( inputDir + '/**/*.ts'	, js );
	});
	cb();
};
exports.watch = watchTask;



/*
	CSS tasks.
*/

// Concatenate variables.
const cssVariables = () => {
	var files  	= [
		inputDir + '/core/oncanvas/_variables.scss',	//	Oncanvas needs to be first
		inputDir + '/core/**/_variables.scss',			//	Core needs to be next
		inputDir + '/addons/**/_variables.scss',
		inputDir + '/extensions/**/_variables.scss',
		inputDir + '/wrappers/**/_variables.scss'
	];

	if ( customDir )
	{
		//	Because of the the globstar, the file does not need to excist.
		files.unshift( customDir + '/**/_variables.custom.scss' );
	}

	return src( files )
		.pipe( concat( '_variables.scss' ) )
    	.pipe( dest( inputDir ) );
};

// Concatenate mixins.
const cssMixins = () => {
	var files = [
		inputDir + '/core/**/_mixins.scss',
		inputDir + '/addons/**/_mixins.scss',
		inputDir + '/extensions/**/_mixins.scss',
		inputDir + '/wrappers/**/_mixins.scss'
	];

	return src( files )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( dest( inputDir ) );
};

// Compile and concatenate all SCSS files to CSS.
const cssCompile = () => {
	var files = [
		inputDir + '/core/oncanvas/*.scss',
		inputDir + '/core/@(' 		+ build.files.core.join( '|' ) 			+ ')/*.scss',
		inputDir + '/addons/@(' 	+ build.files.addons.join( '|' ) 		+ ')/*.scss',
		inputDir + '/extensions/@(' + build.files.extensions.join( '|' ) 	+ ')/*.scss',
		inputDir + '/wrappers/@(' 	+ build.files.wrappers.join( '|' ) 		+ ')/*.scss'
	];

	return src( files )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( concat( build.name + '.css' ) )
		.pipe( dest( outputDir ) );
};

const css = series( 
	parallel( 
		cssVariables,
		cssMixins
	),
	cssCompile
);



/*
	JS tasks.
*/

// 1) Compile and concatenate all TS files to JS.
const js = () => {

	var files = [];

	//	Add typings.
	files.push(
		inputDir + '**/*.d.ts',
	);

	//	Add files.
	files.push(
		inputDir + '/core/oncanvas/[!_]*.ts',
		inputDir + '/core/oncanvas/[_]*.ts',
		inputDir + '/core/@(' 		+ build.files.core.join( '|' ) 		+ ')/[!_]*.ts',
		inputDir + '/core/@(' 		+ build.files.core.join( '|' ) 		+ ')/[_]*.ts',
		inputDir + '/core/@(' 		+ build.files.core.join( '|' ) 		+ ')/translations/@(' 	+ build.files.translations.join( '|' ) 	+ ').ts',
		inputDir + '/addons/@(' 	+ build.files.addons.join( '|' ) 	+ ')/[!_]*.ts',
		inputDir + '/addons/@(' 	+ build.files.addons.join( '|' ) 	+ ')/[_]*.ts',
		inputDir + '/addons/@(' 	+ build.files.addons.join( '|' ) 	+ ')/translations/@(' 	+ build.files.translations.join( '|' ) 	+ ').ts',
		inputDir + '/wrappers/@(' 	+ build.files.wrappers.join( '|' ) 	+ ')/*.ts'
	);

	return src( files )
  		.pipe( typescript({
			"target": "es5"
  		}) )
		// .pipe( uglify({ 
		// 	output: {
		// 		comments: "/^!/"
		// 	}
		// }) )
		.on( 'error', ( err ) => { console.log( err ) } )
		.pipe( concat( build.name + '.js' ) )
		.pipe( dest( outputDir ) );
};

