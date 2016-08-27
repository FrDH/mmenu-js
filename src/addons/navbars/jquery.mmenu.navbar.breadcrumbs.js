/*	
 * jQuery mmenu navbar addon breadcrumbs content
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
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d;

		_c.add( 'breadcrumbs separator' );


		//	Add content
		var $crumbs = $('<span class="' + _c.breadcrumbs + '" />').appendTo( $navbar );
		this.bind( 'initPanels',
			function( $panels )
			{
				$panels
					.removeClass( _c.hasnavbar )
					.each(
						function()
						{
							var crumbs = [],
								$panl = $(this),
								$bcrb = $( '<span class="' + _c.breadcrumbs + '"></span>' ),
								$crnt = $(this).children().first(),
								first = true;

							while ( $crnt && $crnt.length )
							{
								if ( !$crnt.is( '.' + _c.panel ) )
								{
									$crnt = $crnt.closest( '.' + _c.panel );
								}

								var text = $crnt.children( '.' + _c.navbar ).children( '.' + _c.title ).text();
								crumbs.unshift( first ? '<span>' + text + '</span>' : '<a href="#' + $crnt.attr( 'id' ) + '">' + text + '</a>' );

								first = false;
								$crnt = $crnt.data( _d.parent );
							}
							$bcrb
								.append( crumbs.join( '<span class="' + _c.separator + '">' + conf.breadcrumbSeparator + '</span>' ) )
								.appendTo( $panl.children( '.' + _c.navbar ) );
						}
					);
			}
		);


		//	Update
		var update = function()
		{
			$crumbs.html( 
				this.$pnls
					.children( '.' + _c.current )
					.children( '.' + _c.navbar )
					.children( '.' + _c.breadcrumbs )
					.html()
			);
		};

		this.bind( 'openPanel', update );
		this.bind( 'initPanels', update );


		//	Maintain content count
		return 0;
	};

})( jQuery );