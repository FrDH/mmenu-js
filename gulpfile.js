/*
	Tasks:

	$ gulp 			: Runs the "css" and "js" tasks.
	$ gulp watch	: Starts a watch on the "css" and "js" tasks.


	Flags:

	--i ../path/to 	: Creat a custom build using "mmenu.module.ts" and "_variables.scss" from the specified directory.
	--o ../path/to 	: Sets the "output" directory to the specified directory.


	Examples:

	$ gulp --i ../mmenu-custom --o ../my-custom-build
	$ gulp watch --i ../mmenu-custom --o ../my-custom-build
*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

const sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	concat 			= require( 'gulp-concat' ),
	typescript		= require( 'gulp-typescript' ),
	webpack			= require( 'webpack-stream' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	binDir			= 'bin',
	buildInputDir	= null;



const getOption = ( opt ) => {
	var index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) !== '--' ) ? opt : false;
	}
	return false;
};


const setDirs = () => {

	var i = getOption( 'i' ),
		o = getOption( 'o' );

	// Set custom input dir.
	if ( i )
	{
		buildInputDir = i;
	}

	// Set custom output dir.
	if ( o && o != inputDir && o != binDir )
	{
		outputDir = o;
	}
};


/*
	$ gulp
*/
const defaultTask = ( cb ) => {
	setDirs();
	css();
	js();
	cb();
};
exports.default = defaultTask;


/*
	$ gulp watch
*/
const watchTask = ( cb ) => {
	setDirs();
	watch( inputDir + '/**/*.scss'	, css );
	watch( inputDir + '/**/*.ts'	, js );
	cb();
};
exports.watch = watchTask;



/*
	CSS tasks.

		*)  The variables for each part are concatenated into the "bin" dir.
		**) Before compiling, the variables are copied from either the "bin" dir or the specified "custom input" dir, into the "input" dir.
*/
//	TODO use watcher.on to see what file changed:
//		variable: concat variables, compile all and concat.
//		mixin: concat mixins, compile all and concat.
//		orhter: compile only changed and concat.

//	TODO For gulp default:
//		do not concat variables or mixins, just compile and concat.

// *) Concatenate variables into a single file.
const cssConcatVariables = () => {
	var files  	= [
	'!'+inputDir + '/_variables.scss',					// Exclude the variables destination file.
		inputDir + '/core/oncanvas/_variables.scss',	// Include oncanvas first.
		inputDir + '/core/**/_variables.scss',			// Include core add-ons next.
		inputDir + '/**/_variables.scss'				// Include the rest.
	];

	return src( files )
		.pipe( concat( '_variables.scss' ) )
    	.pipe( dest( binDir ) );
};

// Concatenate mixins into a single file.
const cssConcatMixins = () => {
	var files = [
	'!'+inputDir + '/_mixins.scss',		// Exclude the mixins destination file.
		inputDir + '/**/_mixins.scss'	// Include all other mixins.
	];

	return src( files )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( dest( inputDir ) );
};

// **) Copy variables from bin or custom input into input.
const cssCopyVariables = () => {
	var dir = buildInputDir || binDir;

	return src( dir + '/_variables.scss' )
		.pipe( dest( inputDir ) );
};

// Compile all SCSS files to CSS.
const cssCompileAll = () => {
	return src( inputDir + '/**/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( dest( outputDir ) );
};

// Concat all CSS files into a single file.
const cssConcatAll = () => {
	var files = [
	'!'+outputDir + '/mmenu.css',				// Exclude the CSS destination file.
		outputDir + '/core/oncanvas/*.css',		// Include oncanvas first.
		outputDir + '/core/**/*.css',			// Include core add-ons next.
		outputDir + '/**/*.css'					// Include the rest.
	];

	return src( files )
		.pipe( concat( 'mmenu.css' ) )
		.pipe( dest( outputDir ) );
};

const css = series( 
	parallel( 
		cssConcatVariables,
		cssConcatMixins
	),
	cssCopyVariables,
	cssCompileAll,
	cssConcatAll
);



/*
	JS tasks.
		*) The "module" file is transpiled from either the "bin" dir or the specified "custom input" dir.
*/

// *) Transpile all TS files to JS.
const jsTranspile = () => {
	return src( inputDir + '/**/*.ts' )
  		.pipe( typescript({
			"target": "es6",
			"module": "es6"
  		}) )
		.pipe( dest( outputDir ) );
};

// Pack the files.
const jsPack = () => {
	var dir = buildInputDir || inputDir;

	return src( dir + '/mmenu.module.js' )
	    .pipe( webpack({
	    	// mode: 'development',
	    	mode: 'production',
	    	output: {
				filename: 'mmenu.js',
		    },
	    }) )
	    .pipe( dest( outputDir ) );
};

const js = series( jsTranspile, jsPack );
