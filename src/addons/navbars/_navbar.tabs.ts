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
		.on( 'click.mm-navbars',
			( e ) => {
				e.preventDefault();

				var $tab = jQuery(e.currentTarget);
				if ( $tab.hasClass( 'mm-navbar__tab_selected' ) )
				{
					e.stopImmediatePropagation();
					return;
				}

				try
				{
					this.openPanel( jQuery( $tab[ 0 ].getAttribute( 'href' ) ), false );
					e.stopImmediatePropagation();
				}
				catch( err ) {}
			}
		);

	function selectTab( 
		this	: Mmenu,
		$panel	: JQuery
	) {
		$tabs.removeClass( 'mm-navbar__tab_selected' );

		var $tab = $tabs.filter( '[href="#' + $panel[ 0 ].id + '"]' );
		if ( $tab.length )
		{
			$tab.addClass( 'mm-navbar__tab_selected' );
		}
		else
		{
			var $parent = ($panel[ 0 ] as any).mmParent;
			if ( $parent && $parent.length )
			{
				selectTab.call( this, $parent.closest( '.mm-panel' ) );
			}
		}
	}

	this.bind( 'openPanel:start', selectTab );
};