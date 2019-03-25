const options : mmOptionsIconbar = {
	use: false,
	top: [],
	bottom : [],
	position: 'left',
	type: 'default'
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions( 
	options : mmOptionsIconbar
) : mmOptionsIconbar {

	//	TODO
	if ( Mmenu.typeof( options ) == 'array' ) {
		options = {
			use: true,
			top: options
		};
	}

	if ( typeof options != 'object' ) {
		options = {};
	}

	if ( typeof options.use == 'undefined' ) {
		options.use = true;
	}

	if ( typeof options.use == 'boolean' && options.use ) {
		options.use = true;
	}

	if ( typeof options.use == 'number' ) {
		options.use = '(min-width: ' + options.use + 'px)';
	}

	return options;
};