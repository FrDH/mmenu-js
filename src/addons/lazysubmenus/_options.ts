const options : mmOptionsLazysubmenus = {
	load: false
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions( 
	options : mmOptionsLazysubmenus
) : mmOptionsLazysubmenus {

	if ( typeof options == 'boolean' ) {
		options = {
			load : options
		};
	}

	if ( typeof options != 'object' ) {
		options = {};
	}

	return options;
};