/*	
 * jQuery mmenu RTL add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'rtl';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts != 'object' )
			{
				opts = {
					use: opts
				};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			//	Autodetect
			if ( typeof opts.use != 'boolean' )
			{
				opts.use = ( ( glbl.$html.attr( 'dir' ) || '' ).toLowerCase() == 'rtl' );
			}

			//	Use RTL
			if ( opts.use )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.menu + '_rtl' );
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
		use: 'detect'
	};


	var _c, _d, _e, glbl;

})( jQuery );