/*
 * jQuery mmenu v6.0.1
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */

(function( $ ) {

	var _PLUGIN_	= 'mmenu',
		_VERSION_	= '6.0.1';


	//	Newer version of the plugin already excists
	if ( $[ _PLUGIN_ ] && $[ _PLUGIN_ ].version > _VERSION_ )
	{
		return;
	}


	/*
		Class
	*/
	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		this.$menu	= $menu;
		this._api	= [ 'bind', 'getInstance', 'initPanels', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected' ];
		this.opts	= opts;
		this.conf	= conf;
		this.vars	= {};
		this.cbck	= {};
		this.mtch 	= {};


		if ( typeof this.___deprecated == 'function' )
		{
			this.___deprecated();
		}

		this._initAddons();
		this._initExtensions();

		this._initMenu();
		this._initPanels();
		this._initOpened();
		this._initAnchors();
		this._initMatchMedia();

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
		initMenu 		: function() {},
		initPanels 		: function() {},
		navbar 			: {
			add 			: true,
			title			: 'Menu',
			titleLink		: 'parent'
		},
		onClick			: {
//			close			: true,
//			preventDefault	: null,
			setSelected		: true
		},
		slidingSubmenus	: true
	};

	$[ _PLUGIN_ ].configuration = {
		classNames			: {
			divider		: 'Divider',
			inset 		: 'Inset',
			nolistview 	: 'NoListview',
			nopanel		: 'NoPanel',
			panel		: 'Panel',
			selected	: 'Selected',
			spacer		: 'Spacer',
			vertical	: 'Vertical'
		},
		clone				: false,
		openingInterval		: 25,
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 400
	};

	$[ _PLUGIN_ ].prototype = {

		getInstance: function()
		{
			return this;
		},

		initPanels: function( $panels )
		{
			this._initPanels( $panels );
		},

		openPanel: function( $panel, animation )
		{
			this.trigger( 'openPanel:before', $panel );

			if ( !$panel || !$panel.length )
			{
				return;
			}
			if ( !$panel.is( '.' + _c.panel ) )
			{
				$panel = $panel.closest( '.' + _c.panel )
			}
			if ( !$panel.is( '.' + _c.panel ) )
			{
				return;
			}


			var that = this;

			if ( typeof animation != 'boolean' )
			{
				animation = true;
			}


			//	vertical
			if ( $panel.hasClass( _c.vertical ) )
			{

				//	Open current and all vertical parent panels
				$panel
					.add( $panel.parents( '.' + _c.vertical ) )
					.removeClass( _c.hidden )
					.parent( 'li' )
					.addClass( _c.opened );

				//	Open first non-vertical parent panel
				this.openPanel(
					$panel
						.parents( '.' + _c.panel )
						.not( '.' + _c.vertical )
						.first()
				);

				this.trigger( 'openPanel:start' , $panel );
				this.trigger( 'openPanel:finish', $panel );
			}

			//	Horizontal
			else
			{
				if ( $panel.hasClass( _c.opened ) )
				{
					return;
				}

				var $panels 	= this.$pnls.children( '.' + _c.panel ),
					$current 	= $panels.filter( '.' + _c.opened );

				//	old browser support
				if ( !$[ _PLUGIN_ ].support.csstransitions )
				{
					$current
						.addClass( _c.hidden )
						.removeClass( _c.opened );

					$panel
						.removeClass( _c.hidden )
						.addClass( _c.opened );

					this.trigger( 'openPanel:start' , $panel );
					this.trigger( 'openPanel:finish', $panel );
					return;
				}
				//	/old browser support


				//	'Close' all children
				$panels
					.not( $panel )
					.removeClass( _c.subopened );

				//	'Open' all parents
				var $parent = $panel.data( _d.parent );
				while( $parent )
				{
					$parent = $parent.closest( '.' + _c.panel );
					if ( !$parent.is( '.' + _c.vertical ) )
					{
						$parent.addClass( _c.subopened );
					}
					$parent = $parent.data( _d.parent );
				}

				//	Add classes for animation
				$panels
					.removeClass( _c.highest )
					.not( $current )
					.not( $panel )
					.addClass( _c.hidden );

				$panel
					.removeClass( _c.hidden );


				var start = function()
				{
					$current.removeClass( _c.opened );
					$panel.addClass( _c.opened );

					if ( $panel.hasClass( _c.subopened ) )
					{
						$current.addClass( _c.highest );
						$panel.removeClass( _c.subopened );
					}
					else
					{
						$current.addClass( _c.subopened );
						$panel.addClass( _c.highest );
					}

					this.trigger( 'openPanel:start', $panel );
				};

				var finish = function()
				{
					$current.removeClass( _c.highest ).addClass( _c.hidden );
					$panel.removeClass( _c.highest );

					this.trigger( 'openPanel:finish', $panel );
				}

				if ( animation && !$panel.hasClass( _c.noanimation ) )
				{
					//	Without the timeout the animation will not work because the element had display: none;
					setTimeout(
						function()
						{
							//	Callback
							that.__transitionend( $panel,
								function()
								{
									finish.call( that );
								}, that.conf.transitionDuration
							);

							start.call( that );

						}, this.conf.openingInterval
					);
				}
				else
				{
					start.call( this );
					finish.call( this );
				}
			}

			this.trigger( 'openPanel:after', $panel );
		},

		closePanel: function( $panel )
		{
			this.trigger( 'closePanel:before', $panel );

			var $l = $panel.parent();

			//	Vertical only
			if ( $l.hasClass( _c.vertical ) )
			{
				$l.removeClass( _c.opened );

				this.trigger( 'closePanel', $panel );
			}

			this.trigger( 'closePanel:after', $panel );
		},

		closeAllPanels: function()
		{
			this.trigger( 'closeAllPanels:before' );

			//	Vertical
			this.$pnls
				.find( '.' + _c.listview )
				.children()
				.removeClass( _c.selected )
				.filter( '.' + _c.vertical )
				.removeClass( _c.opened );

			//	Horizontal
			var $pnls = this.$pnls.children( '.' + _c.panel ),
				$frst = $pnls.first();

			this.$pnls
				.children( '.' + _c.panel )
				.not( $frst )
				.removeClass( _c.subopened )
				.removeClass( _c.opened )
				.removeClass( _c.highest )
				.addClass( _c.hidden );

			this.openPanel( $frst );

			this.trigger( 'closeAllPanels:after' );
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

		setSelected: function( $li )
		{
			this.trigger( 'setSelected:before', $li );

			this.$menu.find( '.' + _c.listview ).children( '.' + _c.selected ).removeClass( _c.selected );
			$li.addClass( _c.selected );

			this.trigger( 'setSelected:after', $li );
		},

		bind: function( evnt, fn )
		{
			this.cbck[ evnt ] = this.cbck[ evnt ] || [];
			this.cbck[ evnt ].push( fn );
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

		matchMedia: function( mdia, yes, no )
		{
			var that = this,
				func = {
					'yes': yes,
					'no' : no
				};

			//	Bind to windowResize
			this.mtch[ mdia ] = this.mtch[ mdia ] || [];
			this.mtch[ mdia ].push( func );
		},

		_initAddons: function()
		{
			this.trigger( 'initAddons:before' );

			//	Add add-ons to plugin
			var adns;
			for ( adns in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ adns ].add.call( this );
				$[ _PLUGIN_ ].addons[ adns ].add = function() {};
			}

			//	Setup add-ons for menu
			for ( adns in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ adns ].setup.call( this );
			}

			this.trigger( 'initAddons:after' );
		},

		_initExtensions: function()
		{
			this.trigger( 'initExtensions:before' );

			var that = this;

			//	Convert array to object with array
			if ( this.opts.extensions.constructor === Array )
			{
				this.opts.extensions = {
					'all': this.opts.extensions
				};
			}

			//	Loop over object
			for ( var mdia in this.opts.extensions )
			{
				this.opts.extensions[ mdia ] = this.opts.extensions[ mdia ].length ? 'mm-' + this.opts.extensions[ mdia ].join( ' mm-' ) : '';
				if ( this.opts.extensions[ mdia ] )
				{
					(function( mdia ) {
						that.matchMedia( mdia,
							function()
							{
								this.$menu.addClass( this.opts.extensions[ mdia ] );
							},
							function()
							{
								this.$menu.removeClass( this.opts.extensions[ mdia ] );
							}
						);
					})( mdia );
				}
			}
			this.trigger( 'initExtensions:after' );
		},

		_initMenu: function()
		{
			this.trigger( 'initMenu:before' );

			var that = this;

			//	Clone if needed
			if ( this.conf.clone )
			{
				this.$orig = this.$menu;
				this.$menu = this.$orig.clone();
				this.$menu.add( this.$menu.find( '[id]' ) )
					.filter( '[id]' )
					.each(
						function()
						{
							$(this).attr( 'id', _c.mm( $(this).attr( 'id' ) ) );
						}
					);
			}

			//	Via options
			this.opts.initMenu.call( this, this.$menu, this.$orig );

			//	Add ID
			this.$menu.attr( 'id', this.$menu.attr( 'id' ) || this.__getUniqueId() );

			//	Add markup
			this.$pnls = $( '<div class="' + _c.panels + '" />' )
				.append( this.$menu.children( this.conf.panelNodetype ) )
				.prependTo( this.$menu );

			//	Add classes
			var clsn = [ _c.menu ];

			if ( !this.opts.slidingSubmenus )
			{
				clsn.push( _c.vertical );
			}

			this.$menu
				.addClass( clsn.join( ' ' ) )
				.parent()
				.addClass( _c.wrapper );

			this.trigger( 'initMenu:after' );
		},

		_initPanels: function( $panels )
		{
			this.trigger( 'initPanels:before', $panels );

			$panels = $panels || this.$pnls.children( this.conf.panelNodetype );

			var $newpanels = $();

			var that = this;
			var init = function( $panels )
			{
				$panels
					.filter( this.conf.panelNodetype )
					.each(
						function()
						{
							$panel = that._initPanel( $(this) );
							if ( $panel )
							{
								that._initNavbar( $panel );
								that._initListview( $panel );

								$newpanels = $newpanels.add( $panel );

								//	init child panels
								var $child = $panel
									.children( '.' + _c.listview )
									.children( 'li' )
									.children( that.conf.panelNodeType )
									.add( $panel.children( '.' + that.conf.classNames.panel ) );

								if ( $child.length )
								{
									init.call( that, $child );
								}
							}
						}
					);
			};

			init.call( this, $panels );

			//	Init via options
			this.opts.initPanels.call( this, $newpanels );

			this.trigger( 'initPanels:after', $newpanels );
		},

		_initPanel: function( $panel )
		{
			this.trigger( 'initPanel:before', $panel );

			var that  = this;

			//	Refactor panel classnames
			this.__refactorClass( $panel, this.conf.classNames.panel 	, 'panel' );
			this.__refactorClass( $panel, this.conf.classNames.nopanel 	, 'nopanel' );
			this.__refactorClass( $panel, this.conf.classNames.vertical , 'vertical' );
			this.__refactorClass( $panel, this.conf.classNames.inset 	, 'inset' );

			$panel.filter( '.' + _c.inset )
				.addClass( _c.nopanel );


			//	Stop if not supposed to be a panel
			if ( $panel.hasClass( _c.nopanel ) )
			{
				return false;
			}

			//	Stop if already a panel
			if ( $panel.hasClass( _c.panel ) )
			{
				return $panel;
			}


			//	Wrap UL/OL in DIV
			var vertical = ( $panel.hasClass( _c.vertical ) || !this.opts.slidingSubmenus );

			$panel.removeClass( _c.vertical );

			var id = $panel.attr( 'id' ) || this.__getUniqueId();
			$panel.removeAttr( 'id' );

			if ( $panel.is( 'ul, ol' ) )
			{
				$panel.wrap( '<div />' );
				$panel = $panel.parent();
			}

			$panel
				.addClass( _c.panel + ' ' + _c.hidden )
				.attr( 'id', id );

			var $parent = $panel.parent( 'li' );

			if ( vertical )
			{
				$panel
					.add( $parent )
					.addClass( _c.vertical );
			}
			else
			{
				$panel.appendTo( this.$pnls );
			}

			//	Store parent/child relation
			if ( $parent.length )
			{
				$parent.data( _d.child, $panel );
				$panel.data( _d.parent, $parent );
			}

			this.trigger( 'initPanel:after', $panel );

			return $panel;
		},

		_initNavbar: function( $panel )
		{
			this.trigger( 'initNavbar:before', $panel );

			if ( $panel.children( '.' + _c.navbar ).length )
			{
				return;
			}

			var $parent = $panel.data( _d.parent ),
				$navbar = $( '<div class="' + _c.navbar + '" />' );

			var title = $[ _PLUGIN_ ].i18n( this.opts.navbar.title ),
				href  = false;

			if ( $parent && $parent.length )
			{
				if ( $parent.hasClass( _c.vertical ) )
				{
					return;
				}

				//	Listview, the panel wrapping this panel
				if ( $parent.parent().is( '.' + _c.listview ) )
				{
					var $a = $parent
						.children( 'a, span' )
						.not( '.' + _c.next );
				}

				//	Non-listview, the first anchor in the parent panel that links to this panel
				else
				{
					var $a = $parent
						.closest( '.' + _c.panel )
						.find( 'a[href="#' + $panel.attr( 'id' ) + '"]' );
				}

				$a = $a.first();
				$parent = $a.closest( '.' + _c.panel );

				var id = $parent.attr( 'id' );
				title  = $a.text();

				switch ( this.opts.navbar.titleLink )
				{
					case 'anchor':
						href = $a.attr( 'href' );
						break;

					case 'parent':
						href = '#' + id;
						break;
				}

				$navbar.append( '<a class="' + _c.btn + ' ' + _c.prev + '" href="#' + id + '" />' );
			}
			else if ( !this.opts.navbar.title )
			{
				return;
			}

			if ( this.opts.navbar.add )
			{
				$panel.addClass( _c.hasnavbar );
			}

			$navbar.append( '<a class="' + _c.title + '"' + ( href ? ' href="' + href + '"' : '' ) + '>' + title + '</a>' )
				.prependTo( $panel );

			this.trigger( 'initNavbar:after', $panel );
		},

		_initListview: function( $panel )
		{
			this.trigger( 'initListview:before', $panel );

			//	Refactor listviews classnames
			var $ul = this.__childAddBack( $panel, 'ul, ol' );

			this.__refactorClass( $ul, this.conf.classNames.nolistview 	, 'nolistview' );

			$ul.filter( '.' + this.conf.classNames.inset )
				.addClass( _c.nolistview );


			//	Refactor listitems classnames
			var $li = $ul
				.not( '.' + _c.nolistview )
				.addClass( _c.listview )
				.children();

			this.__refactorClass( $li, this.conf.classNames.selected 	, 'selected' );
			this.__refactorClass( $li, this.conf.classNames.divider 	, 'divider' );
			this.__refactorClass( $li, this.conf.classNames.spacer 		, 'spacer' );


			//	Add open link to parent listitem
			var $parent = $panel.data( _d.parent );
			if ( $parent && $parent.parent().is( '.' + _c.listview ) )
			{
				if ( !$parent.children( '.' + _c.next ).length )
				{
					var $a = $parent.children( 'a, span' ).first(),
						$b = $( '<a class="' + _c.next + '" href="#' + $panel.attr( 'id' ) + '" />' ).insertBefore( $a );

					if ( $a.is( 'span' ) )
					{
						$b.addClass( _c.fullsubopen );
					}
				}
			}

			this.trigger( 'initListview:after', $panel );
		},

		_initOpened: function()
		{
			this.trigger( 'initOpened:before' );

			var $selected = this.$pnls
				.find( '.' + _c.listview )
				.children( '.' + _c.selected )
				.removeClass( _c.selected )
				.last()
				.addClass( _c.selected );

			var $current = ( $selected.length ) 
				? $selected.closest( '.' + _c.panel )
				: this.$pnls.children( '.' + _c.panel ).first();

			this.openPanel( $current, false );

			this.trigger( 'initOpened:after' );
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
							if ( $[ _PLUGIN_ ].addons[ a ].clickAnchor.call( that, $t, inMenu ) )
							{
								fired = true;
								break;
							}
						}

						var _h = $t.attr( 'href' );

						//	Open/Close panel
						if ( !fired && inMenu )
						{
							if ( _h.length > 1 && _h.slice( 0, 1 ) == '#' )
							{
								try
								{
									var $h = $(_h, that.$menu);
									if ( $h.is( '.' + _c.panel ) )
									{
										fired = true;
										that[ $t.parent().hasClass( _c.vertical ) ? 'togglePanel' : 'openPanel' ]( $h );
									}
								}
								catch( err ) {}
							}
						}

						if ( fired )
						{
							e.preventDefault();
						}


						//	All other anchors in lists
						if ( !fired && inMenu )
						{
							if ( $t.is( '.' + _c.listview + ' > li > a' ) && !$t.is( '[rel="external"]' ) && !$t.is( '[target="_blank"]' ) )
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

		_initMatchMedia: function()
		{
			var that = this;

			this._fireMatchMedia();

			glbl.$wndw
				.on(  _e.resize,
					function( e )
					{
						that._fireMatchMedia();
					}
				);
		},

		_fireMatchMedia: function()
		{
			for ( var mdia in this.mtch )
			{
				var fn = window.matchMedia && window.matchMedia( mdia ).matches ? 'yes' : 'no';

				for ( var m = 0; m < this.mtch[ mdia ].length; m++ )
				{
					this.mtch[ mdia ][ m ][ fn ].call( this );
				}
			}
		},

		_getOriginalMenuId: function()
		{
			var id = this.$menu.attr( 'id' );
			if ( this.conf.clone && id && id.length )
			{
				id = _c.umm( id );
			}
			return id;
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
					};
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
		__childAddBack: function( $e, s )
		{
			return $e.children( s ).add( $e.filter( s ) );
		},

		__filterListItems: function( $li )
		{
			return $li
				.not( '.' + _c.divider )
				.not( '.' + _c.hidden );
		},
		__filterListItemAnchors: function( $li )
		{
			return this.__filterListItems( $li )
				.children( 'a' )
				.not( '.' + _c.next );
		},

		__transitionend: function( $e, fn, duration )
		{
			var _ended = false,
				_fn = function( e )
				{
					if ( typeof e !== 'undefined' )
					{
						if ( e.target != $e[ 0 ] )
						{
							return;
						}
					}

					if ( !_ended )
					{
						$e.unbind( _e.transitionend );
						$e.unbind( _e.webkitTransitionEnd );
						fn.call( $e[ 0 ] );
					}
					_ended = true;
				};
	
			$e.on( _e.transitionend, _fn );
			$e.on( _e.webkitTransitionEnd, _fn );
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

		var $result = $();
		this.each(
			function()
			{
				var $menu = $(this);
				if ( $menu.data( _PLUGIN_ ) )
				{
					return;
				}

				var _menu = new $[ _PLUGIN_ ]( $menu, opts, conf );
				_menu.$menu.data( _PLUGIN_, _menu.__api() );

				$result = $result.add( _menu.$menu );
			}
		);

		return $result;
	};


	/*
		I18N
	*/
	$[ _PLUGIN_ ].i18n = (function() {

		var trns = {};

		return function( t )
		{
			switch( typeof t )
			{
				case 'object':
					$.extend( trns, t );
					return trns;
					break;

				case 'string':
					return trns[ t ] || t;
					break;

				case 'undefined':
				default:
					return trns;
					break;
			}
		};
	})();


	/*
		SUPPORT
	*/
	$[ _PLUGIN_ ].support = {

		touch: 'ontouchstart' in window || navigator.msMaxTouchPoints || false,

		csstransitions: (function()
		{
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransitions !== 'undefined'
			) {
				return Modernizr.csstransitions;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})(),

		csstransforms: (function() {
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransforms !== 'undefined'
			) {
				return Modernizr.csstransforms;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})(),

		csstransforms3d: (function() {
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransforms3d !== 'undefined'
			) {
				return Modernizr.csstransforms3d;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})()
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
			$docu : $(document),
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
		_c.add( 'wrapper menu panels panel nopanel highest opened subopened navbar hasnavbar title btn prev next listview nolistview inset vertical selected divider spacer hidden fullsubopen noanimation' );
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
		_d.add( 'parent child' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'transitionend webkitTransitionEnd click scroll resize keydown mousedown mouseup touchstart touchmove touchend orientationchange' );


		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;
	}


})( jQuery );
