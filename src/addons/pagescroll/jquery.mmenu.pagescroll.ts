/*	
 * jQuery mmenu pageScroll add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'pageScroll';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					scroll: opts
				};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			if ( opts.scroll )
			{
				this.bind( 'close:finish',
					function()
					{
						scrollTo( conf.scrollOffset );
					}
				);
			}


			if ( opts.update )
			{
				var that = this,
					orgs = [],
					scts = [];

				that.bind(
					'initListview:after',
					function( $panel )
					{

						that.__filterListItemAnchors( $panel.find( '.' + _c.listview ).children( 'li' ) )
							.each(
								function()
								{
									var href = $(this).attr( 'href' );

									if ( anchorInPage( href ) )
									{
										orgs.push( href );
									}
								}
							);

						scts = orgs.reverse();

					}
				);

				var _selected = -1;

				glbl.$wndw
					.on( _e.scroll + '-' + _ADDON_,
						function( e )
						{
							var ofst = glbl.$wndw.scrollTop();

							for ( var s = 0; s < scts.length; s++ )
							{
								if ( $(scts[ s ]).offset().top < ofst + conf.updateOffset )
								{
									if ( _selected !== s )
									{
										_selected = s;
										that.setSelected( 
											that.__filterListItemAnchors( 
												that.$pnls.children( '.' + _c.opened ).find( '.' + _c.listview ).children( 'li' )
											)
											.filter( '[href="' + scts[ s ] + '"]' )
											.parent()
										);
									}
									break;
								}
							}
						}
					);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu )
		{
			$section = false;

			if ( !inMenu ||
				!this.opts[ _ADDON_ ].scroll ||
				!this.opts.offCanvas ||
				!glbl.$page ||
				!glbl.$page.length
			) {
				return;
			}

			var href = $a.attr( 'href' );

			if ( anchorInPage( href ) )
			{
				$section = $(href);
				if ( glbl.$html.hasClass( _c.mm( 'widescreen' ) ) )
				{
					scrollTo( this.conf[ _ADDON_ ].scrollOffset );
				}
			}
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		scroll: false,
		update: false
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		scrollOffset: 0,
		updateOffset: 50
	};


	var _c, _d, _e, glbl;

	//	Should be 'JQuery | boolean' and not 'any', but 'JQuery' gives an error on "offset"
	var $section: any = false;

	function scrollTo( offset )
	{
		if ( $section && $section.length && $section.is( ':visible' ) )
		{
			glbl.$html.add( glbl.$body ).animate({
				scrollTop: $section.offset().top + offset
			});
		}
		$section = false;
	}
	function anchorInPage( href )
	{
		try
		{
			if ( href != '#' &&
				href.slice( 0, 1 ) == '#' &&
				glbl.$page.find( href ).length
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

})( jQuery );