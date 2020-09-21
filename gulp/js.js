/*
    JS tasks.
        *) The "module" file is transpiled from the specified "custom input" dir.
*/

const { src, dest, watch, series } = require('gulp');

const typescript = require('gulp-typescript');
const webpack = require('webpack-stream');

const dirs = require('./dirs.js');
var dir = {};

/** Run all scripts. */
exports.all = JSall = (cb) => {
    dir = dirs(false);

    series(JStranspile, JSpack)(cb);
};

exports.custom = JScustom = (cb) => {
    dir = dirs(true);

    series(JSpack)(cb);
};

/** Put a watch on all files. */
exports.watch = JSwatch = (cb) => {
    dir = dirs(false);

    watch(dir.input + '/**/*.ts', {
        ignored: [
            dir.input + '/**/*.d.ts', //	Exclude all typings.
        ],
    }).on('change', (path) => {
        console.log('Change detected to .ts file "' + path + '"');
        var cb = () => {
            console.log('JS transpiled and concatenated.');
        };

        //	Changing any file only affects the files in the same directory:
        //		- transpile only the directory to js;
        //		- pack all.
        var files = path.split('/');
        files.pop();
        files.shift();
        files = files.join('/');

        var input = dir.input + '/' + files + '/*.ts',
            output = dir.output + '/' + files;

        var JStranspileOne = (cb) => JStranspile(cb, input, output);

        series(JStranspileOne, JSpack)(cb);
    });

    cb();
};

// *) Transpile all TS files to JS.
const JStranspile = (cb, input, output) => {
    return src([
        dir.input + '/**/*.d.ts', // Include all typings.
        input || (dir.input + '/**/*.ts'), // Include the needed ts files.
    ])
        .pipe(
            typescript({
                target: 'es5',
                module: 'es6',
                moduleResolution: 'node',
                resolveJsonModule: true,
            })
        )
        .pipe(dest(output || dir.output));
};

// Pack the files.
const JSpack = () => {
    var input = dir.build || dir.input;

    return src(input + '/mmenu.js')
        .pipe(
            webpack({
                // mode: 'development',
                mode: 'production',
                output: {
                    filename: 'mmenu.js',
                },
                // optimization: {
                //     minimize: false
                // }
            })
        )
        .pipe(dest(dir.output));
};
