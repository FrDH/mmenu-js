Mmenu.addons.navbars.breadcrumbs = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $crumbs = Mmenu.$('<span class="mm-navbar__breadcrumbs" />').appendTo( $navbar );

	this.bind( 'initNavbar:after', (
		panel : HTMLElement
	) => {
		if ( panel.querySelector( '.mm-navbar__breadcrumbs' ) )
		{
			return;
		}

		panel.classList.remove( 'mm-panel_has-navbar' );
			
		var crumbs = [],
			$bcrb = Mmenu.$( '<span class="mm-navbar__breadcrumbs"></span>' ),
			$crnt = Mmenu.$(panel),
			first = true;

		while ( $crnt && $crnt.length )
		{
			if ( !$crnt.is( '.mm-panel' ) )
			{
				$crnt = $crnt.closest( '.mm-panel' );
			}

			if ( !$crnt.parent( '.mm-listitem_vertical' ).length )
			{
				var text = $crnt.children( '.mm-navbar' ).children( '.mm-navbar__title' ).text();
				if ( text.length )
				{
					crumbs.unshift( first ? '<span>' + text + '</span>' : '<a href="#' + $crnt[ 0 ].id + '">' + text + '</a>' );
				}

				first = false;
			}
			$crnt = ($crnt[ 0 ] as any).mmParent;
		}
		if ( this.conf.navbars.breadcrumbs.removeFirst )
		{
			crumbs.shift();
		}

		$bcrb
			.append( crumbs.join( '<span class="mm-separator">' + this.conf.navbars.breadcrumbs.separator + '</span>' ) )
			.appendTo( Mmenu.DOM.child( panel, '.mm-navbar' ) );

	});

	//	Update for to opened panel
	this.bind( 'openPanel:start', (
		panel : HTMLElement
	) => {
		var bcrb = panel.querySelector( '.mm-navbar__breadcrumbs' );
		if ( bcrb )
		{
			$crumbs[ 0 ].innerHTML = bcrb.innerHTML;
		}
	});


	//	Add screenreader / aria support
	this.bind( 'initNavbar:after:sr-aria', ( 
		panel : HTMLElement
	) => {
		Mmenu.$(panel)
			.children( '.mm-navbar' )
			.children( '.mm-breadcrumbs' )
			.children( 'a' )
			.each(
				( i, elem ) => {
					Mmenu.sr_aria( Mmenu.$(elem), 'owns', elem.getAttribute( 'href' ).slice( 1 ) );
				}
			);
	});
};
