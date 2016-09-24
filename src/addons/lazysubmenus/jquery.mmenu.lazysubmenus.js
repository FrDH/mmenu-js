/*	
 * jQuery mmenu lazySubmenus addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'lazySubmenus';


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
				this.$menu
					.find( 'li' )
					.find( 'li' )
					.children( this.conf.panelNodetype )
					.each(
						function()
						{
							$(this)
								.parent()
								.addClass( _c.lazysubmenu )
								.data( _d.lazysubmenu, this )
								.end()
								.remove();
						}
					);

				this.bind( 'openingPanel',
					function( $panl )
					{
						var $prnt = $panl.find( '.' + _c.lazysubmenu );
						if ( $prnt.length )
						{
							$prnt.each(
								function()
								{
									$(this)
										.append( $(this).data( _d.lazysubmenu ) )
										.removeData( _d.lazysubmenu )
										.removeClass( _c.lazysubmenu );
								}
							);

							this.initPanels( $panl );
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