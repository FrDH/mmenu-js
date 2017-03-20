/*	
 * jQuery mmenu navbar add-on breadcrumbs content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'breadcrumbs';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts, conf )
	{
		var that = this;


		//	Get vars
		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d;

		_c.add( 'breadcrumbs separator' );


		//	Add content
		var $crumbs = $('<span class="' + _c.breadcrumbs + '" />').appendTo( $navbar );

		this.bind( 'initNavbar:after',
			function( $panel )
			{
				$panel.removeClass( _c.hasnavbar );
					
				var crumbs = [],
					$bcrb = $( '<span class="' + _c.breadcrumbs + '"></span>' ),
					$crnt = $panel,
					first = true;

				while ( $crnt && $crnt.length )
				{
					if ( !$crnt.is( '.' + _c.panel ) )
					{
						$crnt = $crnt.closest( '.' + _c.panel );
					}

					if ( !$crnt.hasClass( _c.vertical ) )
					{
						var text = $crnt.children( '.' + _c.navbar ).children( '.' + _c.title ).text();
						crumbs.unshift( first ? '<span>' + text + '</span>' : '<a href="#' + $crnt.attr( 'id' ) + '">' + text + '</a>' );

						first = false;
					}
					$crnt = $crnt.data( _d.parent );
				}
				$bcrb
					.append( crumbs.join( '<span class="' + _c.separator + '">' + conf.breadcrumbSeparator + '</span>' ) )
					.appendTo( $panel.children( '.' + _c.navbar ) );
			}
		);

		//	Update for to opened panel
		this.bind( 'openPanel:start',
			function( $panel )
			{
				$crumbs.html( 
					$panel
						.children( '.' + _c.navbar )
						.children( '.' + _c.breadcrumbs )
						.html() || ''
				);
			}
		);


		//	Add screenreader / aria support
		this.bind( 'initNavbar:after:sr-aria',
			function( $panel )
			{
				$panel
					.children( '.' + _c.navbar )
					.children( '.' + _c.breadcrumbs )
					.children( 'a' )
					.each(
						function()
						{
							that.__sr_aria( $(this), 'owns', $(this).attr( 'href' ).slice( 1 ) );
						}
					);
			}
		);


		//	Maintain content count
		return 0;
	};

})( jQuery );