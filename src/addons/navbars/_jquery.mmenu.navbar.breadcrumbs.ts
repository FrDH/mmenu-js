/*	
 * jQuery mmenu navbar add-on breadcrumbs content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'breadcrumbs';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts, conf )
	{
		var that = this;


		//	Get vars
		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d;

		_c.add( 'separator' );


		//	Add content
		var $crumbs = $('<span class="' + _c.navbar + '__breadcrumbs" />').appendTo( $navbar );

		this.bind( 'initNavbar:after',
			function( $panel )
			{
				if ( $panel.children( '.' + _c.navbar ).children( '.' + _c.navbar + '__breadcrumbs' ).length )
				{
					return;
				}

				$panel.removeClass( _c.panel + '_has-navbar' );
					
				var crumbs = [],
					$bcrb = $( '<span class="' + _c.navbar + '__breadcrumbs"></span>' ),
					$crnt = $panel,
					first = true;

				while ( $crnt && $crnt.length )
				{
					if ( !$crnt.is( '.' + _c.panel ) )
					{
						$crnt = $crnt.closest( '.' + _c.panel );
					}

					if ( !$crnt.parent( '.' + _c.listitem + '_vertical' ).length )
					{
						var text = $crnt.children( '.' + _c.navbar ).children( '.' + _c.navbar + '__title' ).text();
						if ( text.length )
						{
							crumbs.unshift( first ? '<span>' + text + '</span>' : '<a href="#' + $crnt.attr( 'id' ) + '">' + text + '</a>' );
						}

						first = false;
					}
					$crnt = $crnt.data( _d.parent );
				}
				if ( conf.breadcrumbs.removeFirst )
				{
					crumbs.shift();
				}

				$bcrb
					.append( crumbs.join( '<span class="' + _c.separator + '">' + conf.breadcrumbs.separator + '</span>' ) )
					.appendTo( $panel.children( '.' + _c.navbar ) );

			}
		);

		//	Update for to opened panel
		this.bind( 'openPanel:start',
			function( $panel )
			{
				var $bcrb = $panel.find( '.' + _c.navbar + '__breadcrumbs' );
				if ( $bcrb.length )
				{
					$crumbs.html( $bcrb.html() || '' );
				}
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
	};

})( jQuery );