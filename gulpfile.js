/*
	Tasks:

	$ gulp 			: Runs the "css" and "js" tasks.
	$ gulp watch	: Starts a watch on the "css" and "js" tasks.


	Flags for the tasks:

	--i ../path/to 	: Creat a custom build using "mmenu.module.ts" and "_variables.scss" from the specified directory.
	--o ../path/to 	: Sets the "output" directory to the specified directory.


	Examples:

	$ gulp --i ../mmenu-custom --o ../my-custom-build
	$ gulp watch --i ../mmenu-custom --o ../my-custom-build
*/



const { parallel } = require( 'gulp' );

const css 	= require( './bin/gulp/css' );
const js  	= require( './bin/gulp/js' );


/*
	$ gulp
*/
exports.default = ( cb ) => {
	parallel(
		css.all,
		js.all
	)( cb );
};


/*
	$ gulp watch
*/
exports.watch = ( cb ) => {
	parallel(
		css.watch,
		js.watch
	)( cb );
};
