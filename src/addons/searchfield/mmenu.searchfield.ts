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
		var $field;
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
				var $srch = this._initSearchfield( Mmenu.$(elem) );
				if ( opts.search && $srch.length )
				{
					this._initSearching( $srch );
				}
			}
		);


		//	Add the no-results message
		if ( opts.noResults )
		{
			var $results = ( opts.panel.add ) ? $spnl : $pnls;
			$results.each(
				( i, elem ) => {
					this._initNoResultsMsg( Mmenu.$(elem) );
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
	if (  Mmenu.$(this.node.pnls).children( '.mm-panel_search' ).length )
	{
		return Mmenu.$();
	}


	var $spnl = Mmenu.$( '<div class="mm-panel_search " />' )
		.append( '<ul />' )
		.appendTo( this.node.pnls );

	if ( opts.panel.id )
	{
		$spnl[ 0 ].id = opts.panel.id;
	}
	if ( opts.panel.title )
	{
		$spnl[ 0 ].setAttribute( 'data-mm-title', opts.panel.title );
	}

	switch ( opts.panel.fx )
	{
		case false:
			break;

		case 'none':
			$spnl.addClass( 'mm-panel_noanimation' );
			break;

		default:
			$spnl.addClass( 'mm-panel_fx-' + opts.panel.fx )
			break;
	}

	//	Add splash content
	if ( opts.panel.splash )
	{
		$spnl.append( '<div class="mm-panel__searchsplash">' + opts.panel.splash + '</div>' );
	}

	this._initPanels( $spnl.get() );

	return $spnl;
};

Mmenu.prototype._initSearchfield = function( 
	this	: Mmenu,
	$wrpr	: JQuery
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;


	//	No searchfield in vertical submenus	
	if ( $wrpr.parent( '.mm-listitem_vertical' ).length )
	{
		return Mmenu.$();
	}

	//	Only one searchfield per panel
	if (  $wrpr.find( '.mm-searchfield' ).length )
	{
		return $wrpr.find( '.mm-searchfield' );
	}


	var $srch = Mmenu.$( '<' + ( conf.form ? 'form' : 'div' ) + ' class="mm-searchfield" />' ),
		$inpd = Mmenu.$( '<div class="mm-searchfield__input" />' ),
		$inpt = Mmenu.$( '<input placeholder="' + this.i18n( opts.placeholder ) + '" type="text" autocomplete="off" />' );

	$inpd.append( $inpt ).appendTo( $srch );


	$wrpr.prepend( $srch );
	if ( $wrpr.hasClass( 'mm-panel' ) )
	{
		$wrpr.addClass( 'mm-panel_has-searchfield' );
	}


	function addAttributes( 
		$el		: JQuery,
		attr	: mmLooseObject | boolean
	) {
		if ( attr )
		{
			for ( var a in (attr as mmLooseObject) )
			{
				$el[ 0 ].setAttribute( a, attr[ a ] );
			}
		}
	}


	//	Add attributes to the input
	addAttributes( $inpt, conf.input );
	

	//	Add the clear button
	if ( conf.clear )
	{
		Mmenu.$('<a class="mm-btn mm-btn_close mm-searchfield__btn" href="#" />')
			.appendTo( $inpd );
	}


	//	Add attributes and submit to the form
	addAttributes( $srch, conf.form );
	if ( conf.form && conf.submit && !conf.clear )
	{
		Mmenu.$('<a class="mm-btn mm-btn_next mm-searchfield__btn" href="#" />')
			.appendTo( $inpd );
	}

	if ( opts.cancel )
	{
		Mmenu.$('<a href="#" class="mm-searchfield__cancel">' + this.i18n( 'cancel' ) + '</a>')
			.appendTo( $srch );
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


	var $inpt = $srch.find( 'input' ),
		$cncl = $srch.find( '.mm-searchfield__cancel' ),
		$spnl =  Mmenu.$(this.node.pnls).children( '.mm-panel_search' ),
		$itms = data.$pnls.find( '.mm-listitem' );

	data.$itms = $itms.not( '.mm-listitem_divider' );
	data.$dvdr = $itms.filter( '.mm-listitem_divider' );


	if ( opts.panel.add && opts.panel.splash )
	{
		$inpt
			.off( 'focus.mm-searchfield-splash' )
			.on(  'focus.mm-searchfield-splash',
				( e ) => {
					this.openPanel( $spnl[ 0 ] );
				}
			);
	}
	if ( opts.cancel )
	{
		$inpt
			.off( 'focus.mm-searchfield-cancel' )
			.on(  'focus.mm-searchfield-cancel',
				( e ) => {
					$cncl.addClass( 'mm-searchfield__cancel-active' );
				}
			);


		$cncl
			.off( 'click.mm-searchfield-splash' )
			.on(  'click.mm-searchfield-splash',
				( e ) => {
					e.preventDefault();
					$cncl.removeClass( 'mm-searchfield__cancel-active' );

					if ( $spnl.hasClass( 'mm-panel_opened' ) )
					{
						this.openPanel( Mmenu.$(this.node.pnls).children( '.mm-panel_opened-parent' ).last()[0] );
					}
				}
			);
	}

	if ( opts.panel.add && opts.addTo == 'panel' )
	{
		this.bind( 'openPanel:finish', ( 
			panel : HTMLElement
		) => {
			if ( panel === $spnl[ 0 ] )
			{
				$inpt.focus();
			}
		});
	}

	($inpt[ 0 ] as any).mmSearchfield = data;
	$inpt.off( 'input.mm-searchfield' )
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
						this.search( $inpt );
						break;
				}
			}
		);


	//	Fire once initially
	//	TODO better in initMenu:after or the likes
	this.search( $inpt );
};	

