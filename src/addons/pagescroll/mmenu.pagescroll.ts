Mmenu.addons.pageScroll = function(
	this : Mmenu
) {

	var options = this.opts.pageScroll,
		configs = this.conf.pageScroll;

	//	Extend shorthand options.
	if ( typeof options == 'boolean' )
	{
		(options as mmLooseObject) = {
			scroll: options
		};
	}
	//	/Extend shorthand options.


	this.opts.pageScroll = Mmenu.extend( options, Mmenu.options.pageScroll );


	var section : HTMLElement;

	function scrollTo(
		offset : number
	) {
		if ( section && section.matches( ':visible' ) )
		{
			//	TODO: animate?
			document.documentElement.scrollTop = section.offsetTop + offset;
			document.body.scrollTop = section.offsetTop + offset;
		}
		section = null;
	}
	function anchorInPage( 
		href : string
	) {
		try
		{
			if ( href != '#' &&
				href.slice( 0, 1 ) == '#' &&
				Mmenu.node.page.querySelector( href )
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
	if ( options.scroll )
	{
		this.bind( 'close:finish', () => {
			scrollTo( configs.scrollOffset );
		});
	}

	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor.
	if ( this.opts.offCanvas && options.scroll )
	{
		this.clck.push((
			anchor	: HTMLElement,
			args 	: mmClickArguments
		) => {
	
			section = null;

			//	Don't continue if the clicked anchor is not in the menu.
			if ( !args.inMenu )
			{
				return;
			}

			//	Don't continue if the targeted section is not on the page.
			var href = anchor.getAttribute( 'href' );
			if ( !anchorInPage( href ) )
			{
				return;
			}

			section = document.querySelector( href );

			//	If the sidebar add-on is "expanded"...
			if ( this.node.menu.matches( '.mm-menu_sidebar-expanded' ) && 
				document.documentElement.matches( '.mm-wrapper_sidebar-expanded' )
			) {
				//	... scroll the page to the section.
				scrollTo( this.conf.pageScroll.scrollOffset );
			}

			//	... otherwise...
			else
			{
				//	... close the menu.
				return {
					close: true
				};
			}
		});
	}

	//	Update selected menu item after scrolling.
	if ( options.update )
	{
		let orgs = [],
			scts = [];

		this.bind( 'initListview:after', (
			panel : HTMLElement
		) => {
			//	TODO de sections zouden geordend moeten worden op de hoogte in de DOM, niet op volgorde in het menu.
			//	TODO querySelector haalt een enkel HTML element op, er kunnen meerdere lisviews in een panel zitten.
			let listitems = Mmenu.DOM.children( panel.querySelector( '.mm-listview' ), 'li' );
			Mmenu.filterListItemAnchors( listitems )
				.forEach(( anchor ) => {
					var href = anchor.getAttribute( 'href' );

					if ( anchorInPage( href ) )
					{
						orgs.push( href );
					}
				});

			scts = orgs.reverse();
		});

		let _selected = -1;

		window.addEventListener( 'scroll', ( evnt ) => {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

			for ( var s = 0; s < scts.length; s++ )
			{
				if ( scts[ s ].offsetTop < scrollTop + configs.updateOffset )
				{
					if ( _selected !== s )
					{
						_selected = s;

						let panel 		= Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ],
							listitems	= Mmenu.DOM.find( panel, '.mm-listitem' ),
							anchors 	= Mmenu.filterListItemAnchors( listitems );
							anchors 	= anchors.filter( anchor => anchor.matches( '[href="' + scts[ s ] + '"]' ) );

						if ( anchors.length )
						{
							this.setSelected( anchors[ 0 ].parentElement );
						}
					}
					break;
				}
			}
		});
	}
};
