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

		var $pnls = Mmenu.$( panels );

		var $spnl = Mmenu.$();

		//	Add the search panel
		if ( opts.panel.add )
		{
			$spnl = this._initSearchPanel( $pnls );
		}

		//	Add the searchfield
		var $field : JQuery;
		switch( opts.addTo )
		{
			case 'panels':
				$field = $pnls;
				break;

			case 'panel':
				$field = $spnl;
				break;

			default:
				if ( typeof opts.addTo == 'string' )
				{
					$field = Mmenu.$(this.node.menu).find( opts.addTo );
				}
				else
				{
					$field = Mmenu.$(opts.addTo);
				}
				break;
		}

		$field.each(
			( e, elem ) => {
				let $srch = this._initSearchfield( elem );
				if ( opts.search && $srch.length )
				{
					this._initSearching( $srch );
				}
			}
		);


		//	Add the no-results message
		if ( opts.noResults )
		{
			let $results = ( opts.panel.add ) ? $spnl : $pnls;
			$results.each(
				( i, panel ) => {
					this._initNoResultsMsg( panel );
				}
			);
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
				var $a = Mmenu.$(anchor);

				//	Clicking the clear button
				if ( anchor.matches( '.mm-btn_close' ) )
				{
					var $inpt = $a.closest( '.mm-searchfield' ).find( 'input' );
					$inpt.val( '' );
					this.search( $inpt );

					return true;
				}

				//	Clicking the submit button
				if ( anchor.matches( '.mm-btn_next' ) )
				{
					$a.closest( '.mm-searchfield' )
						.submit();

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
	$panels	: JQuery
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	//	Only once
	if (  Mmenu.DOM.children( this.node.pnls, '.mm-panel_search' ).length )
	{
		return Mmenu.$();
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

	return Mmenu.$(searchpanel);
};

Mmenu.prototype._initSearchfield = function( 
	this	: Mmenu,
	wrapper	: HTMLElement
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	//	No searchfield in vertical submenus	
	if ( wrapper.parentElement.matches( '.mm-listitem_vertical' ) )
	{
		return Mmenu.$();
	}

	//	Only one searchfield per panel
	var form = Mmenu.DOM.find( wrapper, '.mm-searchfield' );
	if ( form.length )
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


	var $srch = Mmenu.$( '<' + ( conf.form ? 'form' : 'div' ) + ' class="mm-searchfield" />' );

	var field = Mmenu.DOM.create( 'div.mm-searchfield__input' );
		
	var input = (Mmenu.DOM.create( 'input' ) as HTMLInputElement);
		input.type = 'text';
		input.autocomplete = 'off';
		input.placeholder = (this.i18n( opts.placeholder ) as string);

	field.append( input );
	$srch.append( field );

	wrapper.prepend( $srch[ 0 ] );
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
	addAttributes( $srch[0], conf.form );
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
			anchor.innerText =  (this.i18n( 'cancel' ) as string);

		$srch.append( anchor );
	}

	return $srch;
};

Mmenu.prototype._initSearching = function( 
	this	: Mmenu,
	$srch	: JQuery
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;

	var data : mmLooseObject = {};

	//	In searchpanel
	if ( $srch.closest( '.mm-panel_search' ).length )
	{
		data.$pnls =  Mmenu.$(this.node.pnls).find( '.mm-panel' );
		data.$nrsp = $srch.closest( '.mm-panel' );
	}

	//	In a panel
	else if (  $srch.closest( '.mm-panel' ).length )
	{
		data.$pnls = $srch.closest( '.mm-panel' );
		data.$nrsp = data.$pnls;
	}

	//	Not in a panel, global
	else
	{
		data.$pnls =  Mmenu.$(this.node.pnls).find( '.mm-panel' );
		data.$nrsp = Mmenu.$(this.node.menu);
	}

	//	Filter out vertical submenus
	data.$pnls = data.$pnls.not(( i, panel ) => {
		let parent = panel.parentElement;
		return parent && parent.matches( '.mm-listitem_vertical' );
	});

	//	Filter out search panel
	if ( opts.panel.add )
	{
		data.$pnls = data.$pnls.not( '.mm-panel_search' );
	}


	var $itms = data.$pnls.find( '.mm-listitem' );

	var searchpanel = Mmenu.DOM.children( this.node.pnls, '.mm-panel_search' )[ 0 ],
		input 		= Mmenu.DOM.find( $srch[ 0 ], 'input' )[ 0 ],
		cancel 		= Mmenu.DOM.find( $srch[ 0 ], '.mm-searchfield__cancel' )[ 0 ];

	data.$itms = $itms.not( '.mm-listitem_divider' );
	data.$dvdr = $itms.filter( '.mm-listitem_divider' );


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

	(input as any).mmSearchfield = data;
	Mmenu.$(input).off( 'input.mm-searchfield' ) // 	TOOD: is dit nodig?
		.on(  'input.mm-searchfield',
			( e ) => {
				switch( e.keyCode )
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
						this.search( Mmenu.$(input) );
						break;
				}
			}
		);


	//	Fire once initially
	//	TODO better in initMenu:after or the likes
	this.search( Mmenu.$(input) );
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
		wrapper =  Mmenu.DOM.children( this.node.pnls, '.mm-panel' )[ 0 ];
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
	$inpt	: JQuery,
	query	: string
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;

	$inpt = $inpt || Mmenu.$(this.node.menu).find( '.mm-searchfield' ).children( 'input' ).first();
	query = query || '' + $inpt.val();
	query = query.toLowerCase().trim();


	var data  = ($inpt[ 0 ] as any).mmSearchfield;

	var $srch = $inpt.closest( '.mm-searchfield' ),
		$btns = $srch.find( '.mm-btn' ),
		$spnl =  Mmenu.$(this.node.pnls).children( '.mm-panel_search' ),
		$pnls = data.$pnls,
		$itms = data.$itms,
		$dvdr = data.$dvdr,
		$nrsp = data.$nrsp;




	//	Reset previous results
	$itms
		.removeClass( 'mm-listitem_nosubitems' )

	//	TODO: dit klopt niet meer	
		.find( '.mm-btn_fullwidth-search' )
		.removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );

	$spnl.children( '.mm-listview' ).empty();

	$pnls.each(( p, panel ) => {
		panel.scrollTop = 0;
	})


	//	Search
	if ( query.length )
	{

		//	Initially hide all listitems
		$itms
			.add( $dvdr )
			.addClass( 'mm-hidden' );


		//	Re-show only listitems that match
		$itms
			.each(
				( i, item ) => {
					var $item = Mmenu.$(item),
						_search = '.mm-listitem__text'; // 'a'

					if ( opts.showTextItems || ( opts.showSubPanels && item.querySelector( '.mm-btn_next' ) ) )
					{
						// _search = 'a, span';
					}
					else
					{
						_search = 'a' + _search;
					}

					if ( Mmenu.DOM.children( item, _search )[ 0 ].innerText.toLowerCase().indexOf( query ) > -1 )
					{
						item.classList.remove( 'mm-hidden' );
					}
				}
			);


		//	Show all mached listitems in the search panel
		if ( opts.panel.add )
		{
			//	Clone all matched listitems into the search panel
			var listitems = [];
			$pnls
				.each(( p, panel ) => {
					let items = Mmenu.filterListItems( Mmenu.DOM.find( panel, '.mm-listitem' ) );

					if ( items.length )
					{
						if ( opts.panel.dividers )
						{
							let divider = Mmenu.DOM.create( 'li.mm-listitem.mm-listitem_divider' );
								divider.innerHTML = panel.querySelector( '.mm-navbar__title' ).innerHTML;

							listitems.push( divider );
						}
						items.forEach(( item ) => {
							listitems.push( item.cloneNode( true ) );
						});
					}
				});


			//	Remove toggles, checks and open buttons
			listitems.forEach(( listitem ) => {
				listitem.querySelectorAll( '.mm-toggle, .mm-check, .mm-btn' )
					.forEach(( element ) => {
						element.remove();
					});
			});


			//	Add to the search panel
			$spnl.children( '.mm-listview' ).append( listitems );


			//	Open the search panel
			this.openPanel( $spnl[ 0 ] );
		}

		else
		{

			//	Also show listitems in sub-panels for matched listitems
			if ( opts.showSubPanels )
			{
				$pnls.each(( p, panel ) => {
					let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );

					Mmenu.filterListItems( listitems )
						.forEach(( listitem ) => {
							let child : HTMLElement = (listitem as any).mmChild;
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
			Mmenu.$( $pnls.get().reverse() )
				.each(( p, panel ) => {
					let parent : HTMLElement = (panel as any).mmParent;

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

						else if ( !$inpt.closest( '.mm-panel' ).length )
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
			$pnls.each(( p, panel ) => {
				let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );
				Mmenu.filterListItems( listitems )
					.forEach(( listitem ) => {
						Mmenu.$(listitem).prevAll( '.mm-listitem_divider' )
							.first()
							.removeClass( 'mm-hidden' );
					});
			});

		}


		//	Show submit / clear button
		$btns.removeClass( 'mm-hidden' );


		//	Show/hide no results message
		$nrsp.find( '.mm-panel__noresultsmsg' )[ $itms.not( '.mm-hidden' ).length ? 'addClass' : 'removeClass' ]( 'mm-hidden' );


		if ( opts.panel.add )
		{
			//	Hide splash
			if ( opts.panel.splash )
			{
				$spnl.find( '.mm-panel__searchsplash' ).addClass( 'mm-hidden' );
			}

			//	Re-show original listitems when in search panel
			$itms
				.add( $dvdr )
				.removeClass( 'mm-hidden' );
		}
	}


	//	Don't search
	else
	{

		//	Show all items
		$itms
			.add( $dvdr )
			.removeClass( 'mm-hidden' );

		//	Hide submit / clear button
		$btns.addClass( 'mm-hidden' );

		//	Hide no results message
		$nrsp.find( '.mm-panel__noresultsmsg' ).addClass( 'mm-hidden' );


		if ( opts.panel.add )
		{
			//	Show splash
			if ( opts.panel.splash )
			{
				$spnl.find( '.mm-panel__searchsplash' ).removeClass( 'mm-hidden' );
			}

			//	Close panel 
			else if ( !$inpt.closest( '.mm-panel_search' ).length )
			{
				this.openPanel(  Mmenu.$(this.node.pnls).children( '.mm-panel_opened-parent' ).last()[0] );
			}
		}
	}


	//	Update for other addons
	this.trigger( 'updateListview' );
};

