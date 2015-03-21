/*	
 * jQuery mmenu fixedElements addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'fixedElements';


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

			var setPage = function( $page )
			{
				//	Refactor fixed classes
				var _fixd = this.conf.classNames[ _ADDON_ ].fixed;

				this.__refactorClass( $page.find( '.' + _fixd ), _fixd, 'fixed' )
					.appendTo( glbl.$body )
					.addClass( _c.slideout );
			};
			setPage.call( this, glbl.$page );
			this.bind( 'setPage', setPage );
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'fixed' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		fixed 	: 'Fixed'
	};


	var _c, _d, _e, glbl;

})( jQuery );