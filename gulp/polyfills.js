/*
	Polyfill tasks.
*/

const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const dirs = require('./dirs.js');

var dir = {};

module.exports = cb => {
    dir = dirs(true);

    //  Some polyfills might rely on others,
    //      therefor we include 'em in a fixed order.
    return src([
        dir.input + '/_polyfills/api.foreach.js',
        dir.input + '/_polyfills/api.matches.js',
        dir.input + '/_polyfills/api.closest.js',
        dir.input + '/_polyfills/dom.prepend.js',
        dir.input + '/_polyfills/dom.append.js',
        dir.input + '/_polyfills/dom.before.js',
        dir.input + '/_polyfills/dom.remove.js'
    ])
        .pipe(concat('mmenu.polyfills.js'))
        .pipe(dest(dir.output));
};
