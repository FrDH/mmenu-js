/*	
 * jQuery mmenu backButton add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'backButton';


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
					close: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			
			var _menu  = '#' + this.$menu.attr( 'id' );

			//	Close menu
			if ( opts.close )
			{

				var states = [];

				function setStates()
				{
					states = [ _menu ];
					this.$pnls.children( '.' + _c.panel + '_opened-parent' )
						.add( that.$pnls.children( '.' + _c.panel + '_opened' ) )
						.each(
							function()
							{
								states.push( '#' + $(this).attr( 'id' ) );
							}
						);
				}

				this.bind( 'open:finish', function() {
					history.pushState( null, document.title, _menu );
				});
				this.bind( 'open:finish', setStates );
				this.bind( 'openPanel:finish', setStates );
				this.bind( 'close:finish',
					function()
					{
						states = [];
						history.back();
						history.pushState( null, document.title, location.pathname + location.search );
					}
				);

				$(window).on( 'popstate',
					function( e )
					{
						if ( that.vars.opened )
						{
							if ( states.length )
							{
								states = states.slice( 0, -1 );
								var hash = states[ states.length - 1 ];

								if ( hash == _menu )
								{
									that.close();
								}
								else
								{
									that.openPanel( $( hash ) );
									history.pushState( null, document.title, _menu );
								}
							}
						}
					}
				);
			}

			if ( opts.open )
			{
				$(window).on( 'popstate',
					function( e )
					{
						if ( !that.vars.opened && location.hash == _menu )
						{
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
		close 	: false,
		open 	: false
	};


	var _c, _d, _e, glbl;

})( jQuery );
