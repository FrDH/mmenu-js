/*	
 * jQuery mmenu v5.2.0
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Licensed under the MIT license:
 * http://en.wikipedia.org/wiki/MIT_License
 */

(function( $ ) {

	var _PLUGIN_	= 'mmenu',
		_VERSION_	= '5.2.0';


	//	Plugin already excists
	if ( $[ _PLUGIN_ ] )
	{
		return;
	}


	/*
		Class
	*/
	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		this.$menu	= $menu;
		this._api	= [ 'bind', 'init', 'update', 'setSelected', 'getInstance', 'openPanel', 'closePanel', 'closeAllPanels' ];
		this.opts	= opts;
		this.conf	= conf;
		this.vars	= {};
		this.cbck	= {};


		if ( typeof this.___deprecated == 'function' )
		{
			this.___deprecated();
		}

		this._initMenu();
		this._initAnchors();

		var $panels = this.$menu.children( this.conf.panelNodetype );
		
		this._initAddons();
		this.init( $panels );


		if ( typeof this.___debug == 'function' )
		{
			this.___debug();
		}

		return this;
	};

	$[ _PLUGIN_ ].version 	= _VERSION_;
	$[ _PLUGIN_ ].addons 	= {};
	$[ _PLUGIN_ ].uniqueId 	= 0;


	$[ _PLUGIN_ ].defaults 	= {
		extensions		: [],
		navbar 			: {
			title			: 'Menu',
			titleLink		: 'panel'
		},
		onClick			: {
//			close			: true,
//			blockUI			: null,
//			preventDefault	: null,
			setSelected		: true
		},
		slidingSubmenus	: true
	};

	$[ _PLUGIN_ ].configuration = {
		classNames			: {
			panel		: 'Panel',
			vertical	: 'Vertical',
			selected	: 'Selected',
			divider		: 'Divider',
			spacer		: 'Spacer'
		},
		clone				: false,
		openingInterval		: 25,
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 400
	};

	$[ _PLUGIN_ ].prototype = {

		init: function( $panels )
		{
			$panels = $panels.not( '.' + _c.nopanel );
			$panels = this._initPanels( $panels );

			this.trigger( 'init', $panels );
			this.trigger( 'update' );
		},

		update: function()
		{
			this.trigger( 'update' );
		},

		setSelected: function( $i )
		{
			this.$menu.find( '.' + _c.listview ).children().removeClass( _c.selected );
			$i.addClass( _c.selected );
			this.trigger( 'setSelected', $i );
		},
		
		openPanel: function( $panel )
		{
			var $l = $panel.parent();

			//	Vertical
			if ( $l.hasClass( _c.vertical ) )
			{
				var $sub = $l.parents( '.' + _c.subopened );
				if ( $sub.length )
				{
					return this.openPanel( $sub.first() );
				}
				$l.addClass( _c.opened );
			}

			//	Horizontal
			else
			{
				if ( $panel.hasClass( _c.current ) )
				{
					return;
				}

				var $panels = $(this.$menu).children( '.' + _c.panel ),
					$current = $panels.filter( '.' + _c.current );

				$panels
					.removeClass( _c.highest )
					.removeClass( _c.current )
					.not( $panel )
					.not( $current )
					.not( '.' + _c.vertical )
					.addClass( _c.hidden );

				if ( $panel.hasClass( _c.opened ) )
				{
					$current
						.addClass( _c.highest )
						.removeClass( _c.opened )
						.removeClass( _c.subopened );
				}
				else
				{
					$panel.addClass( _c.highest );
					$current.addClass( _c.subopened );
				}

				$panel
					.removeClass( _c.hidden )
					.addClass( _c.current );

				//	Without the timeout, the animation won't work because the element had display: none;
				setTimeout(
					function()
					{
						$panel
							.removeClass( _c.subopened )
							.addClass( _c.opened );
					}, this.conf.openingInterval
				);
			}
			this.trigger( 'openPanel', $panel );
		},

		closePanel: function( $panel )
		{
			var $l = $panel.parent();

			//	Vertical only
			if ( $l.hasClass( _c.vertical ) )
			{
				$l.removeClass( _c.opened );
				this.trigger( 'closePanel', $panel );
			}
		},

		closeAllPanels: function()
		{
			//	Vertical
			this.$menu.find( '.' + _c.listview )
				.children()
				.removeClass( _c.selected )
				.filter( '.' + _c.vertical )
				.removeClass( _c.opened );

			//	Horizontal
			var $pnls = this.$menu.children( '.' + _c.panel ),
				$frst = $pnls.first();

			this.$menu.children( '.' + _c.panel )
				.not( $frst )
				.removeClass( _c.subopened )
				.removeClass( _c.opened )
				.removeClass( _c.current )
				.removeClass( _c.highest )
				.addClass( _c.hidden );

			this.openPanel( $frst );
		},
		
		togglePanel: function( $panel )
		{
			var $l = $panel.parent();

			//	Vertical only
			if ( $l.hasClass( _c.vertical ) )
			{
				this[ $l.hasClass( _c.opened ) ? 'closePanel' : 'openPanel' ]( $panel );
			}
		},

		getInstance: function()
		{
			return this;
		},

		bind: function( event, fn )
		{
			this.cbck[ event ] = this.cbck[ event ] || [];
			this.cbck[ event ].push( fn );
		},

		trigger: function()
		{
			var that = this,
				args = Array.prototype.slice.call( arguments ),
				evnt = args.shift();

			if ( this.cbck[ evnt ] )
			{
				for ( var e = 0, l = this.cbck[ evnt ].length; e < l; e++ )
                {
                    this.cbck[ evnt ][ e ].apply( that, args );
                }
			}
		},

		_initMenu: function()
		{
			var that = this;

			//	Clone if needed
			if ( this.opts.offCanvas && this.conf.clone )
			{
				this.$menu = this.$menu.clone( true );
				this.$menu.add( this.$menu.find( '[id]' ) )
					.filter( '[id]' )
					.each(
						function()
						{
							$(this).attr( 'id', _c.mm( $(this).attr( 'id' ) ) );
						}
					);
			}

			//	Strip whitespace
			this.$menu.contents().each(
				function()
				{
					if ( $(this)[ 0 ].nodeType == 3 )
					{
						$(this).remove();
					}
				}
			);

			this.$menu
				.parent()
				.addClass( _c.wrapper );

			var clsn = [ _c.menu ];

			//	Add direction class
			if ( !this.opts.slidingSubmenus )
			{
				clsn.push( _c.vertical );
			}

			//	Add extensions
			this.opts.extensions = ( this.opts.extensions.length )
				? 'mm-' + this.opts.extensions.join( ' mm-' )
				: '';

			if ( this.opts.extensions )
			{
				clsn.push( this.opts.extensions );
			}

			this.$menu.addClass( clsn.join( ' ' ) );
		},

		_initPanels: function( $panels )
		{
			var that = this;

			//	Add List class
			this.__findAddBack( $panels, 'ul, ol' )
				.not( '.' + _c.nolistview )
				.addClass( _c.listview );

			var $lis = this.__findAddBack( $panels, '.' + _c.listview ).children();

			//	Refactor Selected class
			this.__refactorClass( $lis, this.conf.classNames.selected, 'selected' );

			//	Refactor divider class
			this.__refactorClass( $lis, this.conf.classNames.divider, 'divider' );

			//	Refactor Spacer class
			this.__refactorClass( $lis, this.conf.classNames.spacer, 'spacer' );

			//	Refactor Panel class
			this.__refactorClass( this.__findAddBack( $panels, '.' + this.conf.classNames.panel ), this.conf.classNames.panel, 'panel' );

			//	Create panels
			var $curpanels = $(),
				$oldpanels = $panels
					.add( $panels.find( '.' + _c.panel ) )
					.add( this.__findAddBack( $panels, '.' + _c.listview ).children().children( this.conf.panelNodetype ) )
					.not( '.' + _c.nopanel );

			this.__refactorClass( $oldpanels, this.conf.classNames.vertical, 'vertical' );
			
			if ( !this.opts.slidingSubmenus )
			{
				$oldpanels.addClass( _c.vertical );
			}

			$oldpanels
				.each(
					function()
					{
						var $t = $(this),
							$p = $t;

						if ( $t.is( 'ul, ol' ) )
						{
							$t.wrap( '<div class="' + _c.panel + '" />' );
							$p = $t.parent();
						}
						else
						{
							$p.addClass( _c.panel );
						}

						var id = $t.attr( 'id' );
						$t.removeAttr( 'id' );
						$p.attr( 'id', id || that.__getUniqueId() );

						if ( $t.hasClass( _c.vertical ) )
						{
							$t.removeClass( that.conf.classNames.vertical );
							$p.add( $p.parent() ).addClass( _c.vertical );
						}

						$curpanels = $curpanels.add( $p );

						var $f = $p.children().first(),
							$l = $p.children().last();

						if ( $f.is( '.' + _c.listview ) )
						{
							$f.addClass( _c.first );
						}
						if ( $l.is( '.' + _c.listview ) )
						{
							$l.addClass( _c.last );
						}
					} 
				);

			var $allpanels = $('.' + _c.panel, this.$menu);

			//	Add open and close links to menu items
			$curpanels
				.each(
					function( i )
					{
						var $t = $(this),
							$p = $t.parent(),
							$a = $p.children( 'a, span' ).first();

						if ( !$p.is( '.' + _c.menu ) )
						{
							$p.data( _d.sub, $t );
							$t.data( _d.parent, $p );
						}

						//	Open link
						if ( !$p.children( '.' + _c.next ).length )
						{
							if ( $p.parent().is( '.' + _c.listview ) )
							{
								var id = $t.attr( 'id' ),
									$b = $( '<a class="' + _c.next + '" href="#' + id + '" data-target="#' + id + '" />' ).insertBefore( $a );

								if ( $a.is( 'span' ) )
								{
									$b.addClass( _c.fullsubopen );
								}
							}
						}

						//	Navbar
						if ( !$t.children( '.' + _c.navbar ).length )
						{
							if ( !$p.hasClass( _c.vertical ) )
							{
								if ( $p.parent().is( '.' + _c.listview ) )
								{
									//	Listview, the panel wrapping this panel
									var $p = $p.closest( '.' + _c.panel );
								}
								else
								{
									//	Non-listview, the first panel that has an anchor that links to this panel
									var $a = $p.closest( '.' + _c.panel ).find( 'a[href="#' + $t.attr( 'id' ) + '"]' ).first(),
										$p = $a.closest( '.' + _c.panel );
								}

								var $navbar = $( '<div class="' + _c.navbar + '" />' );

								if ( $p.length )
								{
									var id = $p.attr( 'id' );
									switch ( that.opts.navbar.titleLink )
									{
										case 'anchor':
											_url = $a.attr( 'href' );
											break;

										case 'panel':
										case 'parent':
											_url = '#' + id;
											break;

										case 'none':
										default:
											_url = false;
											break;
									}

									$navbar
										.append( '<a class="' + _c.btn + ' ' + _c.prev + '" href="#' + id + '" data-target="#' + id + '"></a>' )
										.append( '<a class="' + _c.title + '"' + ( _url ? ' href="' + _url + '"' : '' ) + '>' + $a.text() + '</a>' )
										.prependTo( $t );

									$t.addClass( _c.hasnavbar );
								}
								else if ( that.opts.navbar.title )
								{
									$navbar
										.append( '<a class="' + _c.title + '">' + that.opts.navbar.title + '</a>' )
										.prependTo( $t );

									$t.addClass( _c.hasnavbar );
								}
							}
						}
					}
				);


			//	Add opened-classes to parents
			var $s = this.__findAddBack( $panels, '.' + _c.listview )
				.children( '.' + _c.selected )
				.removeClass( _c.selected )
				.last()
				.addClass( _c.selected );

			$s.add( $s.parentsUntil( '.' + _c.menu, 'li' ) )
				.filter( '.' + _c.vertical )
				.addClass( _c.opened )
				.end()
				.not( '.' + _c.vertical )
				.each(
					function()
					{
						$(this).parentsUntil( '.' + _c.menu, '.' + _c.panel )
							.not( '.' + _c.vertical )
							.first()
							.addClass( _c.opened )
							.parentsUntil( '.' + _c.menu, '.' + _c.panel )
							.not( '.' + _c.vertical )
							.first()
							.addClass( _c.opened )
							.addClass( _c.subopened );
					}
				);


			//	Add opened-classes to child
			$s.children( '.' + _c.panel )
				.not( '.' + _c.vertical )
				.addClass( _c.opened )
				.parentsUntil( '.' + _c.menu, '.' + _c.panel )
				.not( '.' + _c.vertical )
				.first()
				.addClass( _c.opened )
				.addClass( _c.subopened );


			//	Set current opened
			var $current = $allpanels.filter( '.' + _c.opened );
			if ( !$current.length )
			{
				$current = $curpanels.first();
			}
			$current
				.addClass( _c.opened )
				.last()
				.addClass( _c.current );


			//	Rearrange markup
			$curpanels
				.not( '.' + _c.vertical )
				.not( $current.last() )
				.addClass( _c.hidden )
				.end()
				.appendTo( this.$menu );
			
			return $curpanels;
		},

		_initAnchors: function()
		{
			var that = this;

			glbl.$body
				.on( _e.click + '-oncanvas',
					'a[href]',
					function( e )
					{
						var $t = $(this),
							fired 	= false,
							inMenu 	= that.$menu.find( $t ).length;

						//	Find behavior for addons
						for ( var a in $[ _PLUGIN_ ].addons )
						{
							if ( fired = $[ _PLUGIN_ ].addons[ a ].clickAnchor.call( that, $t, inMenu ) )
							{
								break;
							}
						}

						//	Open/Close panel
						if ( !fired && inMenu )
						{
							var _h = $t.attr( 'href' );

							if ( _h.length > 1 && _h.slice( 0, 1 ) == '#' )
							{
								var $h = $(_h, that.$menu);
								if ( $h.is( '.' + _c.panel ) )
								{
									fired = true;
									that[ $t.parent().hasClass( _c.vertical ) ? 'togglePanel' : 'openPanel' ]( $h );
								}
							}
						}

						if ( fired )
						{
							e.preventDefault();
						}


						//	All other anchors in lists
						if ( !fired && inMenu )
						{
							if ( $t.is( '.' + _c.listview + ' > li > a' )
								&& !$t.is( '[rel="external"]' ) 
								&& !$t.is( '[target="_blank"]' ) )
							{

								//	Set selected item
								if ( that.__valueOrFn( that.opts.onClick.setSelected, $t ) )
								{
									that.setSelected( $(e.target).parent() );
								}
	
								//	Prevent default / don't follow link. Default: false
								var preventDefault = that.__valueOrFn( that.opts.onClick.preventDefault, $t, _h.slice( 0, 1 ) == '#' );
								if ( preventDefault )
								{
									e.preventDefault();
								}
		
								//	Block UI. Default: false if preventDefault, true otherwise
								if ( that.__valueOrFn( that.opts.onClick.blockUI, $t, !preventDefault ) )
								{
									glbl.$html.addClass( _c.blocking );
								}

								//	Close menu. Default: true if preventDefault, false otherwise
								if ( that.__valueOrFn( that.opts.onClick.close, $t, preventDefault ) )
								{
									that.close();
								}
							}
						}
					}
				);
		},

		_initAddons: function()
		{
			//	Add add-ons to plugin
			for ( var a in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ a ].add.call( this );
				$[ _PLUGIN_ ].addons[ a ].add = function() {};
			}

			//	Setup adds-on for menu
			for ( var a in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ a ].setup.call( this );
			}
		},

		__api: function()
		{
			var that = this,
				api = {};

			$.each( this._api, 
				function( i )
				{
					var fn = this;
					api[ fn ] = function()
					{
						var re = that[ fn ].apply( that, arguments );
						return ( typeof re == 'undefined' ) ? api : re;
					}
				}
			);
			return api;
		},

		__valueOrFn: function( o, $e, d )
		{
			if ( typeof o == 'function' )
			{
				return o.call( $e[ 0 ] );
			}
			if ( typeof o == 'undefined' && typeof d != 'undefined' )
			{
				return d;
			}
			return o;
		},

		__refactorClass: function( $e, o, c )
		{
			return $e.filter( '.' + o ).removeClass( o ).addClass( _c[ c ] );
		},

		__findAddBack: function( $e, s )
		{
			return $e.find( s ).add( $e.filter( s ) );
		},

		__filterListItems: function( $i )
		{
			return $i
				.not( '.' + _c.divider )
				.not( '.' + _c.hidden );
		},
		
		__transitionend: function( $e, fn, duration )
		{
			var _ended = false,
				_fn = function()
				{
					if ( !_ended )
					{
						fn.call( $e[ 0 ] );
					}
					_ended = true;
				};
	
			$e.one( _e.transitionend, _fn );
			$e.one( _e.webkitTransitionEnd, _fn );
			setTimeout( _fn, duration * 1.1 );
		},
		
		__getUniqueId: function()
		{
			return _c.mm( $[ _PLUGIN_ ].uniqueId++ );
		}
	};


	/*
		jQuery plugin
	*/
	$.fn[ _PLUGIN_ ] = function( opts, conf )
	{
		//	First time plugin is fired
		initPlugin();

		//	Extend options
		opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults, opts );
		conf = $.extend( true, {}, $[ _PLUGIN_ ].configuration, conf );

		return this.each(
			function()
			{
				var $menu = $(this);
				if ( $menu.data( _PLUGIN_ ) )
				{
					return;
				}
				var _menu = new $[ _PLUGIN_ ]( $menu, opts, conf );
				$menu.data( _PLUGIN_, _menu.__api() );
			}
		);
	};


	/*
		SUPPORT
	*/
	$[ _PLUGIN_ ].support = {
		touch: 'ontouchstart' in window || navigator.msMaxTouchPoints
	};


	//	Global variables
	var _c, _d, _e, glbl;

	function initPlugin()
	{
		if ( $[ _PLUGIN_ ].glbl )
		{
			return;
		}

		glbl = {
			$wndw : $(window),
			$html : $('html'),
			$body : $('body')
		};


		//	Classnames, Datanames, Eventnames
		_c = {};
		_d = {};
		_e = {};
		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( a )
				{
					a = a.split( ' ' );
					for ( var b = 0, l = a.length; b < l; b++ )
					{
						o[ a[ b ] ] = o.mm( a[ b ] );
					}
				};
			}
		);

		//	Classnames
		_c.mm = function( c ) { return 'mm-' + c; };
		_c.add( 'wrapper menu vertical panel nopanel current highest opened subopened navbar hasnavbar title btn prev next first last listview nolistview selected divider spacer hidden fullsubopen' );
		_c.umm = function( c )
		{
			if ( c.slice( 0, 3 ) == 'mm-' )
			{
				c = c.slice( 3 );
			}
			return c;
		};

		//	Datanames
		_d.mm = function( d ) { return 'mm-' + d; };
		_d.add( 'parent sub' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'transitionend webkitTransitionEnd mousedown mouseup touchstart touchmove touchend click keydown' );

		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;
	}


})( jQuery );