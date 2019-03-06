/*
	JS tasks.
		*) The "module" file is transpiled from either the "bin" dir or the specified "custom input" dir.
*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

const { dirs }		= require( './dirs.js' );

const typescript	= require( 'gulp-typescript' );
const webpack		= require( 'webpack-stream' );

var dir = {};


/** Run all scripts. */
exports.all = JSall = ( cb ) => {
	dir = dirs();

	series( 
		JStranspileAll,
		JSpack
	)( cb );
};

/** Put a watch on all files. */
exports.watch = JSwatch = ( cb ) => {
	dir = dirs();

	watch( dir.input + '/**/*.ts', {
		ignored: [ 
			dir.input + '/**/*.d.ts'	//	Exclude all typings.
		]
	})
	.on( 'change', ( path ) => {

		console.log( 'Change detected to .ts file "' + path + '"' );
		var cb = () => {
			console.log( 'JS transpiled and concatenated.' );
		};

		//	Changing any file only affects the files in the same directory:
		//		- transpile only the directory to js;
		//		- pack all.
		var files = path.split( '/' );
			files.pop();
			files.shift();
			files = files.join( '/' );

		var input  = dir.input + '/' + files + '/*.ts',
			output = dir.output + '/' + files;

		var JStranspileOne = cb => JStranspileAll( cb, input, output );

		series(
			JStranspileOne,
			JSpack
		)( cb );
	});

	cb();
};



// *) Transpile all TS files to JS.
exports.transpileAll = JStranspileAll = ( cb, input, output ) => {
	return src([
			dir.input + '/**/*.d.ts',			//	Include all typings.
			input || dir.input + '/**/*.ts'		//	Include the needed ts files.
		])
  		.pipe( typescript({
			"target": "es6",
			"module": "es6"
  		}) )
		.pipe( dest( output || dir.output ) );
};

// Pack the files.
exports.pack = JSpack = () => {
	var input = dir.buildInput || dir.input;

	return src( input + '/mmenu.module.js' )
	    .pipe( webpack({
	    	// mode: 'development',
	    	mode: 'production',
	    	output: {
				filename: 'mmenu.js',
		    },
	    }) )
	    .pipe( dest( dir.output ) );
};