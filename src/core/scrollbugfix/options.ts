const options : mmOptionsScrollbugfix = {
	fix: true
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions( 
	options : mmOptionsScrollbugfix
) : mmOptionsScrollbugfix {

	if ( typeof options == 'boolean' ) {
		options = {
			fix: options
		};
	}

	if ( typeof options != 'object' ) {
		options = {};
	}

	return options;
};