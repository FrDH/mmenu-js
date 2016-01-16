/*	
 * jQuery mmenu columns addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'columns';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shortcut options
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
			if ( typeof opts.visible == 'number' )
			{
				opts.visible = {
					min 	: opts.visible,
					max 	: opts.visible
				};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Add the columns
			if ( opts.add )
			{
				opts.visible.min = Math.max( 1, Math.min( 6, opts.visible.min ) );
				opts.visible.max = Math.max( opts.visible.min, Math.min( 6, opts.visible.max ) );

				this.$menu.addClass( _c.columns );

				var $nds = ( this.opts.offCanvas ) ? this.$menu.add( glbl.$html ) : this.$menu,
					clsn = [];

				for ( var i = 0; i <= opts.visible.max; i++ )
				{
					clsn.push( _c.columns + '-' + i );
				}
				clsn = clsn.join( ' ' );

				var init = function( $panels )
				{
					openPanel.call( this, this.$pnls.children( '.' + _c.current ) );
					if ( opts.hideNavbars )
					{
						$panels.removeClass( _c.hasnavbar );
					}
				};
				var openMenu = function()
				{
					var _num = this.$pnls.children( '.' + _c.panel ).filter( '.' + _c.opened ).length;
					_num = Math.min( opts.visible.max, Math.max( opts.visible.min, _num ) );

					$nds.removeClass( clsn )
						.addClass( _c.columns + '-' + _num );
				};
				var closeMenu = function()
				{
					if ( this.opts.offCanvas )
					{
						glbl.$html.removeClass( clsn );
					}
				};
				var openPanel = function( $panel )
				{
					this.$pnls
						.children( '.' + _c.panel )
						.removeClass( clsn )
						.filter( '.' + _c.subopened )
						.removeClass( _c.hidden )
						.add( $panel )
						.slice( -opts.visible.max )
						.each(
							function( x )
							{
								$(this).addClass( _c.columns + '-' + x );
							}
						);
				};

				this.bind( 'open', openMenu );
				this.bind( 'close', closeMenu );
				this.bind( 'init', init );
				this.bind( 'openPanel', openPanel );
				this.bind( 'openingPanel', openMenu );
				this.bind( 'openedPanel', openMenu );

				if ( !this.opts.offCanvas )
				{
					openMenu.call( this );
				}
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'columns' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu )
		{
			if ( !this.opts[ _ADDON_ ].add )
			{
				return false;
			}

			if ( inMenu )
			{
				var that = this;

				var _h = $a.attr( 'href' );
				if ( _h.length > 1 && _h.slice( 0, 1 ) == '#' )
				{
					try
					{
						var $h = $(_h, this.$menu);
						if ( $h.is( '.' + _c.panel ) )
						{
							var colnr = parseInt( $a.closest( '.' + _c.panel ).attr( 'class' ).split( _c.columns + '-' )[ 1 ].split( ' ' )[ 0 ], 10 ) + 1;
							while( colnr !== false )
							{
								var $panl = this.$pnls.children( '.' + _c.columns + '-' + colnr );
								if ( $panl.length )
								{
									colnr++;
									$panl
										.removeClass( _c.subopened )
										.removeClass( _c.opened )
										.removeClass( _c.current )
										.removeClass( _c.highest )
										.addClass( _c.hidden );
								}
								else
								{
									colnr = false;
									break;
								}
							}
						}
					}
					catch( err ) {}
				}
			}
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 		: false,
		visible		: {
			min			: 1,
			max			: 3
		},
		hideNavbars	: false
	};


	var _c, _d, _e, glbl;

})( jQuery );