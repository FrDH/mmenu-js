/*
	CSS tasks.

		*)  The variables for each part are concatenated into the "bin" dir.
		**) Before compiling, the variables are copied from either the "bin" dir or the specified "custom input" dir, into the "input" dir.
*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

var { dirs }		= require( './dirs' );

const sass 			= require( 'gulp-sass' );
const autoprefixer 	= require( 'gulp-autoprefixer' );
const cleancss		= require( 'gulp-clean-css' );
const concat 		= require( 'gulp-concat' );

var dir = {};


/** Run all scripts. */
exports.all = CSSall = ( cb ) => {
	dir = dirs();

	series( 
		parallel( 
			CSSconcatVariables, 
			CSSconcatMixins
		),
		CSScopyVariables,
		CSScompileAll,
		CSSconcatAll
	)( cb );
};

/** Put a watch on all files. */
exports.watch = CSSwatch = ( cb ) => {
	dir = dirs();

	watch( dir.input + '/**/*.scss', {
		ignored: [ 
			dir.input + '/_variables.scss', 	// Exclude the variables destination file.
			dir.input + '/_mixins.scss'			// Exclude the mixins destination file.
		]
	})
	.on( 'change', ( path ) => {

		console.log( 'Change detected to .scss file "' + path + '"' );
		var cb = () => {
			console.log( 'CSS compiled and concatenated.' );
		};

		switch( true ) {
			//	Changing a variable or mixin potentially affects all .scss files:
			//		- do all CSS tasks.
			case path.indexOf( '_variables.scss' ) > -1:
			case path.indexOf( '_mixins.scss' ) > -1:
				CSSall( cb );
				break;

			//	Changing any other file only affects the files in the same directory:
			//		- compile only the directory to css;
			//		- concatenate all.
			default:
				var files = path.split( '/' );
					files.pop();
					files.shift();
					files = files.join( '/' );

				var input  = dir.input + '/' + files + '/*.scss',
					output = dir.output + '/' + files;

				var CSScompileOne = cb => CSScompileAll( cb, input, output );

				series(
					CSScompileOne,
					CSSconcatAll
				)( cb );
				break;
		}
	});

	cb();
};



// *) Concatenate variables into a single file.
exports.concatVariables = CSSconcatVariables = ( cb ) => {
	var files  	= [
		dir.input + '/core/oncanvas/_variables.scss',	// Include oncanvas variables first.
		dir.input + '/core/**/_variables.scss',			// Include core acc-ons variables next.
		dir.input + '/**/_variables.scss',				// Include the rest of the variables.
	'!'+dir.input + '/_variables.scss',					// Exclude the variables destination file.
	];

	return src( files )
		.pipe( concat( '_variables.scss' ) )
    	.pipe( dest( dir.bin ) );
};

// **) Copy variables from bin or custom input into input.
exports.copyVariables = CSScopyVariables = ( cb ) => {
	var input = dir.buildInput || dir.bin;

	return src( input + '/_variables.scss' )
		.pipe( dest( dir.input ) );
};

// Concatenate mixins into a single file.
exports.concatMixins = CSSconcatMixins = ( cb ) => {
	var files = [
		dir.input + '/**/_mixins.scss',		// Include all other mixins.
	'!'+dir.input + '/_mixins.scss',		// Exclude the mixins destination file.
	];

	return src( files )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( dest( dir.input ) );
};

// Compile all SCSS files to CSS.
exports.compileAll = CSScompileAll = ( cb, input, output ) => {
	return src( input || dir.input + '/**/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( dest( output || dir.output ) );
};

// Concat all CSS files into a single file.
exports.concatAll = CSSconcatAll = ( cb ) => {
	var files = [
		dir.output + '/core/oncanvas/*.css',	// Include oncanvas first.
		dir.output + '/core/**/*.css',			// Include core add-ons next.
		dir.output + '/**/*.css',				// Include the rest.
	'!'+dir.output + '/mmenu.css',				// Exclude the CSS destination file.
	];

	return src( files )
		.pipe( concat( 'mmenu.css' ) )
		.pipe( dest( dir.output ) );
};
