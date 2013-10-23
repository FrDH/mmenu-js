/*	
 * jQuery mmenu header addon
 * @requires mmenu 4.0.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://en.wikipedia.org/wiki/MIT_License
 * http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'header';


	$[ _PLUGIN_ ].prototype[ '_addon_' + _ADDON_ ] = function()
	{
		var that = this,
			opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];

		if ( this.direction != 'horizontal' )
		{
			return;
		}

		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d,
			_e = $[ _PLUGIN_ ]._e;

		_c.add( 'header hasheader prev next' );
		_e.add( 'setheader' );

		var glbl = $[ _PLUGIN_ ].glbl;


		//	Extend options
		if ( typeof opts == 'boolean' )
		{
			opts = {
				add		: opts,
				update	: opts
			};
		}
		if ( typeof opts != 'object' )
		{
			opts = {};
		}
		opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


		//	Add the HTML
		if ( opts.add )
		{
			$( '<div class="' + _c.header + '" />' )
				.prependTo( this.$menu )
				.append( '<a class="' + _c.prev + '" href="#"></a>' )
				.append( '<span></span>' )
				.append( '<a class="' + _c.next + '" href="#"></a>' );
		}

		var $header = $('div.' + _c.header, this.$menu);
		if ( $header.length )
		{
			this.$menu.addClass( _c.hasheader );
		}

		if ( opts.update )
		{
			if ( $header.length )
			{
				var $titl = $header.find( 'span' ),
					$prev = $header.find( '.' + _c.prev ),
					$next = $header.find( '.' + _c.next ),
					_page = '#' + glbl.$page.attr( 'id' );

				$prev.add( $next ).on( _e.click,
					function( e )
					{
						e.preventDefault();
						e.stopPropagation();

						var href = $(this).attr( 'href' );
						if ( href !== '#' )
						{
							if ( href == _page )
							{
								that.$menu.trigger( _e.close );
							}
							else
							{
								$(href, that.$menu).trigger( _e.open );
							}
						}
					}
				);

				$('.' + _c.panel, this.$menu)
					.each(
						function()
						{
							var $t = $(this);

							var titl = $('.' + conf.panelHeaderClass, $t).text(),
								prev = $('.' + conf.panelPrevClass, $t).attr( 'href' ),
								next = $('.' + conf.panelNextClass, $t).attr( 'href' );

							if ( !titl )
							{
								titl = $('.' + _c.subclose, $t).text();
							}
							if ( !titl )
							{
								titl = opts.title;
							}
							
							if ( !prev )
							{
								prev = $('.' + _c.subclose, $t).attr( 'href' );
							}
	
							$t.off( _e.setheader )
								.on( _e.setheader,
									function( e )
									{
										e.stopPropagation();

										$titl[ titl ? 'show' : 'hide' ]().text( titl );
										$prev[ prev ? 'show' : 'hide' ]().attr( 'href', prev );
										$next[ next ? 'show' : 'hide' ]().attr( 'href', next );
									}
								);
	
							$t.on( _e.open,
								function( e )
								{
									$(this).trigger( _e.setheader );
								}
							);
						}
					)
					.filter( '.' + _c.current )
					.trigger( _e.setheader );
			}
		}
	};

	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		update	: false,
		title	: 'Menu',
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		panelHeaderClass	: 'Header',
		panelNextClass		: 'Next',
		panelPrevClass		: 'Prev'
	}


	//	Add to plugin
	$[ _PLUGIN_ ].addons = $[ _PLUGIN_ ].addons || [];
	$[ _PLUGIN_ ].addons.push( _ADDON_ );

})( jQuery );