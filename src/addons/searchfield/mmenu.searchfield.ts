Mmenu.addons.searchfield = function(
	this : Mmenu
) {
	var opts = this.opts.searchfield,
		conf = this.conf.searchfield;


	//	Extend shorthand options.
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	if ( typeof opts.panel == 'boolean' )
	{
		(opts.panel as mmLooseObject) = {
			add: opts.panel
		};
	}
	if ( typeof opts.panel != 'object' )
	{
		(opts.panel as mmLooseObject) = {};
	}
	//	/Extend shorthand options.


	if ( !opts.add )
	{
		return;
	}


	//	Extend logical options.
	if ( opts.addTo == 'panel' )
	{
		opts.panel.add = true;
	}
	if ( opts.panel.add )
	{
		opts.showSubPanels = false;

		if ( opts.panel.splash )
		{
			opts.cancel = true;
		}
	}
	//	/Extend logical options.


	this.opts.searchfield = Mmenu.extend( opts, Mmenu.options.searchfield );


	//	Blur searchfield
	this.bind( 'close:start', () => {
		Mmenu.DOM.find( this.node.menu, '.mm-searchfield' )
			.forEach(( input ) => {
				input.blur();
			});
	});


	this.bind( 'initPanels:after', (
		panels : HTMLElement[]
	) => {

		var searchpanel : HTMLElement = null;

		//	Add the search panel
		if ( opts.panel.add )
		{
			searchpanel = this._initSearchPanel( panels );
		}

		//	Add the searchfield
		var addTo : HTMLElement[] = null;
		switch( opts.addTo )
		{
			case 'panels':
				addTo = panels;
				break;

			case 'panel':
				addTo = [ searchpanel ];
				break;

			default:
				if ( typeof opts.addTo == 'string' )
				{
					addTo = Mmenu.DOM.find( this.node.menu, opts.addTo );
				}
				else if ( Mmenu.typeof( opts.addTo ) == 'array' )
				{
					addTo = opts.addTo;
				}
				break;
		}

		addTo.forEach(( form ) => {
			form = this._initSearchfield( form );
			if ( opts.search && form )
			{
				this._initSearching( form );
			}
		});


		//	Add the no-results message
		if ( opts.noResults )
		{
			( opts.panel.add ? [ searchpanel ] : panels ).forEach(( panel ) => {
				this._initNoResultsMsg( panel );
			});
		}
	});


	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor
	this.clck.push((
		anchor	: HTMLElement,
		args 	: mmClickArguments
	) => {
		if ( args.inMenu )
		{
			if ( anchor.matches( '.mm-searchfield__btn' ) )
			{

				//	Clicking the clear button
				if ( anchor.matches( '.mm-btn_close' ) )
				{
					let form  = (anchor.closest( '.mm-searchfield' ) as HTMLElement),
						input = (Mmenu.DOM.find( form, 'input' )[ 0 ] as HTMLInputElement);
					
					input.value = '';
					this.search( input );

					return true;
				}

				//	Clicking the submit button
				if ( anchor.matches( '.mm-btn_next' ) )
				{
					let form = anchor.closest( 'form' );
					if ( form )
					{
						form.submit();
					}

					return true;
				}
			}
		}
	});

};	



//	Default options and configuration.
Mmenu.options.searchfield = {
	add 			: false,
	addTo			: 'panels',
	cancel 			: false,
	noResults		: 'No results found.',
	placeholder		: 'Search',
	panel 			: {
		add 			: false,
		dividers		: true,
		fx 				: 'none',
		id				: null,
		splash			: null,
		title			: 'Search'
	},
	search			: true,
	showTextItems	: false,
	showSubPanels	: true
};

