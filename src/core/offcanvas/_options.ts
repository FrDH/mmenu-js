const options: mmOptionsOffcanvas = {
	blockUI: true
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions(
	options: mmOptionsOffcanvas
): mmOptionsOffcanvas {

	if (typeof options != 'object') {
		options = {};
	}

	return options;
};
