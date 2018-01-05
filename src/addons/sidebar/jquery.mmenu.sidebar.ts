/*	
 * jQuery mmenu sidebar add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'sidebar';


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


			//	Extend shorthand options
			if ( typeof opts == 'string' ||
			   ( typeof opts == 'boolean' && opts ) ||
				 typeof opts == 'number'
			) {
				opts = {
					expanded: opts
				};
			}

			if ( typeof opts != 'object' )
			{
				opts = {};
			}

			if ( typeof opts.collapsed == 'boolean' && opts.collapsed )
			{
				opts.collapsed = 'all';
			}
			if ( typeof opts.collapsed == 'string' ||
				 typeof opts.collapsed == 'number'
			) {
				opts.collapsed = {
					use: opts.collapsed
				};
			}
			if ( typeof opts.collapsed != 'object' )
			{
				opts.collapsed = {};
			}
			if ( typeof opts.collapsed.use == 'number' )
			{
				opts.collapsed.use = '(min-width: ' + opts.collapsed.use + 'px)';
			}

			if ( typeof opts.expanded == 'boolean' && opts.expanded )
			{
				opts.expanded = 'all';
			}
			if ( typeof opts.expanded == 'string' ||
				 typeof opts.expanded == 'number'
			) {
				opts.expanded = {
					use: opts.expanded
				};
			}
			if ( typeof opts.expanded != 'object' )
			{
				opts.expanded = {};
			}
			if ( typeof opts.expanded.use == 'number' )
			{
				opts.expanded.use = '(min-width: ' + opts.expanded.use + 'px)';
			}

			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Store classnames
			var clsclpsd = _c.wrapper + '_sidebar-collapsed-' + opts.collapsed.size,
				clsxpndd = _c.wrapper + '_sidebar-expanded-'  + opts.expanded.size;


			//	Collapsed
			if ( opts.collapsed.use )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.menu + '_sidebar-collapsed' );

						if ( opts.collapsed.blockMenu &&
							 this.opts.offCanvas &&
							!this.$menu.children( '.' + _c.menu + '__blocker' ).length
						) {
							this.$menu.prepend( '<a class="' + _c.menu + '__blocker" href="#' + this.$menu.attr( 'id' ) + '" />' );
						}
						if ( opts.collapsed.hideNavbar )
						{
							this.$menu.addClass( _c.menu + '_hidenavbar' );
						}
						if ( opts.collapsed.hideDivider )
						{
							this.$menu.addClass( _c.menu + '_hidedivider' );
						}
					}
				);

				if ( typeof opts.collapsed.use == 'boolean' )
				{
					this.bind( 'initMenu:after',
						function()
						{
							glbl.$html.addClass( clsclpsd );
						}
					);
				}
				else
				{
					this.matchMedia( opts.collapsed.use,
						function()
						{
							glbl.$html.addClass( clsclpsd );
						},
						function()
						{
							glbl.$html.removeClass( clsclpsd );
						}
					);
				}
			}


			//	Expanded
			if ( opts.expanded.use )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.menu + '_sidebar-expanded' );
					}
				);

				if ( typeof opts.expanded.use == 'boolean' )
				{
					this.bind( 'initMenu:after',
						function()
						{
							glbl.$html.addClass( clsxpndd );
							this.open();
						}
					);
				}
				else
				{
					this.matchMedia( opts.expanded.use,
						function()
						{
							glbl.$html.addClass( clsxpndd );
							if ( !glbl.$html.hasClass( _c.wrapper + '_sidebar-closed' ) )
							{
								this.open();
							}
						},
						function()
						{
							glbl.$html.removeClass( clsxpndd );
							this.close();
						}
					);
				}

				this.bind( 'close:start',
					function()
					{
						if ( glbl.$html.hasClass( clsxpndd ) )
						{
							glbl.$html.addClass( _c.wrapper + '_sidebar-closed' );
						}
					}
				);

				this.bind( 'open:start',
					function()
					{
						glbl.$html.removeClass( _c.wrapper + '_sidebar-closed' );
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
		clickAnchor: function( $a, inMenu, inListview ) {
			if ( this.opts[ _ADDON_ ].expanded.use && 
				glbl.$html.is( '[class*="' + _c.wrapper + '_sidebar-expanded-"]' )
			) {
				if ( inMenu && inListview )
				{
					return {
						close: false
					};
				}
			}
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		collapsed 	: {
			use 		: false,
			size 		: 40,
			blockMenu	: true,
			hideDivider	: false,
			hideNavbar	: true
		},
		expanded 	: {
			use			: false,
			size 		: 30
		}
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;


})( jQuery );