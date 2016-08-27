/*	
 * jQuery mmenu iconPanels addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'iconPanels';


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
					add 	: opts
				};
			}
			if ( typeof opts == 'number' )
			{
				opts = {
					add 	: true,
					visible : opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			opts.visible++;


			//	Add the iconbars
			if ( opts.add )
			{

				this.$menu.addClass( _c.iconpanel );

				var clsn = [];
				for ( var i = 0; i <= opts.visible; i++ )
				{
					clsn.push( _c.iconpanel + '-' + i );
				}
				clsn = clsn.join( ' ' );

				var update = function( $panel )
				{
					if ( $panel.hasClass( _c.vertical ) )
					{
						return;
					}

					that.$pnls
						.children( '.' + _c.panel )
						.removeClass( clsn )
						.filter( '.' + _c.subopened )
						.removeClass( _c.hidden )
						.add( $panel )
						.not( '.' + _c.vertical )
						.slice( -opts.visible )
						.each(
							function( x )
							{
								$(this).addClass( _c.iconpanel + '-' + x );
							}
						);
				};

				this.bind( 'openPanel', update );
				this.bind( 'initPanels',
					function( $panels )
					{
						update.call( that, that.$pnls.children( '.' + _c.current ) );

						$panels
							.not( '.' + _c.vertical )
							.each(
								function()
								{
									if ( !$(this).children( '.' + _c.subblocker ).length )
									{
										$(this).prepend( '<a href="#' + $(this).closest( '.' + _c.panel ).attr( 'id' ) + '" class="' + _c.subblocker + '" />' );
									}
								}
							);
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
	
			_c.add( 'iconpanel subblocker' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 		: false,
		visible		: 3
	};


	var _c, _d, _e, glbl;

})( jQuery );