import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

Mmenu.options.columns = options;


export default function(
	this : Mmenu
) {
	var options = this.opts.columns;


	//	Extend shorthand options
	if ( typeof options == 'boolean' ) {
		(options as mmLooseObject) = {
			add 	: options
		};
	}

	if ( typeof options == 'number' ) {
		options = {
			add 	: true,
			visible : options
		};
	}

	if ( typeof options != 'object' ) {
		(options as mmLooseObject) = {};
	}

	if ( typeof options.visible == 'number' ) {
		options.visible = {
			min 	: options.visible,
			max 	: options.visible
		};
	}
	//	/Extend shorthand options


	this.opts.columns = Mmenu.extend( options, Mmenu.options.columns );


	//	Add the columns
	if ( options.add ) {
		options.visible.min = Math.max( 1, Math.min( 6, options.visible.min ) );
		options.visible.max = Math.max( options.visible.min, Math.min( 6, options.visible.max ) );


		var colm = '',
			colp = '';

		for ( var i = 0; i <= options.visible.max; i++ ) {
			colm += ' mm-menu_columns-' + i;
			colp += ' mm-panel_columns-' + i;
		}
		if ( colm.length ) {
			colm = colm.slice( 1 );
			colp = colp.slice( 1 );
		}

		var rmvc = colp + ' mm-panel_opened mm-panel_opened-parent mm-panel_highest';


		//	Close all later opened panels
		this.bind( 'openPanel:before', (
			panel : HTMLElement
		) => {
			var parent : HTMLElement;

			if ( panel ) {
				parent = panel[ 'mmParent' ];
			}

			if ( !parent ) {
				return;
			}

			parent = (parent.closest( '.mm-panel' ) as HTMLElement);
			if ( !parent ) {
				return;
			}

			var classname = parent.className;
			if ( !classname.length ) {
				return;
			}

			classname = classname.split( 'mm-panel_columns-' )[ 1 ];
			if ( !classname ) {
				return;
			}

			var colnr = parseInt( classname.split( ' ' )[ 0 ], 10 ) + 1;
			while( colnr > 0 ) {
				panel = Mmenu.DOM.children( this.node.pnls, '.mm-panel_columns-' + colnr )[ 0 ];
				if ( panel ) {
					colnr++;
					panel.classList.remove( rmvc );
					panel.classList.add( 'mm-hidden' );
				} else {
					colnr = -1;
					break;
				}
			}
		});

		this.bind( 'openPanel:start', (
			panel : HTMLElement
		) => {
			var columns = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened-parent' ).length;
			if ( !panel.matches( '.mm-panel_opened-parent' ) ) {
				columns++;
			}
			columns = Math.min( options.visible.max, Math.max( options.visible.min, columns ) );

			this.node.menu.classList.remove( ...colm.split( ' ' ) );
			this.node.menu.classList.add( 'mm-menu_columns-' + columns );

			var panels : HTMLElement[] = [];
			Mmenu.DOM.children( this.node.pnls, '.mm-panel' )
				.forEach(( panel ) => {
					panel.classList.remove( ...colp.split( ' ' ) );
					if ( panel.matches( '.mm-panel_opened-parent' ) ) {
						panels.push( panel );
					}
				});

			panels.push( panel );
			panels.slice( -options.visible.max )
				.forEach(( panel, p ) => {
					panel.classList.add( 'mm-panel_columns-' + p );
				});
		});
	}
};