Mmenu.configs.searchfield = {
	clear			: false,
	form			: false,
	input			: false,
	submit			: false
};
	

	
Mmenu.prototype._initSearchPanel = function( 
	this	: Mmenu,
	panels	: HTMLElement[]
) : HTMLElement {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	//	Only once
	if (  Mmenu.DOM.children( this.node.pnls, '.mm-panel_search' ).length )
	{
		return null;
	}

	var searchpanel = Mmenu.DOM.create( 'div.mm-panel_search' ),
		listview 	= Mmenu.DOM.create( 'ul' );
	
	searchpanel.append( listview );
	this.node.pnls.append( searchpanel )

	if ( opts.panel.id )
	{
		searchpanel.id = opts.panel.id;
	}
	if ( opts.panel.title )
	{
		searchpanel.setAttribute( 'data-mm-title', opts.panel.title );
	}

	switch ( opts.panel.fx )
	{
		case false:
			break;

		case 'none':
			searchpanel.classList.add( 'mm-panel_noanimation' );
			break;

		default:
			searchpanel.classList.add( 'mm-panel_fx-' + opts.panel.fx );
			break;
	}

	//	Add splash content
	if ( opts.panel.splash )
	{
		let splash = Mmenu.DOM.create( 'div.mm-panel__searchsplash' );
			splash.innerHTML = opts.panel.splash;

		searchpanel.append( splash );
	}

	this._initPanels( [ searchpanel ] );

	return searchpanel;
};

Mmenu.prototype._initSearchfield = function( 
	this	: Mmenu,
	wrapper	: HTMLElement
) : HTMLElement {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	//	No searchfield in vertical submenus	
	if ( wrapper.parentElement.matches( '.mm-listitem_vertical' ) )
	{
		return null;
	}

	//	Only one searchfield per panel
	var form = Mmenu.DOM.find( wrapper, '.mm-searchfield' )[ 0 ];
	if ( form )
	{
		return form;
	}


	function addAttributes( 
		element	: HTMLElement,
		attr	: mmLooseObject | boolean
	) {
		if ( attr )
		{
			for ( var a in (attr as mmLooseObject) )
			{
				element.setAttribute( a, attr[ a ] );
			}
		}
	}


	var form  = Mmenu.DOM.create( ( conf.form ? 'form' : 'div' ) + '.mm-searchfield' ),
		field = Mmenu.DOM.create( 'div.mm-searchfield__input' ),
		input = (Mmenu.DOM.create( 'input' ) as HTMLInputElement);
	
	input.type = 'text';
	input.autocomplete = 'off';
	input.placeholder = (this.i18n( opts.placeholder ) as string);

	field.append( input );
	form.append( field );

	wrapper.prepend( form );
	if ( wrapper.matches( '.mm-panel' ) )
	{
		wrapper.classList.add( 'mm-panel_has-searchfield' );
	}


	//	Add attributes to the input
	addAttributes( input, conf.input );
	

	//	Add the clear button
	if ( conf.clear )
	{
		let anchor = Mmenu.DOM.create( 'a.mm-btn.mm-btn_close.mm-searchfield__btn' );
			anchor.setAttribute( 'href', '#' );

		field.append( anchor );
	}


	//	Add attributes and submit to the form
	addAttributes( form, conf.form );
	if ( conf.form && conf.submit && !conf.clear )
	{
		let anchor = Mmenu.DOM.create( 'a.mm-btn.mm-btn_next.mm-searchfield__btn' );
			anchor.setAttribute( 'href', '#' );

		field.append( anchor );
	}

	if ( opts.cancel )
	{
		let anchor = Mmenu.DOM.create( 'a.mm-searchfield__cancel' );
			anchor.setAttribute( 'href', '#' );
			anchor.textContent =  (this.i18n( 'cancel' ) as string);

		form.append( anchor );
	}

	return form;
};