Mmenu.prototype._initNoResultsMsg = function( 
	this	: Mmenu,
	$wrpr	: JQuery
) {
	var opts : mmOptionsSearchfield = this.opts.searchfield,
		conf : mmConfigsSearchfield = this.conf.searchfield;

	//	Not in a panel
	if ( !$wrpr.closest( '.mm-panel' ).length )
	{
		$wrpr =  Mmenu.$(this.node.pnls).children( '.mm-panel' ).first();
	}

	//	Only once
	if ( $wrpr.children( '.mm-panel__noresultsmsg' ).length )
	{
		return;
	}

	//	Add no-results message
	var $lst = $wrpr.children( '.mm-listview' ).first(),
		$msg = Mmenu.$( '<div class="mm-panel__noresultsmsg mm-hidden" />' )
			.append( (this.i18n( opts.noResults ) as string) );

	if ( $lst.length )
	{
		$msg.insertAfter( $lst );
	}
	else
	{
		$msg.prependTo( $wrpr );
	}
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

	var _anchor = 'a',
		_both   = 'a, span';

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
		.find( '.mm-btn_fullwidth-search' )
		.removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );

	$spnl.children( '.mm-listview' ).empty();
	$pnls.scrollTop( 0 );


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
				( i, elem ) => {
					var $item = Mmenu.$(elem),
						_search = _anchor;

					if ( opts.showTextItems || ( opts.showSubPanels && $item.find( '.mm-btn_next' ) ) )
					{
						_search = _both;
					}
					if ( $item.children( _search ).not( '.mm-btn_next' ).text().toLowerCase().indexOf( query ) > -1 )
					{
						$item.removeClass( 'mm-hidden' );
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
					let $panel : JQuery = Mmenu.$(panel),
						parent : HTMLElement = (panel as any).mmParent;

					if ( parent )
					{
						//	The current panel has mached listitems
						let listitems = Mmenu.DOM.find( panel, '.mm-listitem' );
						if ( Mmenu.filterListItems( listitems ).length )
						{
							//	Show parent
							if ( parent.matches( '.mm-hidden' ) )
							{
								Mmenu.$(parent)
									.removeClass( 'mm-hidden' )
									.children( '.mm-btn_next' )
									.not( '.mm-btn_fullwidth' )
									.addClass( 'mm-btn_fullwidth' )
									.addClass( 'mm-btn_fullwidth-search' );
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

