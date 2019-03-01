import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

Mmenu.options.iconPanels = options;


export default function(
	this : Mmenu
) {
	var options = this.opts.iconPanels;

	var keepFirst = false;


	//	Extend shorthand options
	if ( typeof options == 'boolean' ) {
		(options as mmLooseObject) = {
			add : options
		};
	}
	if ( typeof options == 'number' ||
		 typeof options == 'string'
	) {
		(options as mmLooseObject) = {
			add 	: true,
			visible : options
		};
	}

	if ( typeof options != 'object' ) {
		(options as mmLooseObject) = {};
	}

	if ( options.visible == 'first' ) {
		keepFirst = true;
		options.visible = 1;
	}
	//	/Extend shorthand options


	this.opts.iconPanels = Mmenu.extend( options, Mmenu.options.iconPanels );


	options.visible = Math.min( 3, Math.max( 1, (options.visible as number) ) );
	options.visible++;


	//	Add the iconpanels
	if ( options.add ) {
		this.bind( 'initMenu:after', () => {
			var cls = [ 'mm-menu_iconpanel' ];

			if ( options.hideNavbar ) {
				cls.push( 'mm-menu_hidenavbar' );
			}

			if ( options.hideDivider ) {
				cls.push( 'mm-menu_hidedivider' );
			}

			this.node.menu.classList.add( ...cls );
		});

		var cls = '';
		if ( !keepFirst ) {
			for ( var i = 0; i <= options.visible; i++ ) {
				cls += ' mm-panel_iconpanel-' + i;
			}

			if ( cls.length ) {
				cls = cls.slice( 1 );
			}
		}
		const setPanels = (
			panel ?: HTMLElement
		) => {

			var panels = Mmenu.DOM.children( this.node.pnls, '.mm-panels' );
			panel = panel || panels[ 0 ];

			if ( panel.parentElement.matches( '.mm-listitem_vertical' ) ) {
				return;
			}

			if ( keepFirst ) {
				panels.forEach(( panel, p ) => {
					panel.classList[ p == 0 ? 'add' : 'remove' ]( 'mm-panel_iconpanel-first' );
				});

			} else {
				//	Remove the "iconpanel" classnames from all panels.
				panels.forEach(( panel ) => {
					panel.classList.remove( cls );
				});

				//	Filter out panels that are not opened.
				panels = panels.filter( panel => panel.matches( '.mm-panel_opened-parent' ) );

				//	Add the current panel to the list.
				//	TODO: check for duplicate?
				panels.push( panel );

				//	Remove the "hidden" classname from all opened panels.
				panels.forEach(( panel ) => {
					panel.classList.remove( 'mm-hidden' );
				});

				//	Slice the opened panels to the max visible amount.
				panels = panels.slice( -options.visible );

				//	Add the "iconpanel" classnames.
				panels.forEach(( panel, p ) => {
					panel.classList.add( 'mm-panel_iconpanel-' + p );
				});
			}
		};

		this.bind( 'openPanel:start', 	setPanels );
		this.bind( 'initPanels:after', 	setPanels );

		this.bind( 'initListview:after', (
			panel : HTMLElement
		) => {
			if ( options.blockPanel &&
				!panel.parentElement.matches( '.mm-listitem_vertical' ) &&
				!Mmenu.DOM.children( panel, '.mm-panel__blocker' )[ 0 ]
			) {
				var anchor = Mmenu.DOM.create( 'a.mm-panel__blocker' );
					anchor.setAttribute( 'href', panel.closest( '.mm-panel' ).id );

				panel.prepend( anchor );
			}	
		});
	}
};
