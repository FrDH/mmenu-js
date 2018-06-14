/*	
 * jQuery mmenu iconPanels add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'iconPanels';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			var keepFirst = false;

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add 	: opts
				};
			}
			if ( typeof opts == 'number' ||
				typeof opts == 'string'
			) {
				opts = {
					add 	: true,
					visible : opts
				};
			}

			if ( typeof opts != 'object' )
			{
				opts = {};
			}

			if ( opts.visible == 'first' )
			{
				keepFirst = true;
				opts.visible = 1;
			}

			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			opts.visible = Math.min( 3, Math.max( 1, opts.visible ) );
			opts.visible++;


			//	Add the iconbars
			if ( opts.add )
			{

				var cls: string = '';

				for ( var i = 0; i <= opts.visible; i++ )
				{
					cls += ' ' + _c.panel + '_iconpanel-' + i;
				}
				if ( cls.length )
				{
					cls = cls.slice( 1 );
				}

				var setPanels = function( $panel )
				{
					if ( $panel.parent( '.' + _c.listitem + '_vertical' ).length )
					{
						return;
					}

					var $panls = that.$pnls
						.children( '.' + _c.panel )
						.removeClass( cls );

					if ( keepFirst )
					{
						$panls
							.removeClass( _c.panel + '_iconpanel-first' )
							.first()
							.addClass( _c.panel + '_iconpanel-first' );
					}

					$panls
						.filter( '.' + _c.panel + '_opened-parent' )
						.removeClass( _c.hidden )
						//	TOOD: search for parent listitem_vertical
						//.not( '.' + _c.panel + '_vertical' )
						.not(
							function()
							{
								return $(this).parent( '.' + _c.listitem + '_vertical' ).length
							}
						)
						.add( $panel )
						.slice( -opts.visible )
						.each(
							function( i )
							{
								$(this).addClass( _c.panel + '_iconpanel-' + i );
							}
						);
				};

				this.bind( 'initMenu:after',
					function()
					{
						var cls = [ _c.menu + '_iconpanel-' + opts.size ];

						if ( opts.hideNavbar )
						{
							cls.push( _c.menu + '_hidenavbar' );
						}
						if ( opts.hideDivider )
						{
							cls.push( _c.menu + '_hidedivider' );
						}

						this.$menu.addClass( cls.join( ' ' ) );
					}
				);

				this.bind( 'openPanel:start', setPanels );
				this.bind( 'initPanels:after',
					function( $panels )
					{
						setPanels.call( that, that.$pnls.children( '.' + _c.panel + '_opened' ) );
					}
				);

				this.bind( 'initListview:after',
					function( $panel )
					{
						if ( opts.blockPanel &&
							!$panel.parent( '.' + _c.listitem + '_vertical' ).length &&
							!$panel.children( '.' + _c.panel + '__blocker' ).length
						) {
							$panel.prepend( '<a href="#' + $panel.closest( '.' + _c.panel ).attr( 'id' ) + '" class="' + _c.panel + '__blocker" />' );
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
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 		: false,
		blockPanel	: true,
		hideDivider	: false,
		hideNavbar	: true,
		size 		: 40,
		visible		: 3
	};


	var _c, _d, _e, glbl;

})( jQuery );