Mmenu.prototype._initSearching = function( 
	this	: Mmenu,
	form	: HTMLElement
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	var data : mmLooseObject = {};

	//	In the searchpanel.
	if ( form.closest( '.mm-panel_search' ) )
	{
		data.panels 	= Mmenu.DOM.find( this.node.pnls, '.mm-panel' );
		data.noresults 	= [ form.closest( '.mm-panel' ) ];
	}

	//	In a panel
	else if ( form.closest( '.mm-panel' ) )
	{
		data.panels 	= [ form.closest( '.mm-panel' ) ];
		data.noresults 	= data.panels;
	}

	//	Not in a panel, global
	else
	{
		data.panels 	= Mmenu.DOM.find( this.node.pnls, '.mm-panel' );
		data.noresults 	= [ this.node.menu ];
	}

	//	Filter out vertical submenus
	data.panels = data.panels.filter( panel => !panel.parentElement.matches( '.mm-listitem_vertical' ) );

	//	Filter out search panel
	data.panels = data.panels.filter( panel => !panel.matches( '.mm-panel_search' ) );


	var listitems : HTMLElement[] = [];
	data.panels.forEach(( panel ) => {
		listitems.push( ...Mmenu.DOM.find( panel, '.mm-listitem' ) );
	});

	data.listitems  = listitems.filter( listitem => !listitem.matches( '.mm-listitem_divider' ) );
	data.dividers	= listitems.filter( listitem => listitem.matches( '.mm-listitem_divider' ) );

	input[ 'mmSearchfield' ] = data;


	var searchpanel : HTMLElement = Mmenu.DOM.children( this.node.pnls, '.mm-panel_search' )[ 0 ],
		input 		: HTMLElement = Mmenu.DOM.find( form, 'input' )[ 0 ],
		cancel 		: HTMLElement = Mmenu.DOM.find( form, '.mm-searchfield__cancel' )[ 0 ];


	if ( opts.panel.add && opts.panel.splash )
	{
		Mmenu.$(input)
			.off( 'focus.mm-searchfield-splash' )
			.on(  'focus.mm-searchfield-splash',
				( e ) => {
					this.openPanel( searchpanel );
				}
			);
	}
	if ( opts.cancel )
	{
		Mmenu.$(input)
			.off( 'focus.mm-searchfield-cancel' ) //	TODO, is this really needed?
			.on(  'focus.mm-searchfield-cancel',
				( e ) => {
					cancel.classList.add( 'mm-searchfield__cancel-active' );
				}
			);


		Mmenu.$(cancel)
			.off( 'click.mm-searchfield-splash' ) //	TODO, is this really needed?
			.on(  'click.mm-searchfield-splash',
				( e ) => {
					e.preventDefault();
					cancel.classList.remove( 'mm-searchfield__cancel-active' );

					if ( searchpanel.matches( '.mm-panel_opened' ) )
					{
						let parents = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened-parent' );
						if ( parents.length )
						{
							this.openPanel( parents[ parents.length - 1 ] );
						}
					}
				}
			);
	}

	if ( opts.panel.add && opts.addTo == 'panel' )
	{
		this.bind( 'openPanel:finish', ( 
			panel : HTMLElement
		) => {
			if ( panel === searchpanel )
			{
				input.focus();
			}
		});
	}

	Mmenu.$(input)
		.off( 'input.mm-searchfield' ) // 	TOOD: is dit nodig?
		.on(  'input.mm-searchfield',
			( evnt ) => {
				switch( evnt.keyCode )
				{
					case 9:		//	tab
					case 16:	//	shift
					case 17:	//	control
					case 18:	//	alt
					case 37:	//	left
					case 38:	//	top
					case 39:	//	right
					case 40:	//	bottom
						break;

					default:
						this.search( input );
						break;
				}
			}
		);


	//	Fire once initially
	//	TODO better in initMenu:after or the likes
	this.search( input );
};	

Mmenu.prototype._initNoResultsMsg = function( 
	this	: Mmenu,
	wrapper	: HTMLElement
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;

	//	Not in a panel
	if ( !wrapper.closest( '.mm-panel' ) )
	{
		wrapper = Mmenu.DOM.children( this.node.pnls, '.mm-panel' )[ 0 ];
	}

	//	Only once
	if ( Mmenu.DOM.children( wrapper, '.mm-panel__noresultsmsg' ).length )
	{
		return;
	}

	//	Add no-results message
	var message = Mmenu.DOM.create( 'div.mm-panel__noresultsmsg.mm-hidden' );
		message.innerHTML = (this.i18n( opts.noResults ) as string);

	wrapper.prepend( message );
}

