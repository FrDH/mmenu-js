const options : mmOptionsSetselected = {
	current: true,
	hover: false,
	parent: false
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions( 
	options : mmOptionsSetselected
) : mmOptionsSetselected {

	if ( typeof options == 'boolean' ) {
		options = {
			hover	: options,
			parent	: options
		};
	}

	if ( typeof options != 'object' ) {
		options = {};
	}

	return options;
};