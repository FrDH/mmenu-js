Mmenu.addons.dividers = function(
	this : Mmenu
) {
	var opts = this.opts.dividers;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add		: opts,
			fixed	: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	//opts = this.opts.dividers = jQuery.extend( true, {}, Mmenu.options.dividers, opts );
	this.opts.dividers = Mmenu.extend( opts, Mmenu.options.dividers );


	//	Add classname to the menu to specify the type of the dividers
	if ( opts.type )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_dividers-' + opts.type );
		});
	}


	//	Add dividers
	if ( opts.add )
	{
		this.bind( 'initListview:after', ( 
			$panel : JQuery
		) => {
			var $wrapper;
			switch( opts.addTo )
			{
				case 'panels':
					$wrapper = $panel;
					break;

				default:
					$wrapper = $panel.filter( opts.addTo );
					break;
			}

			if ( !$wrapper.length )
			{
				return;
			}

			$wrapper
				.find( '.mm-listitem_divider' )
				.remove();
				
			$wrapper
				.find( '.mm-listview' )
				.each(
					( i, elem ) => {
						var last = '';
						Mmenu.filterListItems( Mmenu.$(elem).children() )
							.each(
								( i, elem ) => {
									let letter = Mmenu.$(elem)
										.children( '.mm-listitem__text' )
										.text().trim().toLowerCase()[ 0 ];

									if ( letter.length && letter != last )
									{
										last = letter;
										Mmenu.$( '<li class="mm-listitem mm-listitem_divider">' + letter + '</li>' ).insertBefore( elem );
									}
								}
							);
					}
				);
		});
	}
	

	//	Fixed dividers
	if ( opts.fixed )
	{
		//	Add the fixed divider
		this.bind( 'initPanels:after', () => {
			if ( !this.node.fixeddivider )
			{
				let listitem = document.createElement( 'li' );
				listitem.classList.add( 'mm-listitem', 'mm-listitem_divider' );

				let listview = document.createElement( 'ul' );
				listview.classList.add( 'mm-listview', 'mm-listview_fixeddivider' );
				listview.append( listitem );

				this.node.pnls.append( listview );
				this.node.fixeddivider = listitem;
			}
		});

		function setValue( 
			this	 : Mmenu,
			$panel	?: JQuery
		) {
			$panel = $panel || Mmenu.$(this.node.pnls).children( '.mm-panel_opened' );
			if ( $panel.is( ':hidden' ) )
			{
				return;
			}

			var $dividers = $panel
				.find( '.mm-listitem_divider' )
				.not( '.mm-hidden' );

			var scrl = $panel.scrollTop() || 0,
				text = '';

			$dividers.each(( i, divider ) => {
				let $divider = Mmenu.$(divider);
				if ( $divider.position().top + scrl < scrl + 1 )
				{
					text = $divider.text();
				}
			});

			this.node.fixeddivider.innerText = text;
			this.node.pnls.classList[ text.length ? 'add' : 'remove' ]( 'mm-panel_dividers' );
		};

		//	Set correct value when 
		//		1) opening the menu,
		//		2) opening a panel,
		//		3) after updating listviews and
		//		4) after scrolling a panel
		this.bind( 'open:start'			, setValue );	// 1
		this.bind( 'openPanel:start'	, setValue );	// 2
		this.bind( 'updateListview'		, setValue );	// 3
		this.bind( 'initPanel:after', (	
			$panel : JQuery
		) => {
			$panel.off( 'scroll.mm-dividers touchmove.mm-dividers' )
				.on( 'scroll.mm-dividers touchmove.mm-dividers',
					( e ) => {
						if ( $panel.hasClass( 'mm-panel_opened' ) )
						{
							setValue.call( this, $panel );
						}
					}
				);
		});

	}
};


//	Default options and configuration.
Mmenu.options.dividers = {
	add		: false,
	addTo	: 'panels',
	fixed	: false,
	type	: null
};
