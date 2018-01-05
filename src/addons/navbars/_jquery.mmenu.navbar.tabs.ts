/*	
 * jQuery mmenu navbar add-on tabs content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'tabs';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts, conf )
	{
		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d,
			_e = $[ _PLUGIN_ ]._e;

		var that = this;
		var $tabs = $navbar.children( 'a' );

		$navbar
			.addClass( _c.navbar + '_tabs' )
			.parent()
			.addClass( _c.navbars + '_has-tabs' );

		//	TODO: better via clickAnchor?
		$tabs
			.on( _e.click + '-' + _ADDON_,
				function( e )
				{
					e.preventDefault();

					var $tab = $(this);
					if ( $tab.hasClass( _c.navbar + '__tab_selected' ) )
					{
						e.stopImmediatePropagation();
						return;
					}

					try
					{
						that.__openPanelWoAnimation( $( $tab.attr( 'href' ) ) );
						e.stopImmediatePropagation();
					}
					catch( err ) {}
				}
			);

		function selectTab( $panel )
		{
			$tabs.removeClass( _c.navbar + '__tab_selected' );

			var $tab = $tabs.filter( '[href="#' + $panel.attr( 'id' ) + '"]' );
			if ( $tab.length )
			{
				$tab.addClass( _c.navbar + '__tab_selected' );
			}
			else
			{
				var $parent = $panel.data( _d.parent );
				if ( $parent && $parent.length )
				{
					selectTab( $parent.closest( '.' + _c.panel ) );
				}
			}
		}

		this.bind( 'openPanel:start', selectTab );
			
	};

})( jQuery );