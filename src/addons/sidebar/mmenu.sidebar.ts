import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

Mmenu.options.sidebar = options;


export default function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas ) {
		return;
	}

	var options = this.opts.sidebar;


	//	Extend shorthand options
	if ( typeof options == 'string' ||
	   ( typeof options == 'boolean' && options ) ||
		 typeof options == 'number'
	) {
		(options as mmLooseObject) = {
			expanded: options
		};
	}

	if ( typeof options != 'object' ) {
		(options as mmLooseObject) = {};
	}

	//	Extend collapsed shorthand options.
	if ( typeof options.collapsed == 'boolean' && options.collapsed ) {
		(options.collapsed as mmLooseObject) = {
			use: 'all'
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
		(options.collapsed as mmLooseObject) = {};
	}

	if ( typeof options.collapsed.use == 'number' ) {
		options.collapsed.use = '(min-width: ' + options.collapsed.use + 'px)';
	}

	//	Extend expanded shorthand options.
	if ( typeof options.expanded == 'boolean' && options.expanded ) {
		options.expanded = {
			use: 'all'
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
	//	/Extend shorthand options


	this.opts.sidebar = Mmenu.extend( options, Mmenu.options.sidebar );


	var clsclpsd = 'mm-wrapper_sidebar-collapsed',
		clsxpndd = 'mm-wrapper_sidebar-expanded';


	//	Collapsed
	if ( options.collapsed.use ) {
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_sidebar-collapsed' );

			if ( options.collapsed.blockMenu &&
				this.opts.offCanvas &&
				!Mmenu.DOM.children( this.node.menu, '.mm-menu__blocker' )[ 0 ]
			) {
				let anchor = Mmenu.DOM.create( 'a.mm-menu__blocker' );
					anchor.setAttribute( 'href', '#' + this.node.menu.id );
				
				this.node.menu.prepend( anchor );
			}

			if ( options.collapsed.hideNavbar ) {
				this.node.menu.classList.add( 'mm-menu_hidenavbar' );
			}

			if ( options.collapsed.hideDivider ) {
				this.node.menu.classList.add( 'mm-menu_hidedivider' );
			}
		});

		if ( typeof options.collapsed.use == 'boolean' ) {
			this.bind( 'initMenu:after', () => {
				document.documentElement.classList.add( clsclpsd );
			});

		} else {
			this.matchMedia( options.collapsed.use,
				() => {
					document.documentElement.classList.add( clsclpsd );
				},
				() => {
					document.documentElement.classList.remove( clsclpsd );
				}
			);
		}
	}


	//	Expanded
	if ( options.expanded.use ) {
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_sidebar-expanded' );
		});

		if ( typeof options.expanded.use == 'boolean' ) {
			this.bind( 'initMenu:after', () => {
				document.documentElement.classList.add( clsxpndd );
				this.open();
			});

		} else {
			this.matchMedia( options.expanded.use,
				() => {
					document.documentElement.classList.add( clsxpndd );
					if ( !document.documentElement.matches( '.mm-wrapper_sidebar-closed' ) ) {
						this.open();
					}
				},
				() => {
					document.documentElement.classList.remove( clsxpndd );
					this.close();
				}
			);
		}

		this.bind( 'close:start', () => {
			if ( document.documentElement.matches( '.' + clsxpndd ) ) {
				document.documentElement.classList.add( 'mm-wrapper_sidebar-closed' );
			}
		});

		this.bind( 'open:start', () => {
			document.documentElement.classList.remove( 'mm-wrapper_sidebar-closed' );
		});


		//	Add click behavior.
		//	Prevents default behavior when clicking an anchor
		this.clck.push((
			anchor	: HTMLElement,
			args 	: mmClickArguments
		) => {

			if ( args.inMenu && args.inListview ) {
				if ( document.documentElement.matches( '.mm-wrapper_sidebar-expanded' ) ) {
					return {
						close: false
					};
				}
			}
		});

	}
};
