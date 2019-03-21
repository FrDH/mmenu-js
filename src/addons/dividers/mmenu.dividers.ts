import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

Mmenu.options.dividers = options;


export default function(
	this : Mmenu
) {
	var options = this.opts.dividers;


	//	Extend shorthand options
	if ( typeof options == 'boolean' ) {
		(options as mmLooseObject) = {
			add	: options
		};
	}
	if ( typeof options != 'object' ) {
		(options as mmLooseObject) = {};
	}
	if ( options.addTo == 'panels' ) {
		options.addTo = '.mm-panel';
	}
	//	/Extend shorthand options


	this.opts.dividers = Mmenu.extend( options, Mmenu.options.dividers );


	//	Add classname to the menu to specify the type of the dividers
	if ( options.type ) {
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_dividers-' + options.type );
		});
	}

	//	Add dividers
	if ( options.add ) {
		this.bind( 'initListview:after', ( 
			panel : HTMLElement
		) => {

			if ( !panel.matches( options.addTo ) ) {
				return;
			}

			Mmenu.DOM.find( panel, '.mm-listitem_divider' )
				.forEach(( divider ) => {
					divider.remove();
				});

			Mmenu.DOM.find( panel, '.mm-listview' )
				.forEach(( listview ) => {
					var lastletter = '',
						listitems  = Mmenu.DOM.children( listview );

					Mmenu.filterListItems( listitems )
						.forEach(( listitem ) => {
							let letter = Mmenu.DOM.children( listitem, '.mm-listitem__text' )[ 0 ]
								.textContent.trim().toLowerCase()[ 0 ];

							if ( letter.length && letter != lastletter ) {
								lastletter = letter;
								let divider = Mmenu.DOM.create( 'li.mm-listitem.mm-listitem_divider' );
									divider.textContent = letter;

								listview.insertBefore( divider, listitem );  
							}
						});
				});
		});
	}
};

