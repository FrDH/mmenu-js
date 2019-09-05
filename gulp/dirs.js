const getOption = opt => {
    var index = process.argv.indexOf('--' + opt);
    if (index > -1) {
        opt = process.argv[index + 1];
        return opt && opt.slice(0, 2) !== '--' ? opt : false;
    }
    return false;
};

module.exports = findCustom => {
    var dirs = {
        input: 'src',
        output: 'dist',
        build: null
    };

    if (!findCustom) {
        return dirs;
    }

    var i = getOption('i'),
        o = getOption('o');

    // Set custom input dir.
    if (i) {
        dirs.build = i;
    }

    // Set custom output dir.
    if (o) {
        dirs.output = o;
    }

    return dirs;
};
