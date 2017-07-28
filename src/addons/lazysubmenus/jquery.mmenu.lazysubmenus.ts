/*	
 * jQuery mmenu lazySubmenus add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'lazySubmenus';


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
					load: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Sliding submenus
			if ( opts.load )
			{

				//	prevent all sub panels from initPanels
				this.bind( 'initMenu:after',
					function()
					{
						this.$pnls
							.find( 'li' )
							.children( this.conf.panelNodetype )
							.not( '.' + _c.inset )
							.not( '.' + _c.nolistview )
							.not( '.' + _c.nopanel )
							.addClass( _c.lazysubmenu + ' ' + _c.nolistview + ' ' + _c.nopanel );
					}
				);

				//	prepare current and one level sub panels for initPanels
				this.bind( 'initPanels:before',
					function( $panels )
					{
						$panels = $panels || this.$pnls.children( this.conf.panelNodetype );

						this.__findAddBack( $panels, '.' + _c.lazysubmenu )
							.not( '.' + _c.lazysubmenu + ' .' + _c.lazysubmenu )
							.removeClass( _c.lazysubmenu + ' ' + _c.nolistview + ' ' + _c.nopanel );
					}
				);

				//	initPanels for the default opened panel
				this.bind( 'initOpened:before',
					function()
					{
						var $selected = this.$pnls
							.find( '.' + this.conf.classNames.selected )
							.parents( '.' + _c.lazysubmenu );

						if ( $selected.length )
						{
							$selected.removeClass( _c.lazysubmenu + ' ' + _c.nolistview + ' ' + _c.nopanel );
							this.initPanels( $selected.last() );
						}
					}
				);

				//	initPanels for current- and sub panels before openPanel
				this.bind( 'openPanel:before',
					function( $panel )
					{
						var $panels = this.__findAddBack( $panel, '.' + _c.lazysubmenu )
							.not( '.' + _c.lazysubmenu + ' .' + _c.lazysubmenu );

						if ( $panels.length )
						{
							this.initPanels( $panels );
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

			_c.add( 'lazysubmenu' );
			_d.add( 'lazysubmenu' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		load: false
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;


})( jQuery );