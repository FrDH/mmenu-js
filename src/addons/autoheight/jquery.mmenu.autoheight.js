/*	
 * jQuery mmenu autoHeight addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'autoHeight';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			if ( !this.opts.offCanvas )
			{
				return;
			}

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shortcut options
			if ( typeof opts == 'boolean' && opts )
			{
				opts = {
					height: 'auto'
				};
			}
			if ( typeof opts == 'string' )
			{
				opts = {
					height: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			if ( opts.height != 'auto' && opts.height != 'highest' )
			{
				return;
			}

			this.$menu.addClass( _c.autoheight );


			//	Update the height
			var update = function( $panl )
			{
				if ( !this.vars.opened )
				{
					return;
				}

				var _top = parseInt( this.$pnls.css( 'top' )	, 10 ) || 0,
					_bot = parseInt( this.$pnls.css( 'bottom' )	, 10 ) || 0,
					_hgh = 0;

				this.$menu.addClass( _c.measureheight );

				if ( opts.height == 'auto' )
				{
					$panl = $panl || this.$pnls.children( '.' + _c.current );
					if ( $panl.is( '.' + _c.vertical ) )
					{
						$panl = $panl
							.parents( '.' + _c.panel )
							.not( '.' + _c.vertical )
							.first();
					}
					_hgh = $panl.outerHeight();
				}
				else if ( opts.height == 'highest' )
				{
					this.$pnls.children()
						.each(
							function()
							{
								var $panl = $(this);
								if ( $panl.is( '.' + _c.vertical ) )
								{
									$panl = $panl
										.parents( '.' + _c.panel )
										.not( '.' + _c.vertical )
										.first();
								}
								_hgh = Math.max( _hgh, $panl.outerHeight() );
							}
						);
				}

				this.$menu
					.height( _hgh + _top + _bot )
					.removeClass( _c.measureheight );
			};

			this.bind( 'opening', update );

			if ( opts.height == 'highest' )
			{
				this.bind( 'init', update );
			}
			if ( opts.height == 'auto' )
			{
				this.bind( 'update', update );
				this.bind( 'openPanel', update );
				this.bind( 'closePanel', update );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

 			_c.add( 'autoheight measureheight' );
			_e.add( 'resize' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		height: 'default' // 'auto'
	};


	var _c, _d, _e, glbl;

})( jQuery );