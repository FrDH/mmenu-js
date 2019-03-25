import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

import { extendShorthandOptions } from './_options';
import { extend } from '../../core/_helpers';
import * as DOM from '../../core/_dom';

Mmenu.options.sidebar = options;


export default function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas ) {
		return;
	}

	var options = extendShorthandOptions( this.opts.sidebar );
	this.opts.sidebar = extend( options, Mmenu.options.sidebar );


	var clsclpsd = 'mm-wrapper_sidebar-collapsed',
		clsxpndd = 'mm-wrapper_sidebar-expanded';


	//	Collapsed
	if ( options.collapsed.use ) {
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_sidebar-collapsed' );

			if ( options.collapsed.blockMenu &&
				this.opts.offCanvas &&
				!DOM.children( this.node.menu, '.mm-menu__blocker' )[ 0 ]
			) {
				let anchor = DOM.create( 'a.mm-menu__blocker' );
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

		} else if ( typeof options.collapsed.use == 'string' ) {
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

		} else if ( typeof options.expanded.use == 'string' ) {
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
