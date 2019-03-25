const options : mmOptionsSidebar = {
	collapsed: {
		use: false,
		blockMenu: true,
		hideDivider: false,
		hideNavbar: true
	},
	expanded: {
		use: false
	}
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions( 
	options : mmOptionsSidebar
) : mmOptionsSidebar {

	if ( typeof options == 'string' ||
	   ( typeof options == 'boolean' && options ) ||
		 typeof options == 'number'
	) {
		options = {
			expanded: options
		};
	}

	if ( typeof options != 'object' ) {
		options = {};
	}

	//	Extend collapsed shorthand options.
	if ( typeof options.collapsed == 'boolean' && options.collapsed ) {
		options.collapsed = {
			use: true
		};
	}

	if ( typeof options.collapsed == 'string' ||
		 typeof options.collapsed == 'number'
	) {
		(options.collapsed as mmLooseObject) = {
			use: options.collapsed
		};
	}

	if ( typeof options.collapsed != 'object' ) {
		options.collapsed = {};
	}

	if ( typeof options.collapsed.use == 'number' ) {
		options.collapsed.use = '(min-width: ' + options.collapsed.use + 'px)';
	}

	//	Extend expanded shorthand options.
	if ( typeof options.expanded == 'boolean' && options.expanded ) {
		options.expanded = {
			use: true
		};
	}

	if ( typeof options.expanded == 'string' ||
		 typeof options.expanded == 'number'
	) {
		options.expanded = {
			use: options.expanded
		};
	}

	if ( typeof options.expanded != 'object' ) {
		(options.expanded as mmLooseObject) = {};
	}

	if ( typeof options.expanded.use == 'number' ) {
		options.expanded.use = '(min-width: ' + options.expanded.use + 'px)';
	}

	return options;
};