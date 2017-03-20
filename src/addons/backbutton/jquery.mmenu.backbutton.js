/*	
 * jQuery mmenu backButton add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'backButton';


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
			if ( typeof opts == 'boolean' )
			{
				opts = {
					close	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			

			//	Close menu
			if ( opts.close )
			{
				var _hash = '#' + that.$menu.attr( 'id' );
				this.bind( 'open:finish',
					function( e )
					{
						if ( location.hash != _hash )
						{
							history.pushState( null, document.title, _hash );
						}
					}
				);

				$(window).on( 'popstate',
					function( e )
					{
	
						if ( glbl.$html.hasClass( _c.opened ) )
						{
							e.stopPropagation();
							that.close();
						}
						else if ( location.hash == _hash )
						{
							e.stopPropagation();
							that.open();
						}
					}
				);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			if ( !window.history || !window.history.pushState )
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
		close: false
	};


	var _c, _d, _e, glbl;

})( jQuery );