Mmenu.addons.pageScroll = function(
	this : Mmenu
) {

	var opts = this.opts.pageScroll,
		conf = this.conf.pageScroll;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			scroll: opts
		};
	}
	//	/Extend shorthand options


	this.opts.pageScroll = Mmenu.extend( opts, Mmenu.options.pageScroll );


	var $section : JQuery;

	function scrollTo(
		offset : number
	) {
		if ( $section && $section.length && $section.is( ':visible' ) )
		{
			Mmenu.$('html, body').animate({
				scrollTop: $section.offset().top + offset
			});
		}
		$section = Mmenu.$();
	}
	function anchorInPage( 
		href : string
	) {
		try
		{
			if ( href != '#' &&
				href.slice( 0, 1 ) == '#' &&
				Mmenu.node.$page.find( href ).length
			) {
				return true;
			}
			return false;
		}
		catch( err )
		{
			return false;
		}
	}


	//	Scroll to section after clicking menu item.
	if ( opts.scroll )
	{
		this.bind( 'close:finish', () => {
			scrollTo( conf.scrollOffset );
		});
	}

	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor
	if ( this.opts.offCanvas && opts.scroll )
	{
		this.clck.push((
			anchor	: HTMLElement,
			args 	: mmClickArguments
		) => {
	
			$section = Mmenu.$();

			if ( !args.inMenu ||
				!args.inListview
			) {
				return;
			}

			var href = anchor.getAttribute( 'href' );

			if ( anchorInPage( href ) )
			{
				$section = Mmenu.$(href);
				if ( this.node.menu.classList.contains( 'mm-menu_sidebar-expanded' ) && 
					Mmenu.$('html').hasClass( 'mm-wrapper_sidebar-expanded' )
				) {
					scrollTo( this.conf.pageScroll.scrollOffset );
				}
				else
				{
					return {
						close: true
					};
				}
			}
		});
	}


	//	Update selected menu item after scrolling.
	if ( opts.update )
	{
		let orgs = [],
			scts = [];

		this.bind( 'initListview:after', (
			$panel : JQuery
		) => {

			Mmenu.filterListItemAnchors( $panel.find( '.mm-listview' ).children( 'li' ) )
				.each(
					( i, elem ) => {
						var href = elem.getAttribute( 'href' );

						if ( anchorInPage( href ) )
						{
							orgs.push( href );
						}
					}
				);

			scts = orgs.reverse();
		});

		let _selected = -1;

		Mmenu.$(window)
			.on( 'scroll.mm-pageScroll', (
				evnt
			) => {
				var ofst = Mmenu.$(window).scrollTop();

				for ( var s = 0; s < scts.length; s++ )
				{
					if ( Mmenu.$(scts[ s ]).offset().top < ofst + conf.updateOffset )
					{
						if ( _selected !== s )
						{
							_selected = s;
							this.setSelected( 
								Mmenu.filterListItemAnchors( 
									this.node.$pnls.children( '.mm-panel_opened' ).find( '.mm-listview' ).children( 'li' )
								)
								.filter( '[href="' + scts[ s ] + '"]' )
								.parent()
							);
						}
						break;
					}
				}
			});
	}
};


//	Default options and configuration.
Mmenu.options.pageScroll = {
	scroll: false,
	update: false
};

Mmenu.configs.pageScroll = {
	scrollOffset: 0,
	updateOffset: 50
};

