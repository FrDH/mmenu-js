/*	
 * jQuery mmenu navbar addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'navbars',
		_SINGLE_ = 'navbar';


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

			$.each(navs, function( n ) {
			
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
					opts.content = [ 'prev', 'title', 'next' ];
				}
				opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _SINGLE_ ], opts );

				var poss = poss = opts.position || 'top';


				//	Add markup
				var $navbar = $( '<div class="' + _c.navbar + ' ' + _c.navbar + '-' + poss + '" />' );

				if ( opts.content instanceof Array )
				{
					var $content = $( '<div />' ),
						_content = 0,
						_update  = false,
						_prevbtn = false;

					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						switch ( opts.content[ c ] )
						{
							case 'prev':
							case 'next':
							case 'close':
							case 'title':
								_update = true;
								break;
						}
						switch ( opts.content[ c ] )
						{
							case 'prev':
								_prevbtn = true;
								break;
						}
						switch ( opts.content[ c ] )
						{
							case 'prev':
							case 'next':
							case 'close':
								$navbar.addClass( _c.hasbtns );
								$content.append( '<a class="' + _c[ opts.content[ c ] ] + ' ' + _c.btn + '" href="#"></a>' );
								break;

							case 'title':
								_content++;
								$content.append( '<a class="' + _c.title + '"></a>' );
								break;

							default:
								if ( !( opts.content[ c ] instanceof $ ) )
								{
									opts.content[ c ] = $( opts.content[ c ] );
								}
								that.__findAddBack( opts.content[ c ], 'a' )
									.each(
										function()
										{
											_content++;
											$content.append( $(this) );
										}
									);
								break;
						}
					}
					if ( _content > 1 )
					{
						$navbar.addClass( _c.navbar + '-' + _content );
					}
					$content = $content.html();
				}
				else
				{
					var $content = opts.content;
				}

				$navbar
					.prependTo( that.$menu )
					.append( $content );

				that.$menu.addClass( _c.hasnavbar + '-' + poss );

				if ( _prevbtn )
				{
					that.$menu.addClass( _c.hasnavbar );
					that.bind( 'init',
						function( $panel )
						{
							$panel.removeClass( _c.hasnavbar );
						}
					);
				}

				//	Update content
				if ( _update )
				{
					var $titl = $navbar.find( '.' + _c.title ),
						$prev = $navbar.find( '.' + _c.prev ),
						$next = $navbar.find( '.' + _c.next ),
						$clse = $navbar.find( '.' + _c.close );

					var update = function( $panl )
					{
						$panl = $panl || that.$menu.children( '.' + _c.current );

						//	Find title, prev and next
						var $ttl = $panl.find( '.' + that.conf.classNames[ _ADDON_ ].panelTitle	+ '-' + poss ),
							$prv = $panl.find( '.' + that.conf.classNames[ _ADDON_ ].panelPrev	+ '-' + poss ),
							$nxt = $panl.find( '.' + that.conf.classNames[ _ADDON_ ].panelNext	+ '-' + poss ),
							$prt = $panl.data( _d.parent );

						var _ttl = $ttl.html(),
							_prv = $prv.attr( 'href' ),
							_nxt = $nxt.attr( 'href' ),
							_prt = false;

						var _prv_txt = $prv.html(),
							_nxt_txt = $nxt.html();

						if ( !_ttl )
						{
							_ttl = $panl.children( '.' + _c.navbar ).children( '.' + _c.title ).html();
						}
						if ( !_ttl )
						{
							_ttl = opts.title;
						}
						if ( !_prv )
						{
							_prv = $panl.children( '.' + _c.navbar ).children( '.' + _c.prev ).attr( 'href' );
						}

						switch ( opts.titleLink )
						{
							case 'anchor':
								var _prt = ( $prt ) ? $prt.children( 'a' ).not( '.' + _c.next ).attr( 'href' ) : false;
								break;
							
							case 'panel':
								var _prt = _prv;
								break;
						}

						$titl[ _prt ? 'attr' : 'removeAttr' ]( 'href', _prt );
						$titl[ _ttl ? 'removeClass' : 'addClass' ]( _c.hidden );
						$titl.html( _ttl );

						$prev[ _prv ? 'attr' : 'removeAttr' ]( 'href', _prv );
						$prev[ _prv || _prv_txt ? 'removeClass' : 'addClass' ]( _c.hidden );
						$prev.html( _prv_txt );

						$next[ _nxt ? 'attr' : 'removeAttr' ]( 'href', _nxt );
						$next[ _nxt || _nxt_txt ? 'removeClass' : 'addClass' ]( _c.hidden );
						$next.html( _nxt_txt );
					};

					that.bind( 'openPanel', update );
					that.bind( 'init',
						function()
						{
							update.call( that, that.$menu.children( '.' + _c.current ) );
						}
					);

					if ( that.opts.offCanvas )
					{
						var setPage = function( $page )
						{
							$clse.attr( 'href', '#' + $page.attr( 'id' ) );
						};
						setPage.call( that, glbl.$page );
						that.bind( 'setPage', setPage );
					}
				}
			});
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
	$[ _PLUGIN_ ].defaults[ _SINGLE_ ] = {
//		content 	: ['prev', 'title', 'next'],
		position	: 'top',
		title		: 'Menu',
		titleLink	: 'panel'
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		panelTitle	: 'Title',
		panelNext	: 'Next',
		panelPrev	: 'Prev'
	};


	var _c, _d, _e, glbl;

})( jQuery );