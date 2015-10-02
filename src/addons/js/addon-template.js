/*	
 * jQuery mmenu {ADDON} addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = '{ADDON}';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;

			//	Extend shortcut options
			//	Extend shortcut configuration
			//	...

			//	Add methods to api
//			this._api = $.merge( this._api, [ 'fn1', 'fn2' ] );

			//	Bind functions to update
//			this.bind( 'update', function() {} );
//			this.bind( 'init', function() {} );
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
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		//	...
	};


	var _c, _d, _e, glbl;

})( jQuery );