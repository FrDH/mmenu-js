const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

const dirs = {
    input: 'src',
    output: 'dist'
};

/** Run all scripts. */
exports.all = CSSall = (cb, input, output) => {
    return src(input || dirs.input + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['> 5%', 'last 5 versions']))
        .pipe(cleancss())
        .pipe(dest(output || dirs.output));
};

/** Put a watch on all files. */
exports.watch = CSSwatch = cb => {
    return watch([dirs.input + '/**/*.scss'])
        .on('change', path => {
            console.log('Change detected to .scss file "' + path + '"');
            series(CSSall)(() => {
                console.log('CSS compiled and concatenated.');
            });
    });
};
