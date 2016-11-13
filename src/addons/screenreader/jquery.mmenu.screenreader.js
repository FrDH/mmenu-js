/*
 * jQuery mmenu screenReader add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'screenReader';


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
					aria: opts,
					text: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Aria
			if ( opts.aria )
			{
				//	Apply aria-hidden to menu when closed
				if ( this.opts.offCanvas )
				{
					var aria_open = function()
					{
						aria_value( this.$menu, 'hidden', false );
					};
					var aria_close = function()
					{
						aria_value( this.$menu, 'hidden', true );
					};
					this.bind( 'open'	, aria_open );
					this.bind( 'close'	, aria_close );

					aria_value( this.$menu, 'hidden', true );
				}

				//	Apply aria-hidden to hidden content
				var aria_update = function()
				{
					//	TODO, unfortunately, aria-hidden is not per se non-visible
					//	Searchfield add-on will need this to work
					//	Maybe LI's only?
//					aria_value( this.$menu.find( '.' + _c.hidden ), 'hidden', true );
				};
				var aria_openPanel = function( $panel )
				{
					var $navb = this.$menu.children( '.' + _c.navbar ),
						$prev = $navb.children( '.' + _c.prev ),
						$next = $navb.children( '.' + _c.next ),
						$titl = $navb.children( '.' + _c.title );

					//	Apply aria-hidden to prev- and next-buttons when hidden
					aria_value( $prev, 'hidden', $prev.is( '.' + _c.hidden ) );
					aria_value( $next, 'hidden', $next.is( '.' + _c.hidden ) );

					//	Apply aria-hidden to the title if the prev-button has screen reader text and is visible
					if ( opts.text )
					{
						aria_value( $titl, 'hidden', !$prev.is( '.' + _c.hidden ) );
					}

					//	Apply aria-hidden to hidden panels
					aria_value( this.$pnls.children( '.' + _c.panel ).not( $panel ), 'hidden', true );
					aria_value( $panel, 'hidden', false );
				};
				this.bind( 'update' 	, aria_update );
				this.bind( 'openPanel' 	, aria_update );
				this.bind( 'openPanel' 	, aria_openPanel );

				var aria_init = function( $panels )
				{
					var $n;

					$panels = $panels || this.$menu;

					var $navb = $panels.children( '.' + _c.navbar ),
						$prev = $navb.children( '.' + _c.prev ),
						$next = $navb.children( '.' + _c.next ),
						$titl = $navb.children( '.' + _c.title );

					//	Apply aria-haspopup to prev- and next-buttons
					aria_value( $prev, 'haspopup', true );
					aria_value( $next, 'haspopup', true );

					//	Apply aria-owns to prev- and next-buttons
					$n = ( $panels.is( '.' + _c.panel ) )
						? $panels.find( '.' + _c.prev + ', .' + _c.next )
						: $prev.add( $next );

					$n.each(
						function()
						{
							aria_value( $(this), 'owns', $(this).attr( 'href' ).replace( '#', '' ) );
						}
					);

					//	Apply aria-hidden to item text if the (full-width-)next-button has screen reader text
					if ( opts.text )
					{
						if ( $panels.is( '.' + _c.panel ) )
						{
							$n = $panels
								.find( '.' + _c.listview )
								.find( '.' + _c.fullsubopen )
								.parent()
								.children( 'span' );

							aria_value( $n, 'hidden', true );
						}
					}
				};
				this.bind( 'initPanels'	, aria_init );
				this.bind( '_initAddons', aria_init );
			}


			//	Text
			if ( opts.text )
			{
				var text_init = function( $panels )
				{
					var $n;

					$panels = $panels || this.$menu;

					var $navb = $panels.children( '.' + _c.navbar );

					//	Apply screen reader text to the prev-button
					$navb
						.each(
							function()
							{
								var $t  = $(this),
									txt = $[ _PLUGIN_ ].i18n( conf.text.closeSubmenu );

								$n = $t.children( '.' + _c.title );
								if ( $n.length )
								{
									txt += ' (' + $n.text() + ')';
								}

								$t.children( '.' + _c.prev )
									.html( text_span( txt ) );
							}
						);

					//	Apply screen reader text to the close-button
					$navb
						.children( '.' + _c.close )
						.html( text_span( $[ _PLUGIN_ ].i18n( conf.text.closeMenu ) ) );

					//	Apply screen reader text to the next-button
					if ( $panels.is( '.' + _c.panel ) )
					{
						$panels
							.find( '.' + _c.listview )
							.children( 'li' )
							.children( '.' + _c.next )
							.each(
								function()
								{
									var $t = $(this),
										txt = $[ _PLUGIN_ ].i18n( conf.text[ $t.parent().is( '.' + _c.vertical ) ? 'toggleSubmenu' : 'openSubmenu' ] );
									
									$n = $t.nextAll( 'span, a' ).first();
									if ( $n.length )
									{
										txt += ' (' + $n.text() + ')';
									}

									$t.html( text_span( txt ) );
								}
							);
					}
				};
				this.bind( 'initPanels'	, text_init );
				this.bind( '_initAddons', text_init );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'sronly' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		aria: false,
		text: false
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		text: {
			closeMenu       : 'Close menu',
			closeSubmenu    : 'Close submenu',
			openSubmenu     : 'Open submenu',
			toggleSubmenu   : 'Toggle submenu'
		}
	};


	var _c, _d, _e, glbl;

	function aria_value( $elem, attr, value )
	{
		$elem
			.prop( 'aria-' + attr, value )
			[ value ? 'attr' : 'removeAttr' ]( 'aria-' + attr, value );
	}
	function text_span( text )
	{
		return '<span class="' + _c.sronly + '">' + text + '</span>';
	}

})( jQuery );
