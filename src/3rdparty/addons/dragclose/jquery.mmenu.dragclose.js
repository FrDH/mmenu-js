/*	
 * jQuery mmenu dragClose addon
 *
 * Copyright (c) ...
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'dragClose';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;

			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					close: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Swipe close
			if ( opts.close )
			{

				//	Set up variables
				var closeGesture, prevGesture;

				switch( this.opts.offCanvas.position )
				{
					case 'left':
						closeGesture = 'swipeleft';
						break;
	
					case 'right':
						closeGesture = 'swiperight';
						break;
	
					case 'top':
						closeGesture = 'swipeup';
						break;
	
					case 'bottom':
						closeGesture = 'swipedown';
						break;
				}

				if ( this.opts.extensions.indexOf( 'mm-leftsubpanel' ) != -1 )
				{
					prevGesture = 'swipeleft';
				}
				else
				{
					prevGesture = 'swiperight';
				}

				//	Bind events
				var _hammer = new Hammer( this.$menu[0], opts.vendors.hammer );
				_hammer
					.on( closeGesture,
						function( e )
						{
							if ( that.opts.offCanvas ) {
								var prev = that.$menu.find('.' + _c.prev + ':visible');
								if ( !prev.length ) that.close();
								else if (closeGesture != prevGesture) that.close();
							}
						}
					)
					.on( prevGesture,
						function( e )
						{
							var prev = that.$menu.find( '.' + _c.prev + ':visible' );
							if (prev.length > 0) prev.click();
						}
					);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			if ( typeof Hammer != 'function' || Hammer.VERSION < 2 )
			{
				$[ _PLUGIN_ ].addons[ _ADDON_ ].setup = function() {};
				return;
			}

			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		close		: false,
		vendors		: {
			hammer		: {}
		}
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;

})( jQuery );
