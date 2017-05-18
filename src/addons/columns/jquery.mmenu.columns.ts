/*	
 * jQuery mmenu columns add-on
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


				var $mnu = ( this.opts.offCanvas ) ? this.$menu.add( glbl.$html ) : this.$menu,
					clsn : string = '';

				for ( var i = 0; i <= opts.visible.max; i++ )
				{
					clsn += ' ' + _c.columns + '-' + i;
				}
				if ( clsn.length )
				{
					clsn = clsn.slice( 1 );
				}


				var countPanels = function( $panel )
				{
					var _num = this.$pnls.children( '.' + _c.subopened ).length;
					if ( $panel && !$panel.hasClass( _c.subopened ) )
					{
						_num++;
					}
					_num = Math.min( opts.visible.max, Math.max( opts.visible.min, _num ) );

					$mnu.removeClass( clsn )
						.addClass( _c.columns + '-' + _num );
				};
				var uncountPanels = function()
				{
					$mnu.removeClass( clsn );
				};
				var setupPanels = function( $panel )
				{
					this.$pnls
						.children( '.' + _c.panel )
						.removeClass( clsn )
						.filter( '.' + _c.subopened )
						.add( $panel )
						.slice( -opts.visible.max )
						.each(
							function( i )
							{
								$(this).addClass( _c.columns + '-' + i );
							}
						);
				};

				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.columns );
					}
				);
				this.bind( 'initPanels:after',
					function( $panels )
					{
						setupPanels.call( this, this.$pnls.children( '.' + _c.opened ) );
					}
				);

				this.bind( 'open:start'			, countPanels );
				this.bind( 'openPanel:start'	, countPanels );
				this.bind( 'openPanel:start' 	, setupPanels );
				this.bind( 'close:finish'		, uncountPanels );


				if ( !this.opts.offCanvas )
				{
					countPanels.call( this );
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
							var colnr : number = parseInt( $a.closest( '.' + _c.panel ).attr( 'class' ).split( _c.columns + '-' )[ 1 ].split( ' ' )[ 0 ], 10 ) + 1;
							while( colnr > 0 )
							{
								var $panl = this.$pnls.children( '.' + _c.columns + '-' + colnr );
								if ( $panl.length )
								{
									colnr++;
									$panl
										.removeClass( _c.subopened )
										.removeClass( _c.opened )
										.removeClass( _c.highest )
										.addClass( _c.hidden );
								}
								else
								{
									colnr = -1;
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
		}
	};


	var _c, _d, _e, glbl;

})( jQuery );