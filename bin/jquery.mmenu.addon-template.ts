/*	
 * jQuery mmenu {ADDON} add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = '{ADDON}';


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
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			//	Extend shorthand configuration
			if ( typeof conf != 'object' )
			{
				conf = {};
			}
			conf = this.conf[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].configuration[ _ADDON_ ], conf );

			//	Add methods to api
//			this._api = $.merge( this._api, [ 'fn1', 'fn2' ] );

			//	Bind functions to update
//			this.bind( 'updateListview', function() {} );
//			this.bind( 'initPanels', function() {} );
//			this.bind( 'initPage', function() {} );

		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			//	...Add classnames, data and events
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu )
		{
//			if ( $a.is( '.CLASSNAME' ) )
//			{
//				return true;
//			}
//			return false;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		//	...
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		//	...
	};


	var _c, _d, _e, glbl;

})( jQuery );