Mmenu.prototype.search = function( 
	this	: Mmenu,
	input	: HTMLInputElement,
	query	: string
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;

	query = query || '' + input.value;
	query = query.toLowerCase().trim();


	var data  = input[ 'mmSearchfield' ];

	var form 		: HTMLElement 	= (input.closest( '.mm-searchfield' ) as HTMLElement),
		buttons 	: HTMLElement[] = Mmenu.DOM.find( (form as HTMLElement), '.mm-btn' ),
		searchpanel : HTMLElement 	=  Mmenu.DOM.children( this.node.pnls, '.mm-panel_search' )[ 0 ];

	var panels 		: HTMLElement[] = data.panels,
		noresults 	: HTMLElement[] = data.noresults,
		listitems 	: HTMLElement[] = data.listitems,
		dividers 	: HTMLElement[] = data.dividers;




	//	Reset previous results
	listitems.forEach(( listitem ) => {
		listitem.classList.remove( 'mm-listitem_nosubitems' );
	});

	//	TODO: dit klopt niet meer	
		// Mmenu.$(listitems).find( '.mm-btn_fullwidth-search' )
		// .removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );

	Mmenu.DOM.children( searchpanel, '.mm-listview' )[ 0 ].innerHTML = '';

	panels.forEach(( panel ) => {
		panel.scrollTop = 0;
	})


	//	Search
	if ( query.length )
	{

		//	Initially hide all listitems
		listitems.forEach(( listitem ) => {
			listitem.classList.add( 'mm-hidden' );
		});
		dividers.forEach(( divider ) => {
			divider.classList.add( 'mm-hidden' );
		});


		//	Re-show only listitems that match
		listitems.forEach(( listitem ) => {
			var _search = '.mm-listitem__text'; // 'a'

			if ( opts.showTextItems || ( opts.showSubPanels && listitem.querySelector( '.mm-btn_next' ) ) )
			{
				// _search = 'a, span';
			}
			else
			{
				_search = 'a' + _search;
			}

			if ( Mmenu.DOM.children( listitem, _search )[ 0 ].textContent.toLowerCase().indexOf( query ) > -1 )
			{
				listitem.classList.remove( 'mm-hidden' );
			}
		});


		//	Show all mached listitems in the search panel
		if ( opts.panel.add )
		{
			//	Clone all matched listitems into the search panel
			let allitems : HTMLElement[] = [];
			panels.forEach(( panel ) => {
				let listitems = Mmenu.filterListItems( Mmenu.DOM.find( panel, '.mm-listitem' ) );

				if ( listitems.length )
				{
					if ( opts.panel.dividers )
					{
						let divider = Mmenu.DOM.create( 'li.mm-listitem.mm-listitem_divider' );
							divider.innerHTML = panel.querySelector( '.mm-navbar__title' ).innerHTML;

						listitems.push( divider );
					}
					listitems.forEach(( listitem ) => {
						allitems.push( (listitem.cloneNode( true ) as HTMLElement) );
					});
				}
			});


			//	Remove toggles, checks and open buttons
			allitems.forEach(( listitem ) => {
				listitem.querySelectorAll( '.mm-toggle, .mm-check, .mm-btn' )
					.forEach(( element ) => {
						element.remove();
					});
			});


			//	Add to the search panel
			Mmenu.DOM.children( searchpanel, '.mm-listview' )[ 0 ].append( ...listitems );


			//	Open the search panel
			this.openPanel( searchpanel );
		}

		else
		{

			//	Also show listitems in sub-panels for matched listitems
			if ( opts.showSubPanels )
			{
				panels.forEach(( panel ) => {
					let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );

					Mmenu.filterListItems( listitems )
						.forEach(( listitem ) => {
							let child : HTMLElement = listitem [ 'mmChild' ];
							if ( child )
							{
								Mmenu.DOM.find( child, '.mm-listitem' )
									.forEach(( listitem ) => {
										listitem.classList.remove( 'mm-hidden' );
									});
							}
						});
					});
			}


			//	Update parent for sub-panel
			panels.reverse()
				.forEach(( panel, p ) => {
					let parent : HTMLElement = panel[ 'mmParent' ];

					if ( parent )
					{
						//	The current panel has mached listitems
						let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );
						if ( Mmenu.filterListItems( listitems ).length )
						{
							//	Show parent
							if ( parent.matches( '.mm-hidden' ) )
							{
								parent.classList.remove( 'mm-hidden' );
								//	TODO: dit klopt niet meer...
								//	Het idee was een btn tijdelijk fullwidth te laten zijn
								// Mmenu.$(parent)

								// 	.children( '.mm-btn_next' )
								// 	.not( '.mm-btn_fullwidth' )
								// 	.addClass( 'mm-btn_fullwidth' )
								// 	.addClass( 'mm-btn_fullwidth-search' );
							}
						}

						else if ( !input.closest( '.mm-panel' ) )
						{
							if ( panel.matches( '.mm-panel_opened' ) || 
								panel.matches( '.mm-panel_opened-parent' )
							) {
								//	Compensate the timeout for the opening animation
								setTimeout(() => {
									this.openPanel( (parent.closest( '.mm-panel' ) as HTMLElement) );
								}, ( p + 1 ) * ( this.conf.openingInterval * 1.5 ));
							}
							parent.classList.add( 'mm-listitem_nosubitems' );
						}
					}
				});


			//	Show first preceeding divider of parent
			panels.forEach(( panel ) => {
				let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );
				Mmenu.filterListItems( listitems )
					.forEach(( listitem ) => {
						Mmenu.DOM.prevAll( listitem, '.mm-listitem_divider' )[ 0 ]
							.classList.remove( 'mm-hidden' );
					});
			});

		}


		//	Show submit / clear button
		buttons.forEach(( button ) => {
			button.classList.remove( 'mm-hidden' );
		});


		//	Show/hide no results message
		noresults.forEach(( wrapper ) => {
			Mmenu.DOM.find( wrapper, '.mm-panel__noresultsmsg' )[ 0 ]
				.classList[ listitems.filter( listitem => !listitem.matches( '.mm-hidden' ) ).length ? 'add' : 'remove' ]( 'mm-hidden' );
		});


		if ( opts.panel.add )
		{
			//	Hide splash
			if ( opts.panel.splash )
			{
				Mmenu.DOM.find( searchpanel, '.mm-panel__searchsplash' )[ 0 ]
					.classList.add( 'mm-hidden' );
			}

			//	Re-show original listitems when in search panel
			listitems.forEach(( listitem ) => {
				listitem.classList.remove( 'mm-hidden' );
			});
			dividers.forEach(( divider ) => {
				divider.classList.remove( 'mm-hidden' );
			});
		}
	}


	//	Don't search
	else
	{

		//	Show all items
		listitems.forEach(( listitem ) => {
			listitem.classList.remove( 'mm-hidden' );
		});
		dividers.forEach(( divider ) => {
			divider.classList.remove( 'mm-hidden' );
		});

		//	Hide submit / clear button
		buttons.forEach(( button ) => {
			button.classList.add( 'mm-hidden' );
		});

		//	Hide no results message
		noresults.forEach(( wrapper ) => {
			Mmenu.DOM.find( wrapper, '.mm-panel__noresultsmsg' )[ 0 ]
				.classList.add( 'mm-hidden' );
		});


		if ( opts.panel.add )
		{
			//	Show splash
			if ( opts.panel.splash )
			{
				Mmenu.DOM.find( searchpanel, '.mm-panel__searchsplash' )[ 0 ]
					.classList.remove( 'mm-hidden' );
			}

			//	Close panel 
			else if ( !input.closest( '.mm-panel_search' ) )
			{
				let opened = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened-parent' );
				this.openPanel( opened.slice( -1 )[ 0 ] );
			}
		}
	}


	//	Update for other addons
	this.trigger( 'updateListview' );
};

