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

			$.each(
				navs,
				function( n )
				{
				
					var opts = navs[ n ];

					//	Extend shortcut options
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

					var poss = opts.position;
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
						.addClass( _c.navbar )
						.addClass( _c.navbar + '-' + poss )
						.addClass( _c.navbar + '-' + poss + '-' + _pos[ poss ] );

					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						var ctnt = $[ _PLUGIN_ ].addons[ _ADDON_ ][ opts.content[ c ] ] || false;
						if ( ctnt )
						{
							ctnt.call( that, $navbar, opts );
						}
						else
						{
							ctnt = opts.content[ c ];
							if ( !( ctnt instanceof $ ) )
							{
								ctnt = $( opts.content[ c ] );
							}
							ctnt
								.each(
									function()
									{
										$navbar.append( $(this) );
									}
								);
						}
					}

					var _content = $navbar.children().not( '.' + _c.btn ).length;
					if ( _content > 1 )
					{
						$navbar.addClass( _c.navbar + '-' + _content );
					}
					if ( $navbar.children( '.' + _c.btn ).length )
					{
						$navbar.addClass( _c.hasbtns );
					}
					$navbar.prependTo( that.$menu );
				}
			);

			for ( var p in _pos )
			{
				that.$menu.addClass( _c.hasnavbar + '-' + p + '-' + _pos[ p ] );
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
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		panelTitle	: 'Title',
		panelNext	: 'Next',
		panelPrev	: 'Prev'
	};


	var _c, _d, _e, glbl;

})( jQuery );