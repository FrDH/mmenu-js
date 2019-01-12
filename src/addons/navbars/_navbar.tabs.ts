Mmenu.addons.navbars.tabs = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {

	var $tabs = $navbar.children( 'a' );

	$navbar
		.addClass( 'mm-navbar_tabs' )
		.parent()
		.addClass( 'mm-navbars_has-tabs' );

	$tabs
		.on( 'click.mm-navbars', ( evnt ) => {
			evnt.preventDefault();

			var tab = evnt.currentTarget;
			if ( tab.matches( 'mm-navbar__tab_selected' ) )
			{
				evnt.stopImmediatePropagation();
				return;
			}

			try
			{
				this.openPanel( this.node.menu.querySelector( tab.getAttribute( 'href' ) ), false );
				evnt.stopImmediatePropagation();
			}
			catch( err ) {}
		});

	function selectTab( 
		this	: Mmenu,
		panel	: HTMLElement
	) {
		$tabs.removeClass( 'mm-navbar__tab_selected' );

		var $tab = $tabs.filter( '[href="#' + panel.id + '"]' );
		if ( $tab.length )
		{
			$tab.addClass( 'mm-navbar__tab_selected' );
		}
		else
		{
			var parent : HTMLElement = (panel as any).mmParent;
			if ( parent )
			{
				selectTab.call( this, parent.closest( '.mm-panel' ) );
			}
		}
	}

	this.bind( 'openPanel:start', selectTab );
};
