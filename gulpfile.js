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
exports.default = (cb) => {
	parallel(js.all, css.all)(cb);
};

/*
	$ gulp js
*/
exports.js = (cb) => {
	js.all(cb);
};

/*
	$ gulp css
*/
exports.css = (cb) => {
	css.all(cb);
};

/*
	$ gulp watch
*/
exports.watch = (cb) => {
	parallel(series(js.all, js.watch), series(css.all, css.watch))(cb);
};
