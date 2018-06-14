/*	
 * jQuery mmenu navbar add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'navbars';


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

			var _pos = {},
				$pos = {};

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

					//	Create node
					var $navbar = $( '<div class="' + _c.navbar + '" />' );
						

					//	Get height
					var hght = opts.height;

					if ( typeof hght != 'number' )
					{
						hght = 1;
					}
					else
					{
						hght = Math.min( 4, Math.max( 1, hght ) );
						if ( hght > 1 )
						{
							$navbar.addClass( _c.navbar + '_size-' + hght );
						}
					}

					//	Get position
					var poss = opts.position;

					switch( poss )
					{
						case 'bottom':
							break;

						default:
							poss = 'top';
							break;
					}

					if ( !_pos[ poss ] )
					{
						_pos[ poss ] = 0;
					}
					_pos[ poss ] += hght;

					if ( !$pos[ poss ] )
					{
						$pos[ poss ] = $( '<div class="' + _c.navbars + '_' + poss + '" />' );
					}
					$pos[ poss ].append( $navbar );


					//	Add content
					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						var ctnt = $[ _PLUGIN_ ].addons[ _ADDON_ ][ opts.content[ c ] ] || null;
						if ( ctnt )
						{
							ctnt.call( that, $navbar, opts, conf );
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

					//	Call type
					var type = $[ _PLUGIN_ ].addons[ _ADDON_ ][ opts.type ] || null;
					if ( type )
					{
						type.call( that, $navbar, opts, conf );
					}

					if ( $navbar.children( '.' + _c.btn ).length )
					{
						$navbar.addClass( _c.navbar + '_has-btns' );
					}
				}
			);

			//	Add to menu
			this.bind( 'initMenu:after',
				function()
				{
					for ( var poss in _pos )
					{
						this.$menu.addClass( _c.menu + '_navbar_' + poss + '-' + _pos[ poss ] );
						this.$menu[ poss == 'bottom' ? 'append' : 'prepend' ]( $pos[ poss ] );
					}
				}
			);
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( _ADDON_ );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		breadcrumbs: {
			separator 		: '/',
			removeFirst 	: false
		}
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;

})( jQuery );