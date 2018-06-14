/*	
 * jQuery mmenu columns add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'columns';


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


				var colm = '',
					colp = '';

				for ( var i = 0; i <= opts.visible.max; i++ )
				{
					colm += ' ' + _c.menu  + '_columns-' + i;
					colp += ' ' + _c.panel + '_columns-' + i;
				}
				if ( colm.length )
				{
					colm = colm.slice( 1 );
					colp = colp.slice( 1 );
				}

				var rmvc = colp + ' ' + _c.panel + '_opened ' + _c.panel + '_opened-parent ' + _c.panel + '_highest';


				//	Close all later opened panels
				function closeLaterPanels( $panel )
				{
					var $prnt = $panel.data( _d.parent );
					if ( !$prnt )
					{
						return;
					}

					$prnt = $prnt.closest( '.' + _c.panel );
					if ( !$prnt.length )
					{
						return;
					}

					var colnr = $prnt.attr( 'class' );
					if ( !colnr )
					{
						return;
					}

					colnr = colnr.split( _c.panel + '_columns-' )[ 1 ];
					if ( !colnr )
					{
						return;
					}

					colnr = parseInt( colnr.split( ' ' )[ 0 ], 10 ) + 1;
					while( colnr > 0 )
					{
						var $panl = this.$pnls.children( '.' + _c.panel + '_columns-' + colnr );
						if ( $panl.length )
						{
							colnr++;
							$panl.removeClass( rmvc )
								.addClass( _c.hidden );
						}
						else
						{
							colnr = -1;
							break;
						}
					}
				}
				var setupPanels = function( $panel )
				{
					var _num = this.$pnls.children( '.' + _c.panel + '_opened-parent' ).length;
					if ( !$panel.hasClass( _c.panel + '_opened-parent' ) )
					{
						_num++;
					}
					_num = Math.min( opts.visible.max, Math.max( opts.visible.min, _num ) );

					this.$menu
						.removeClass( colm )
						.addClass( _c.menu + '_columns-' + _num );

					this.$pnls
						.children( '.' + _c.panel )
						.removeClass( colp )
						.filter( '.' + _c.panel + '_opened-parent' )
						.add( $panel )
						.slice( -opts.visible.max )
						.each(
							function( i )
							{
								$(this).addClass( _c.panel + '_columns-' + i );
							}
						);
				};

				this.bind( 'openPanel:before', closeLaterPanels );
				this.bind( 'openPanel:start', setupPanels );
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
		clickAnchor: function( $a, inMenu ) {}
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