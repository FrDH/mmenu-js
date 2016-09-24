/*	
 * jQuery mmenu navbar addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'navbars';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				navs = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;

			if ( typeof navs == 'undefined' )
			{
				return;
			}

			if ( !( navs instanceof Array ) )
			{
				navs = [ navs ];
			}

			var _pos = {};

			if ( !navs.length )
			{
				return;
			}

			$.each(
				navs,
				function( n )
				{
				
					var opts = navs[ n ];

					//	Extend shorthand options
					if ( typeof opts == 'boolean' && opts )
					{
						opts = {};
					}
					if ( typeof opts != 'object' )
					{
						opts = {};
					}
					if ( typeof opts.content == 'undefined' )
					{
						opts.content = [ 'prev', 'title' ];
					}
					if ( !( opts.content instanceof Array ) )
					{
						opts.content = [ opts.content ];
					}
					opts = $.extend( true, {}, that.opts.navbar, opts );


					//	Get position and height
					var poss = opts.position,
						hght = opts.height;

					if ( typeof hght != 'number' )
					{
						hght = 1;
					}
					hght = Math.min( 4, Math.max( 1, hght ) );

					if ( poss != 'bottom' )
					{
						poss = 'top';
					}
					if ( !_pos[ poss ] )
					{
						_pos[ poss ] = 0;
					}
					_pos[ poss ]++;


					//	Add markup
					var $navbar = $( '<div />' )
						.addClass( 
							_c.navbar + ' ' +
							_c.navbar + '-' + poss + ' ' +
							_c.navbar + '-' + poss + '-' + _pos[ poss ] + ' ' +
							_c.navbar + '-size-' + hght
						);

					_pos[ poss ] += hght - 1;

					var _content = 0;
					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						var ctnt = $[ _PLUGIN_ ].addons[ _ADDON_ ][ opts.content[ c ] ] || false;
						if ( ctnt )
						{
							_content += ctnt.call( that, $navbar, opts, conf );
						}
						else
						{
							ctnt = opts.content[ c ];
							if ( !( ctnt instanceof $ ) )
							{
								ctnt = $( opts.content[ c ] );
							}
							$navbar.append( ctnt );
						}
					}

					_content += Math.ceil( $navbar.children().not( '.' + _c.btn ).length / hght );
					if ( _content > 1 )
					{
						$navbar.addClass( _c.navbar + '-content-' + _content );
					}
					if ( $navbar.children( '.' + _c.btn ).length )
					{
						$navbar.addClass( _c.hasbtns );
					}
					$navbar.prependTo( that.$menu );
				}
			);

			for ( var poss in _pos )
			{
				that.$menu.addClass( _c.hasnavbar + '-' + poss + '-' + _pos[ poss ] );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'close hasbtns' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		breadcrumbSeparator: '/'
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;

})( jQuery );