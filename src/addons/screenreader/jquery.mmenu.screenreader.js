/*
 * jQuery mmenu screenReader addon
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

			//	Aria hidden / haspopup
			if ( opts.aria )
			{
				//	Aria hidden
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
					this.bind( 'open', aria_open );
					this.bind( 'close', aria_close );
					aria_close.call( this );
				}

				var aria_update = function()
				{
					aria_value( this.$menu.find( '.' + _c.hidden ), 'hidden', true );
				};
				var aria_openPanel = function( $panel )
				{
					aria_value( this.$pnls.children( '.' + _c.panel ).not( $panel ).not( '.' + _c.hidden ), 'hidden', true );
					aria_value( $panel, 'hidden', false );
				};
				this.bind( 'update', aria_update );
				this.bind( 'openPanel', aria_update );
				this.bind( 'openPanel', aria_openPanel );

				//	Aria haspopup
				var aria_init = function( $panels )
				{
					aria_value( $panels.find( '.' + _c.prev + ', .' + _c.next ), 'haspopup', true );
					aria_value( $panels.find( '.' + _c.next ).next('span'), 'hidden', true );

					$panels
						.find( '.' + _c.prev + ', .' + _c.next  )
						.each(
							function()
							{
								$o = $(this).attr( 'href' ).replace( '#', '' );
								aria_value( $(this), 'owns', $o );
							}
					);
				};

				this.bind( 'initPanels', aria_init );
				aria_init.call( this, this.$menu.children( '.' + _c.navbar ) );
			}


			//	Screen reader text
			if ( opts.text )
			{
				//	Navbar prev button
				var text_init = function( $panels )
				{
					$panels
						.children( '.' + _c.navbar )
						.children( '.' + _c.prev )
						.each(
							function()
							{
								$n = $(this).next('a');
								$(this).html( text_span( $n.text() + conf.text.closeSubmenu ) );
							}
						);
					$panels
						.children( '.' + _c.navbar )
						.children( '.' + _c.prev )
						.next( '.' + _c.title)
						.each(
							function()
							{
								aria_value( $(this), 'hidden', true);
							}
						);
					$panels
						.children( '.' + _c.listview )
						.children( '.' + _c.next )
						.each(
							function()
							{
								$n = $(this).next('span');
								$(this).html( text_span( $n.text() + conf.text.openSubmenu ) );
							}
						);
					$panels
						.children( '.' + _c.navbar )
						.children( '.' + _c.close )
						.each(
							function()
							{
								$(this).html( text_span( conf.text.closeMenu ) );
							}
						);

					if ( $panels.is( '.' + _c.panel ) )
					{
						$panels
							.find( '.' + _c.listview )
							.find( '.' + _c.next )
							.each(
								function()
								{
									$n = $(this).next('span');
									$(this).html( text_span( $n.text() + conf.text[ $(this).parent().is( '.' + _c.vertical ) ? 'toggleSubmenu' : 'openSubmenu' ] ) );
								}
							);
					}
				};
				this.bind( 'initPanels', text_init );
				text_init.call( this, this.$menu );
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
      closeSubmenu    : ' (close submenu)',
      openSubmenu     : ' (open submenu)',
      toggleSubmenu   : ' (toggle submenu)'
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
