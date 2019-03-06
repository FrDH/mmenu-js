const getOption = ( opt ) => {
	var index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) !== '--' ) ? opt : false;
	}
	return false;
};

exports.dirs = () => {
	var dirs = {
		input 		: 'src',
		output 		: 'dist',
		bin			: 'bin',
		buildInput	: null
	};

	var i = getOption( 'i' ),
		o = getOption( 'o' );

	// Set custom input dir.
	if ( i )
	{
		dirs.buildInput = i;
	}

	// Set custom output dir.
	if ( o && o != dirs.input && o != dirs.bin )
	{
		dirs.output = o;
	}

	return dirs;
};