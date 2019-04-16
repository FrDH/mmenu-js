import { type } from '../../core/_helpers';

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

	if ( type( options ) == 'array' ) {
		options = {
			use: true,
			top: (options as any)
		};
	}

	if ( type( options ) != 'object' ) {
		options = {};
	}

	if ( typeof options.use == 'undefined' ) {
		options.use = true;
	}

	if ( typeof options.use == 'boolean' && options.use ) {
		options.use = true;
	}

	return options;
};