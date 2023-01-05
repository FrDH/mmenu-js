/*
	Tasks:

	$ gulp 			: Runs the "js" and "css" tasks.
	$ gulp js		: Runs the "js" tasks.
	$ gulp css		: Runs the "css" tasks.
	$ gulp watch	: Starts a watch on the "js" and "css" tasks.
*/

const { parallel, series } = require('gulp');

const js = require('./gulp/js');
const css = require('./gulp/css');

/*
	$ gulp
*/
exports.default = parallel(js.all, css.all);

/*
	$ gulp js
*/
exports.js = js.all;

/*
	$ gulp css
*/
exports.css = css.all;

/*
	$ gulp watch
*/
exports.watch = parallel(series(js.all, js.watch), series(css.all, css.watch));
