/*	
 * jQuery mmenu currentItem addon
 *
 * Copyright (c) Anthemis
 */

(function($){

	var _PLUGIN_	= 'mmenu',
		_ADDON_ 	= 'currentItem';

	$[ _PLUGIN_ ].addons[ _ADDON_ ]	= { 

		//	setup: fired once per menu
		setup : function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ];


			if ( typeof opts == 'boolean' )
			{
				opts = {
					find: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			if ( !opts.find )
			{
				return;
			}


			var findCurrent = function( url )
			{
				url = url.split( "?" )[ 0 ].split( "#" )[ 0 ];

				var $a = that.$menu.find( 'a[href="'+ url +'"], a[href="'+ url +'/"]' );
				if ( $a.length )
				{
					that.setSelected( $a.parent(), true );
				}
				else
				{
					url = url.split( '/' ).slice( 0, -1 );
					if ( url.length )
					{
						findCurrent( url.join( '/' ) );
					}
				}
			};

			findCurrent( window.location.href );
		},

		add : function() {},
		clickAnchor: function( $a, inMenu ) {}
	};

	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = { 
		find: false
	};	


	var _c, _d, _e;

})(jQuery);
