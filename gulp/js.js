const { src, dest, watch, series } = require('gulp');

const typescript = require('gulp-typescript');
const webpack = require('webpack-stream');

const dirs = {
    input: 'src',
    output: 'dist'
};

/** Run all scripts. */
exports.all = JSall = (cb) => {
    return series(JStranspile, JSpack)(cb);
};

/** Put a watch on all files. */
exports.watch = JSwatch = (cb) => {
    return watch(dirs.input + '/**/*.ts', {
        ignored: [
            dirs.input + '/**/*.d.ts', //	Exclude all typings.
        ],
    }).on('change', (path) => {
        console.log('Change detected to .ts file "' + path + '"');

        //	Changing any file only affects the files in the same directory:
        //		- transpile only the directory to js;
        //		- pack all.
        var files = path.split('/');
        files.pop();
        files.shift();
        files = files.join('/');

        var JStranspileOne = (cb) => JStranspile(cb, 
            dirs.input + '/' + files + '/*.ts',
            dirs.output + '/' + files
        );

        series(JStranspileOne, JSpack)(() => {
            console.log('JS transpiled and concatenated.');
        });
    });
};

// Transpile the speicfied TS files (defaults to all TS files) to JS.
const JStranspile = (cb, input, output) => {
    return src([
        dirs.input + '/**/*.d.ts', // Include all typings.
        input || (dirs.input + '/**/*.ts'), // Include the needed ts files.
    ])
        .pipe(
            typescript({
                target: 'es2016',
                module: 'es6',
                moduleResolution: 'node',
                resolveJsonModule: true,
            })
        )
        .pipe(dest(output || dirs.output));
};

// Pack the files.
const JSpack = () => {
    var input = dirs.build || dirs.input;

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
        .pipe(dest(dirs.output));
};
