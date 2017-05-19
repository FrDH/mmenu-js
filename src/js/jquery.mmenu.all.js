/*	
 * jQuery mmenu v4.7.5
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
		_VERSION_	= '4.7.5';


	//	Plugin already excists
	if ( $[ _PLUGIN_ ] )
	{
		return;
	}


	//	Global variables
	var _c = {}, _d = {}, _e = {},
		plugin_initiated = false;

	var glbl = {
		$wndw: null,
		$html: null,
		$body: null
	};


	/*
		Class
	*/
	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		this.$menu	= $menu;
		this.opts	= opts;
		this.conf	= conf;
		this.vars	= {};

		if ( typeof this.___deprecated == 'function' )
		{
			this.___deprecated();
		}

		this._initMenu();
		this._initAnchors();
		this._initEvents();

		var $panels = this.$menu.children( this.conf.panelNodetype );

		for ( var a in $[ _PLUGIN_ ].addons )
		{
			//	Add add-ons to plugin
			$[ _PLUGIN_ ].addons[ a ]._add.call( this );
			$[ _PLUGIN_ ].addons[ a ]._add = function() {};

			//	Setup adds-on for menu
			$[ _PLUGIN_ ].addons[ a ]._setup.call( this );
		}

		this._init( $panels );

		if ( typeof this.___debug == 'function' )
		{
			this.___debug();
		}

		return this;
	};

	$[ _PLUGIN_ ].version = _VERSION_;

	$[ _PLUGIN_ ].addons = {};

	$[ _PLUGIN_ ].uniqueId = 0;
	
	$[ _PLUGIN_ ].defaults = {
		classes			: '',
		slidingSubmenus	: true,
		onClick			: {
//			close				: true,
//			blockUI				: null,
//			preventDefault		: null,
			setSelected			: true
		}
	};

	$[ _PLUGIN_ ].configuration = {
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 400,
		openingInterval		: 25,
		classNames	: {
			panel		: 'Panel',
			selected	: 'Selected',
			label		: 'Label',
			spacer		: 'Spacer'
		}
	};
	$[ _PLUGIN_ ].prototype = {

		_init: function( $panels )
		{
			$panels = $panels.not( '.' + _c.nopanel );
			$panels = this._initPanels( $panels );

			for ( var a in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ a ]._init.call( this, $panels );
			}
			this._update();
		},

		_initMenu: function()
		{
			var that = this;

			//	Clone if needed
			if ( this.opts.offCanvas && this.conf.clone )
			{
				this.$menu = this.$menu.clone( true );
				this.$menu.add( this.$menu.find( '*' ) ).filter( '[id]' ).each(
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
			clsn.push( _c.mm( this.opts.slidingSubmenus ? 'horizontal' : 'vertical' ) );

			//	Add options classes
			if ( this.opts.classes )
			{
				clsn.push( this.opts.classes );
			}

			this.$menu.addClass( clsn.join( ' ' ) );
		},

		_initPanels: function( $panels )
		{
			var that = this;

			//	Add List class
			this.__findAddBack( $panels, 'ul, ol' )
				.not( '.' + _c.nolist )
				.addClass( _c.list );

			var $lis = this.__findAddBack( $panels, '.' + _c.list ).find( '> li' );

			//	Refactor Selected class
			this.__refactorClass( $lis, this.conf.classNames.selected, 'selected' );

			//	Refactor Label class
			this.__refactorClass( $lis, this.conf.classNames.label, 'label' );

			//	Refactor Spacer class
			this.__refactorClass( $lis, this.conf.classNames.spacer, 'spacer' );

			//	setSelected-event
			$lis
				.off( _e.setSelected )
				.on( _e.setSelected,
					function( e, selected )
					{
						e.stopPropagation();

						$lis.removeClass( _c.selected );
						if ( typeof selected != 'boolean' )
						{
							selected = true;
						}
						if ( selected )
						{
							$(this).addClass( _c.selected );
						}
					}
				);

			//	Refactor Panel class
			this.__refactorClass( this.__findAddBack( $panels, '.' + this.conf.classNames.panel ), this.conf.classNames.panel, 'panel' );

			//	Add Panel class			
			$panels
				.add( this.__findAddBack( $panels, '.' + _c.list ).children().children().filter( this.conf.panelNodetype ).not( '.' + _c.nopanel ) )
				.addClass( _c.panel );

			var $curpanels = this.__findAddBack( $panels, '.' + _c.panel ),
				$allpanels = $('.' + _c.panel, this.$menu);

			//	Add an ID to all panels
			$curpanels
				.each(
					function( i )
					{
						var $t = $(this),
							id = $t.attr( 'id' ) || that.__getUniqueId();

						$t.attr( 'id', id );
					}
			);

			//	Add open and close links to menu items
			$curpanels
				.each(
					function( i )
					{
						var $t = $(this),
							$u = $t.is( 'ul, ol' ) ? $t : $t.find( 'ul ,ol' ).first(),
							$l = $t.parent(),
							$a = $l.children( 'a, span' ),
							$p = $l.closest( '.' + _c.panel );

						if ( $l.parent().is( '.' + _c.list ) && !$t.data( _d.parent) )
						{
							$t.data( _d.parent, $l );

							var $btn = $( '<a class="' + _c.subopen + '" href="#' + $t.attr( 'id' ) + '" />' ).insertBefore( $a );
							if ( !$a.is( 'a' ) )
							{
								$btn.addClass( _c.fullsubopen );
							}
							if ( that.opts.slidingSubmenus )
							{
								$u.prepend( '<li class="' + _c.subtitle + '"><a class="' + _c.subclose + '" href="#' + $p.attr( 'id' ) + '">' + $a.text() + '</a></li>' );
							}
						}
					}
				);

			if ( this.opts.slidingSubmenus )
			{
				//	Add opened-classes
				var $selected = this.__findAddBack( $panels, '.' + _c.list ).find( '> li.' + _c.selected );
				$selected
					.parents( 'li' )
					.removeClass( _c.selected )
					.end()
					.add( $selected.parents( 'li' ) )
					.each(
						function()
						{
							var $t = $(this),
								$u = $t.find( '> .' + _c.panel );

							if ( $u.length )
							{
								$t.parents( '.' + _c.panel ).addClass( _c.subopened );
								$u.addClass( _c.opened );
							}
						}
					)
					.closest( '.' + _c.panel )
					.addClass( _c.opened )
					.parents( '.' + _c.panel )
					.addClass( _c.subopened );
			}
			else
			{
				//	Replace Selected-class with opened-class in parents from .Selected
				var $selected = $('li.' + _c.selected, $allpanels);
				$selected
					.parents( 'li' )
					.removeClass( _c.selected )
					.end()
					.add( $selected.parents( 'li' ) )
					.addClass( _c.opened );
			}

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
			if ( this.opts.slidingSubmenus )
			{
				$curpanels
					.not( $current.last() )
					.addClass( _c.hidden )
					.end()
					.appendTo( this.$menu );
			}
			
			return $curpanels;
		},

		_initAnchors: function()
		{
			var that = this;

			glbl.$body
				.on( _e.click,
					'a',
					function( e )
					{
						var $t = $(this),
							fired 	= false,
							inMenu 	= that.$menu.find( $t ).length;


						//	Find behavior for addons
						for ( var a in $[ _PLUGIN_ ].addons )
						{
							if ( $[ _PLUGIN_ ].addons[ a ]._clickAnchor &&
								( fired = $[ _PLUGIN_ ].addons[ a ]._clickAnchor.call( that, $t, inMenu ) )
							) {
								break;
							}
						}

						//	Open/Close panel
						if ( !fired && inMenu )
						{
							var _h = $t.attr( 'href' ) || '';
							if ( _h.slice( 0, 1 ) == '#' )
							{
								try
								{
									if ( $(_h, that.$menu).is( '.' + _c.panel ) )
									{
										fired = true;
										$(_h).trigger( that.opts.slidingSubmenus ? _e.open : _e.toggle );
									}
							    }
								catch( error ) {}
							}
						}

						if ( fired )
						{
							e.preventDefault();
						}


						//	All other anchors in lists
						if ( !fired && inMenu )
						{
							if ( $t.is( '.' + _c.list + ' > li > a' )
								&& !$t.is( '[rel="external"]' ) 
								&& !$t.is( '[target="_blank"]' ) )
							{

								//	Set selected item
								if ( that.__valueOrFn( that.opts.onClick.setSelected, $t ) )
								{
									$t.parent().trigger( _e.setSelected );
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
									that.$menu.trigger( _e.close );
								}
							}
						}
					}
				);
		},

		_initEvents: function()
		{
			var that = this;

			this.$menu
				.on( _e.toggle + ' ' + _e.open + ' ' + _e.close,
					'.' + _c.panel,
					function( e )
					{
						e.stopPropagation();
					}
				);

			if ( this.opts.slidingSubmenus )
			{
				this.$menu
					.on( _e.open,
						'.' + _c.panel,
						function( e )
						{
							return that._openSubmenuHorizontal( $(this) );
						}
					);
			}
			else
			{
				this.$menu
					.on( _e.toggle,
						'.' + _c.panel,
						function( e )
						{
							var $t = $(this);
							$t.trigger( $t.parent().hasClass( _c.opened ) ? _e.close : _e.open );
						}
					)
					.on( _e.open,
						'.' + _c.panel,
						function( e )
						{
							$(this).parent().addClass( _c.opened );
						}
					)
					.on( _e.close,
						'.' + _c.panel,
						function( e )
						{
							$(this).parent().removeClass( _c.opened );
						}
					);
			}
		},

		_openSubmenuHorizontal: function( $opening )
		{
			if ( $opening.hasClass( _c.current ) )
			{
				return false;
			}

			var $panels = $('.' + _c.panel, this.$menu),
				$current = $panels.filter( '.' + _c.current );
	
			$panels
				.removeClass( _c.highest )
				.removeClass( _c.current )
				.not( $opening )
				.not( $current )
				.addClass( _c.hidden );
	
			if ( $opening.hasClass( _c.opened ) )
			{
				$current
					.addClass( _c.highest )
					.removeClass( _c.opened )
					.removeClass( _c.subopened );
			}
			else
			{
				$opening
					.addClass( _c.highest );

				$current
					.addClass( _c.subopened );
			}
	
			$opening
				.removeClass( _c.hidden )
				.addClass( _c.current );
	
			//	Without the timeout, the animation won't work because the element had display: none;
			setTimeout(
				function()
				{
					$opening
						.removeClass( _c.subopened )
						.addClass( _c.opened );
				}, this.conf.openingInterval
			);

			return 'open';
		},

		_update: function( fn )
		{
			if ( !this.updates )
			{
				this.updates = [];
			}
			if ( typeof fn == 'function' )
			{
				this.updates.push( fn );
			}
			else
			{
				for ( var u = 0, l = this.updates.length; u < l; u++ )
				{
					this.updates[ u ].call( this, fn );
				}
			}
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
		if ( !plugin_initiated )
		{
			_initPlugin();
		}

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
				$menu.data( _PLUGIN_, new $[ _PLUGIN_ ]( $menu, opts, conf ) );
			}
		);
	};


	/*
		SUPPORT
	*/
	$[ _PLUGIN_ ].support = {
		touch: 'ontouchstart' in window || navigator.msMaxTouchPoints
	};



	function _initPlugin()
	{
		plugin_initiated = true;
	
		glbl.$wndw = $(window);
		glbl.$html = $('html');
		glbl.$body = $('body');

		//	Classnames, Datanames, Eventnames
		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( c )
				{
					c = c.split( ' ' );
					for ( var d in c )
					{
						o[ c[ d ] ] = o.mm( c[ d ] );
					}
				};
			}
		);

		//	Classnames
		_c.mm = function( c ) { return 'mm-' + c; };
		_c.add( 'wrapper menu inline panel nopanel list nolist subtitle selected label spacer current highest hidden opened subopened subopen fullsubopen subclose' );
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
		_d.add( 'parent' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'toggle open close setSelected transitionend webkitTransitionEnd mousedown mouseup touchstart touchmove touchend scroll resize click keydown keyup' );

		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;
	}


})( jQuery );



/*	
 * jQuery mmenu buttonbars addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'buttonbars';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Refactor buttonbar class
			this.__refactorClass( $('div', $panels), this.conf.classNames[ _ADDON_ ].buttonbar, 'buttonbar' );


			//	Add markup
			$('.' + _c.buttonbar, $panels)
				.each(
					function()
					{
						var $bbar = $(this),
							$btns = $bbar.children().not( 'input' ),
							$inpt = $bbar.children().filter( 'input' );

						$bbar.addClass( _c.buttonbar + '-' + $btns.length );
						
						$inpt
							.each(
								function()
								{
									var $inp = $(this),
										$lbl = $btns.filter( 'label[for="' + $inp.attr( 'id' ) + '"]' );
	
									if ( $lbl.length )
									{
										$inp.insertBefore( $lbl );
									}
								}
							);
					}
				);
		},

		//	_setup: fired once per menu
		_setup: function() {},

		//	_add: fired once per page load
		_add: function()
		{			
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'buttonbar' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		buttonbar: 'Buttonbar'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu counters addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'counters';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{			
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Refactor counter class
			this.__refactorClass( $('em', $panels), this.conf.classNames[ _ADDON_ ].counter, 'counter' );


			//	Add the counters
			if ( opts.add )
			{
				$panels
					.each(
						function()
						{
							var $prnt = $(this).data( _d.parent );
							if ( $prnt )
							{
								if ( !$prnt.find( '> em.' + _c.counter ).length )
								{
									$prnt.prepend( $( '<em class="' + _c.counter + '" />' ) );
								}
							}
						}
				);
			}


			//	Update the counter
			if ( opts.update )
			{
				$panels
					.each(
						function()
						{
							var $panl = $(this),
								$prnt = $panl.data( _d.parent );
	
							if ( $prnt )
							{
								var $cntr = $prnt.find( '> em.' + _c.counter );
								if ( $cntr.length )
								{
									if ( !$panl.is( '.' + _c.list ) )
									{
										$panl = $panl.find( '> .' + _c.list );
									}
									if ( $panl.length && !$panl.data( _d.updatecounter ) )
									{
										$panl.data( _d.updatecounter, true );
										that._update(
											function()
											{
												var $lis = $panl.children()
													.not( '.' + _c.label )
													.not( '.' + _c.subtitle )
													.not( '.' + _c.hidden )
													.not( '.' + _c.search )
													.not( '.' + _c.noresultsmsg );
		
												$cntr.html( $lis.length );
											}
										);
									}
								}
							}
						}
					);
			}
		},

		//	_setup: fired once per menu
		_setup: function()
		{
			var opts = this.opts[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add		: opts,
					update	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			this.opts[ _ADDON_ ] = opts;
		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'counter search noresultsmsg' );
			_d.add( 'updatecounter' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		update	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		counter: 'Counter'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu dragOpen addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'dragOpen';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels ) {},

		//	_setup: fired once per menu
		_setup: function()
		{
			if ( !this.opts.offCanvas )
			{
				return;
			}

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					open: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			

			//	Drag open			
			if ( opts.open )
			{
				if ( Hammer.VERSION < 2 )
				{
					return;
				}

				//	Set up variables
				var drag			= {},
					_stage 			= 0,
					_direction 		= false,
					_dimension		= false,
					_distance 		= 0,
					_maxDistance 	= 0;
	
				var new_distance, drag_distance, css_value, pointer_pos;
	
				switch( this.opts.offCanvas.position )
				{
					case 'left':
					case 'right':
						drag.events		= 'panleft panright';
						drag.typeLower	= 'x';
						drag.typeUpper	= 'X';
						
						_dimension		= 'width';
						break;
	
					case 'top':
					case 'bottom':
						drag.events		= 'panup pandown';
						drag.typeLower	= 'y';
						drag.typeUpper	= 'Y';
	
						_dimension = 'height';
						break;
				}
				
				switch( this.opts.offCanvas.position )
				{
					case 'left':
					case 'top':
						drag.negative 	= false;
						break;
					
					case 'right':
					case 'bottom':
						drag.negative 	= true;
						break;
				}

				switch( this.opts.offCanvas.position )
				{
					case 'left':
						drag.open_dir 	= 'right';
						drag.close_dir 	= 'left';
						break;
	
					case 'right':
						drag.open_dir 	= 'left';
						drag.close_dir 	= 'right';
						break;
	
					case 'top':
						drag.open_dir 	= 'down';
						drag.close_dir 	= 'up';
						break;
	
					case 'bottom':
						drag.open_dir 	= 'up';
						drag.close_dir 	= 'down';
						break;
				}
	
				var $dragNode = this.__valueOrFn( opts.pageNode, this.$menu, glbl.$page );

				if ( typeof $dragNode == 'string' )
				{
					$dragNode = $($dragNode);
				}

				var $dragg = glbl.$page;

				switch ( this.opts.offCanvas.zposition )
				{
					case 'front':
						$dragg = this.$menu;
						break;
	
					case 'next':
						$dragg = $dragg.add( this.$menu );
						break;
				};
	
	
				//	Bind events
				var _hammer = new Hammer( $dragNode[ 0 ], opts.vendors.hammer );

				_hammer
					.on( 'panstart',
						function( e )
						{
							pointer_pos = e.center[ drag.typeLower ];
							switch( that.opts.offCanvas.position )
							{
								case 'right':
								case 'bottom':
									if ( pointer_pos >= glbl.$wndw[ _dimension ]() - opts.maxStartPos )
									{
										_stage = 1;
									}
									break;
	
								default:
									if ( pointer_pos <= opts.maxStartPos )
									{
										_stage = 1;
									}
									break;
							}
							_direction = drag.open_dir;
						}
					)
					.on( drag.events + ' panend',
						function( e )
						{
							if ( _stage > 0 )
							{
								e.preventDefault();
							}
						}
					)
					.on( drag.events,
						function( e )
						{
	
							new_distance = e[ 'delta' + drag.typeUpper ];
							if ( drag.negative )
							{
								new_distance = -new_distance;
							}
	
							if ( new_distance != _distance )
							{
								_direction = ( new_distance >= _distance )
									? drag.open_dir
									: drag.close_dir;
							}
	
							_distance = new_distance;
	
							if ( _distance > opts.threshold )
							{
								if ( _stage == 1 )
								{
									if ( glbl.$html.hasClass( _c.opened ) )
									{
										return;
									}
									_stage = 2;
	
									that._openSetup();
									that.$menu.trigger( _e.opening );
									glbl.$html.addClass( _c.dragging );
	
									_maxDistance = minMax( 
										glbl.$wndw[ _dimension ]() * conf[ _dimension ].perc, 
										conf[ _dimension ].min, 
										conf[ _dimension ].max
									);
								}
							}
							if ( _stage == 2 )
							{
								drag_distance = minMax( _distance, 10, _maxDistance ) - ( that.opts.offCanvas.zposition == 'front' ? _maxDistance : 0 );
								if ( drag.negative )
								{
									drag_distance = -drag_distance;
								}
								css_value = 'translate' + drag.typeUpper + '(' + drag_distance + 'px )';
	
								$dragg.css({
									'-webkit-transform': '-webkit-' + css_value,	
									'transform': css_value
								});
							}
						}
					)
					.on( 'panend',
						function( e )
						{
							if ( _stage == 2 )
							{
								glbl.$html.removeClass( _c.dragging );
								$dragg.css( 'transform', '' );
								that[ _direction == drag.open_dir ? '_openFinish' : 'close' ]();
							}
				        	_stage = 0;
					    }
					);
			}
		},

		//	_add: fired once per page load
		_add: function()
		{
			if ( typeof Hammer != 'function' )
			{
				$[ _PLUGIN_ ].addons[ _ADDON_ ]._init = function() {};
				$[ _PLUGIN_ ].addons[ _ADDON_ ]._setup = function() {};

				return;
			}

			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'dragging' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		open		: false,
//		pageNode	: null,
		maxStartPos	: 100,
		threshold	: 50,
		vendors		: {
			hammer		: {}
		}
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		width	: {
			perc	: 0.8,
			min		: 140,
			max		: 440
		},
		height	: {
			perc	: 0.8,
			min		: 140,
			max		: 880
		}
	};


	var _c, _d, _e, glbl;


	function minMax( val, min, max )
	{
		if ( val < min )
		{
			val = min;
		}
		if ( val > max )
		{
			val = max;
		}
		return val;
	}

})( jQuery );



/*	
 * jQuery mmenu fixedElements addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'fixedElements';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			if ( !this.opts.offCanvas )
			{
				return;
			}


			//	Refactor fixed classes
			var _tops = this.conf.classNames[ _ADDON_ ].fixedTop,
				_bots = this.conf.classNames[ _ADDON_ ].fixedBottom,
				$tops = this.__refactorClass( glbl.$page.find( '.' + _tops ), _tops, 'fixed-top' ),
				$bots = this.__refactorClass( glbl.$page.find( '.' + _bots ), _bots, 'fixed-bottom' );

			$tops.add( $bots )
				.appendTo( glbl.$body )
				.addClass( _c.slideout );
		},

		//	_setup: fired once per menu
		_setup: function() {},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'fixed-top fixed-bottom' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		fixedTop 	: 'FixedTop',
		fixedBottom	: 'FixedBottom'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu footer addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'footer';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			var that = this,
				opts = this.opts[ _ADDON_ ];


			//	Update content
			var $footer = $('div.' + _c.footer, this.$menu);
			if ( $footer.length )
			{
				//	Auto-update the footer content
				if ( opts.update )
				{
					$panels
						.each(
							function()
							{
								var $panl = $(this);
	
								//	Find content
								var $cnt = $('.' + that.conf.classNames[ _ADDON_ ].panelFooter, $panl),
									_cnt = $cnt.html();
	
								if ( !_cnt )
								{
									_cnt = opts.title;
								}
	
								//	Update footer info
								var updateFooter = function()
								{
									$footer[ _cnt ? 'show' : 'hide' ]();
									$footer.html( _cnt );
								};
	
								$panl.on( _e.open, updateFooter );
	
								if ( $panl.hasClass( _c.current ) )
								{
									updateFooter();
								}
							}
						);
				}

				//	Init other add-ons
				if ( $[ _PLUGIN_ ].addons.buttonbars )
				{
					$[ _PLUGIN_ ].addons.buttonbars._init.call( this, $footer );
				}
			}
		},

		//	_setup: fired once per menu
		_setup: function()
		{
			var opts = this.opts[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add		: opts,
					update	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			this.opts[ _ADDON_ ] = opts;
			

			//	Add markup
			if ( opts.add )
			{
				var content = opts.content
					? opts.content
					: opts.title;
	
				$( '<div class="' + _c.footer + '" />' )
					.appendTo( this.$menu )
					.append( content );

				this.$menu.addClass( _c.hasfooter );
			}
		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'footer hasfooter' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		content	: false,
		title	: '',
		update	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		panelFooter: 'Footer'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu header addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'header';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Update content
			var $header = $('.' + _c.header, this.$menu);
			if ( $header.length )
			{
				//	Auto-update the title, prev- and next button
				if ( opts.update )
				{
					var $titl = $header.find( '.' + _c.title ),
						$prev = $header.find( '.' + _c.prev ),
						$next = $header.find( '.' + _c.next ),
						$clse = $header.find( '.' + _c.close ),
						_page = false;

					if ( glbl.$page )
					{
						_page = '#' + glbl.$page.attr( 'id' );
						$clse.attr( 'href', _page );
					}

					$panels
						.each(
							function()
							{
								var $panl = $(this);
	
								//	Find title, prev and next
								var $ttl = $panl.find('.' + that.conf.classNames[ _ADDON_ ].panelHeader),
									$prv = $panl.find('.' + that.conf.classNames[ _ADDON_ ].panelPrev),
									$nxt = $panl.find('.' + that.conf.classNames[ _ADDON_ ].panelNext);
	
								var _ttl = $ttl.html(),
									_prv = $prv.attr( 'href' ),
									_nxt = $nxt.attr( 'href' );
									
								var _prv_txt = $prv.html(),
									_nxt_txt = $nxt.html();

								if ( !_ttl )
								{
									_ttl = $panl.find('.' + _c.subclose).html();
								}
								if ( !_ttl )
								{
									_ttl = opts.title;
								}
								if ( !_prv )
								{
									_prv = $panl.find('.' + _c.subclose).attr( 'href' );
								}
	
								//	Update header info
								var updateHeader = function()
								{
									$titl[ _ttl ? 'show' : 'hide' ]();
									$titl.html( _ttl );
	
									$prev[ _prv ? 'attr' : 'removeAttr' ]( 'href', _prv );
									$prev[ _prv || _prv_txt ? 'show' : 'hide' ]();
									$prev.html( _prv_txt );
	
									$next[ _nxt ? 'attr' : 'removeAttr' ]( 'href', _nxt );
									$next[ _nxt || _nxt_txt ? 'show' : 'hide' ]();
									$next.html( _nxt_txt );
								};
	
								$panl.on( _e.open, updateHeader );
	
								if ( $panl.hasClass( _c.current ) )
								{
									updateHeader();
								}
							}
						);
				}

				//	Init other add-ons
				if ( $[ _PLUGIN_ ].addons.buttonbars )
				{
					$[ _PLUGIN_ ].addons.buttonbars._init.call( this, $header );
				}
			}
		},

		//	_setup: fired once per menu
		_setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add		: opts,
					update	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			if ( typeof opts.content == 'undefined' )
			{
				opts.content = [ 'prev', 'title', 'next' ];
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			this.opts[ _ADDON_ ] = opts;


			//	Add markup
			if ( opts.add )
			{
				if ( opts.content instanceof Array )
				{
					var $content = $( '<div />' );
					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						switch ( opts.content[ c ] )
						{
							case 'prev':
							case 'next':
							case 'close':
								$content.append( '<a class="' + _c[ opts.content[ c ] ] + '" href="#"></a>' );
								break;
							
							case 'title':
								$content.append( '<span class="' + _c.title + '"></span>' );
								break;
							
							default:
								$content.append( opts.content[ c ] );
								break;
						}
					}
					$content = $content.html();
				}
				else
				{
					var $content = opts.content;
				}

				$( '<div class="' + _c.header + '" />' )
					.prependTo( this.$menu )
					.append( $content );
				
				this.$menu.addClass( _c.hasheader );
			}
		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'header hasheader prev next close title' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
//		content	: [ 'prev', 'title', 'next' ],
		title	: 'Menu',
		update	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		panelHeader	: 'Header',
		panelNext	: 'Next',
		panelPrev	: 'Prev'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu labels addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'labels';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			var opts = this.opts[ _ADDON_ ];


			//	Refactor collapsed class
			this.__refactorClass( $('li', this.$menu), this.conf.classNames[ _ADDON_ ].collapsed, 'collapsed' );


			//	Toggle collapsed labels
			if ( opts.collapse )
			{
				$('.' + _c.label, $panels )
					.each(
						function()
						{
							var $l = $(this),
								$e = $l.nextUntil( '.' + _c.label, '.' + _c.collapsed );
	
							if ( $e.length )
							{
								if ( !$l.children( '.' + _c.subopen ).length )
								{
									$l.wrapInner( '<span />' );
									$l.prepend( '<a href="#" class="' + _c.subopen + ' ' + _c.fullsubopen + '" />' );
								}
							}
						}
					);
			}

		},

		//	_setup: fired once per menu
		_setup: function()
		{
			var opts = this.opts[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					collapse: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			
			
			this.opts[ _ADDON_ ] = opts;

		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'collapsed uncollapsed' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		},

		//	_clickAnchor: prevents default behavior when clicking an anchor
		_clickAnchor: function( $a, inMenu )
		{
			if ( inMenu )
			{
				var $l = $a.parent();
				if ( $l.is( '.' + _c.label ) )
				{
					var $e = $l.nextUntil( '.' + _c.label, '.' + _c.collapsed );
			
					$l.toggleClass( _c.opened );
					$e[ $l.hasClass( _c.opened ) ? 'addClass' : 'removeClass' ]( _c.uncollapsed );
					
					return true;
				}
			}
			return false;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		collapse: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		collapsed: 'Collapsed'
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu offCanvas addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'offCanvas';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	_init: fired when (re)initiating the plugin
		_init: function( $panels ) {},

		//	_setup: fired once per menu
		_setup: function()
		{
			if ( !this.opts[ _ADDON_ ] )
			{
				return;
			}

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Extend shortcut configuration
			if ( typeof conf.pageSelector != 'string' )
			{
				conf.pageSelector = '> ' + conf.pageNodetype;
			}


			glbl.$allMenus = ( glbl.$allMenus || $() ).add( this.$menu );


			//	Setup the menu
			this.vars.opened = false;
			
			var clsn = [ _c.offcanvas ];
	
			if ( opts.position != 'left' )
			{
				clsn.push( _c.mm( opts.position ) );
			}
			if ( opts.zposition != 'back' )
			{
				clsn.push( _c.mm( opts.zposition ) );
			}

			this.$menu
				.addClass( clsn.join( ' ' ) )
				.parent()
				.removeClass( _c.wrapper );

			
			//	Setup the page
			this.setPage( glbl.$page );


			//	Setup the UI blocker and the window
			this[ _ADDON_ + '_initBlocker' ]();
			this[ _ADDON_ + '_initWindow' ]();


			//	Add events
			this.$menu
				.on( _e.open + ' ' + _e.opening + ' ' + _e.opened + ' ' + 
					_e.close + ' ' + _e.closing + ' ' + _e.closed + ' ' + _e.setPage,
					function( e )
					{
						e.stopPropagation();
					}
				)
				.on( _e.open + ' ' + _e.close + ' ' + _e.setPage,
					function( e )
					{
						that[ e.type ]();
					}
				);


			//	Append to the body
			this.$menu[ conf.menuInjectMethod + 'To' ]( conf.menuWrapperSelector );
		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'offcanvas slideout modal background opening blocker page' );
			_d.add( 'style' );
			_e.add( 'opening opened closing closed setPage' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		},

		//	_clickAnchor: prevents default behavior when clicking an anchor
		_clickAnchor: function( $a, inMenu )
		{
			if ( !this.opts[ _ADDON_ ] )
			{
				return false;
			}

			//	Open menu
			var id = this.$menu.attr( 'id' );
			if ( id && id.length )
			{
				if ( this.conf.clone )
				{
					id = _c.umm( id );
				}
				if ( $a.is( '[href="#' + id + '"]' ) )
				{
					this.open();
					return true;
				}
			}
			
			//	Close menu
			if ( !glbl.$page )
			{
				return;
			}
			var id = glbl.$page.attr( 'id' );
			if ( id && id.length )
			{
				if ( $a.is( '[href="#' + id + '"]' ) )
				{
					this.close();
					return true;
				}
			}

			return false;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		position		: 'left',
		zposition		: 'back',
		modal			: false,
		moveBackground	: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		pageNodetype		: 'div',
		pageSelector		: null,
		menuWrapperSelector	: 'body',
		menuInjectMethod	: 'prepend'
	};


	//	Methods
	$[ _PLUGIN_ ].prototype.open = function()
	{
		if ( this.vars.opened )
		{
			return false;
		}

		var that = this;

		this._openSetup();

		//	Without the timeout, the animation won't work because the element had display: none;
		setTimeout(
			function()
			{
				that._openFinish();
			}, this.conf.openingInterval
		);

		return 'open';
	};

	$[ _PLUGIN_ ].prototype._openSetup = function()
	{
		var that = this;

		//	Close other menus
		glbl.$allMenus.not( this.$menu ).trigger( _e.close );

		//	Store style and position
		glbl.$page.data( _d.style, glbl.$page.attr( 'style' ) || '' );

		//	Trigger window-resize to measure height
		glbl.$wndw.trigger( _e.resize, [ true ] );

		var clsn = [ _c.opened ];

		//	Add options
		if ( this.opts[ _ADDON_ ].modal )
		{
			clsn.push( _c.modal );
		}
		if ( this.opts[ _ADDON_ ].moveBackground )
		{
			clsn.push( _c.background );
		}
		if ( this.opts[ _ADDON_ ].position != 'left' )
		{
			clsn.push( _c.mm( this.opts[ _ADDON_ ].position ) );
		}
		if ( this.opts[ _ADDON_ ].zposition != 'back' )
		{
			clsn.push( _c.mm( this.opts[ _ADDON_ ].zposition ) );
		}
		if ( this.opts.classes )
		{
			clsn.push( this.opts.classes );
		}
		glbl.$html.addClass( clsn.join( ' ' ) );

		//	Open
		setTimeout(function(){
            that.vars.opened = true;
        },this.conf.openingInterval);

		this.$menu.addClass( _c.current + ' ' + _c.opened );
	};

	$[ _PLUGIN_ ].prototype._openFinish = function()
	{
		var that = this;

		//	Callback
		this.__transitionend( glbl.$page,
			function()
			{
				that.$menu.trigger( _e.opened );
			}, this.conf.transitionDuration
		);

		//	Opening
		glbl.$html.addClass( _c.opening );
		this.$menu.trigger( _e.opening );
	};

	$[ _PLUGIN_ ].prototype.close = function()
	{
		if ( !this.vars.opened )
		{
			return false;
		}

		var that = this;

		//	Callback
		this.__transitionend( glbl.$page,
			function()
			{
				that.$menu
					.removeClass( _c.current )
					.removeClass( _c.opened );

				glbl.$html
					.removeClass( _c.opened )
					.removeClass( _c.modal )
					.removeClass( _c.background )
					.removeClass( _c.mm( that.opts[ _ADDON_ ].position ) )
					.removeClass( _c.mm( that.opts[ _ADDON_ ].zposition ) );

				if ( that.opts.classes )
				{
					glbl.$html.removeClass( that.opts.classes );
				}

				//	Restore style and position
				glbl.$page.attr( 'style', glbl.$page.data( _d.style ) );

				that.vars.opened = false;
				that.$menu.trigger( _e.closed );

			}, this.conf.transitionDuration
		);

		//	Closing
		glbl.$html.removeClass( _c.opening );
		this.$menu.trigger( _e.closing );

		return 'close';
	};
	
	$[ _PLUGIN_ ].prototype.setPage = function( $page )
	{
		if ( !$page )
		{
			$page = $(this.conf[ _ADDON_ ].pageSelector, glbl.$body);
			if ( $page.length > 1 )
			{
				$page = $page.wrapAll( '<' + this.conf[ _ADDON_ ].pageNodetype + ' />' ).parent();
			}
		}

		$page.addClass( _c.page + ' ' + _c.slideout );
		glbl.$page = $page;			
	};

	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initWindow' ] = function()
	{
		//	Prevent tabbing
		glbl.$wndw
			.on( _e.keydown,
				function( e )
				{
					if ( glbl.$html.hasClass( _c.opened ) )
					{
						if ( e.keyCode == 9 )
						{
							e.preventDefault();
							return false;
						}
					}
				}
			);

		//	Set page min-height to window height
		var _h = 0;
		glbl.$wndw
			.on( _e.resize,
				function( e, force )
				{
					if ( force || glbl.$html.hasClass( _c.opened ) )
					{
						var nh = glbl.$wndw.height();
						if ( force || nh != _h )
						{
							_h = nh;
							glbl.$page.css( 'minHeight', nh );
						}
					}
				}
			);


		//	Once fired, it can be removed
		$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initWindow' ] = function() {};
	};

	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initBlocker' ] = function()
	{
		var that = this;
		var $blck = $( '<div id="' + _c.blocker + '" class="' + _c.slideout + '" />' )
			.appendTo( glbl.$body );
			
		$blck
			.on( _e.touchstart,
				function( e )
				{
					e.preventDefault();
					e.stopPropagation();
					$blck.trigger( _e.mousedown );
				}
			)
			.on( _e.mousedown,
				function( e )
				{
					e.preventDefault();
					if ( !glbl.$html.hasClass( _c.modal ) )
					{
						glbl.$allMenus.trigger( _e.close );
					}
				}
			);


		//	Once fired, it can be removed
		$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initBlocker' ] = function() {};
	};


	var _c, _d, _e, glbl;

})( jQuery );



/*	
 * jQuery mmenu searchfield addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'searchfield';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Add the searchfield(s)
			if ( opts.add )
			{
				switch( opts.addTo )
				{
					case 'menu':
						var $wrapper = this.$menu;
						break;
	
					case 'panels':
						var $wrapper = $panels;
						break;
	
					default:
						var $wrapper = $(opts.addTo, this.$menu).filter( '.' + _c.panel );
						break;
				}
	
				if ( $wrapper.length )
				{
					$wrapper.each(
						function()
						{
							//	Add the searchfield
							var $panl = $(this),
								_node = $panl.is( '.' + _c.menu ) ? ( conf.form ) ? 'form' : 'div' : 'li';
	
							if ( !$panl.children( _node + '.' + _c.search ).length )
							{
								if ( $panl.is( '.' + _c.menu ) )
								{
									var $wrpr = that.$menu,
										insrt = 'prependTo';
								}
								else
								{
									var $wrpr = $panl.children().first(),
										insrt = ( $wrpr.is( '.' + _c.subtitle ) )
											? 'insertAfter'
											: 'insertBefore';
								}
	
								var $node = $( '<' + _node + ' class="' + _c.search + '" />' );
	
								if ( _node == 'form' && typeof conf.form == 'object' )
								{
									for ( var f in conf.form )
									{
										$node.attr( f, conf.form[ f ] );
									}
								}
	
								$node.append( '<input placeholder="' + opts.placeholder + '" type="text" autocomplete="off" />' );
								$node[ insrt ]( $wrpr );
							}
	
							if ( opts.noResults )
							{
								if ( $panl.is( '.' + _c.menu ) )
								{
									$panl = $panl.children( '.' + _c.panel ).first();
								}
								_node = $panl.is( '.' + _c.list ) ? 'li' : 'div';
	
								if ( !$panl.children( _node + '.' + _c.noresultsmsg ).length )
								{
									$( '<' + _node + ' class="' + _c.noresultsmsg + '" />' )
										.html( opts.noResults )
										.appendTo( $panl );
								}
							}
						}
					);
				}
			}
	
			if ( this.$menu.children( '.' + _c.search ).length )
			{
				this.$menu.addClass( _c.hassearch );
			}
	
			//	Search through list items
			if ( opts.search )
			{
				var $search = $('.' + _c.search, this.$menu);
				if ( $search.length )
				{
					$search
						.each(
							function()
							{
								var $srch = $(this);
	
								if ( opts.addTo == 'menu' )
								{
									var $pnls = $('.' + _c.panel, that.$menu),
										$panl = that.$menu;
								}
								else
								{
									var $pnls = $srch.closest( '.' + _c.panel ),
										$panl = $pnls;
								}
								var $inpt = $srch.children( 'input' ),
									$itms = that.__findAddBack( $pnls, '.' + _c.list ).children( 'li' ),
									$lbls = $itms.filter( '.' + _c.label ),
									$rslt = $itms
										.not( '.' + _c.subtitle )
										.not( '.' + _c.label )
										.not( '.' + _c.search )
										.not( '.' + _c.noresultsmsg );
	
								var _searchText = '> a';
								if ( !opts.showLinksOnly )
								{
									_searchText += ', > span';
								}
	
								$inpt
									.off( _e.keyup + ' ' + _e.change )
									.on( _e.keyup,
										function( e )
										{
											if ( !preventKeypressSearch( e.keyCode ) )
											{
												$srch.trigger( _e.search );
											}
										}
									)
									.on( _e.change,
										function( e )
										{
											$srch.trigger( _e.search );
										}
									);
				
								$srch
									.off( _e.reset + ' ' + _e.search )
									.on( _e.reset + ' ' + _e.search,
										function( e )
										{
											e.stopPropagation();
										}
									)
									.on( _e.reset,
										function( e )
										{
											$srch.trigger( _e.search, [ '' ] );
										}
									)
									.on( _e.search,
										function( e, query )
										{
											if ( typeof query == 'string' )
											{
												$inpt.val( query );
											}
											else
											{
												query = $inpt.val();
											}
											query = query.toLowerCase();
	
											//	Scroll to top
											$pnls.scrollTop( 0 );
				
											//	Search through items
											$rslt
												.add( $lbls )
												.addClass( _c.hidden );
	
											$rslt
												.each(
													function()
													{
														var $item = $(this);
														if ( $(_searchText, $item).text().toLowerCase().indexOf( query ) > -1 )
														{
															$item.add( $item.prevAll( '.' + _c.label ).first() ).removeClass( _c.hidden );
														}
													}
												);
		
											//	Update parent for submenus
											$( $pnls.get().reverse() ).each(
												function( i )
												{
													var $panl = $(this),
														$prnt = $panl.data( _d.parent );
		
													if ( $prnt )
													{
														var $i = $panl.add( $panl.find( '> .' + _c.list ) ).find( '> li' )
															.not( '.' + _c.subtitle )
															.not( '.' + _c.search )
															.not( '.' + _c.noresultsmsg )
															.not( '.' + _c.label )
															.not( '.' + _c.hidden );
				
														if ( $i.length )
														{
															$prnt
																.removeClass( _c.hidden )
																.removeClass( _c.nosubresults )
																.prevAll( '.' + _c.label ).first().removeClass( _c.hidden );
														}
														else if ( opts.addTo == 'menu' )
														{
															if ( $panl.hasClass( _c.opened ) )
															{
																//	Compensate the timeout for the opening animation
																setTimeout(
																	function()
																	{
																		$prnt.trigger( _e.open );
																	}, ( i + 1 ) * ( that.conf.openingInterval * 1.5 )
																);
															}
															$prnt.addClass( _c.nosubresults );
														}
													}
												}
											);
		
											//	Show/hide no results message
											$panl[ $rslt.not( '.' + _c.hidden ).length ? 'removeClass' : 'addClass' ]( _c.noresults );
	
											// Update for other addons
											that._update();
										}
									);
							}
						);
				}
			}

		},

		//	_setup: fired once per menu
		_setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];


			//	Extend shortcut options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add		: opts,
					search	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			if ( typeof opts.showLinksOnly != 'boolean' )
			{
				opts.showLinksOnly = ( opts.addTo == 'menu' );
			}


			this.opts[ _ADDON_ ] = opts;
		},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'search hassearch noresultsmsg noresults nosubresults' );
			_e.add( 'search reset change' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add				: false,
		addTo			: 'menu',
		search			: false,
//		showLinksOnly	: true,
		placeholder		: 'Search',
		noResults		: 'No results found.'
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		form			: false
	};
	


	var _c, _d, _e, glbl;


	function preventKeypressSearch( c )
	{
		switch( c )
		{
			case 9:		//	tab
			case 16:	//	shift
			case 17:	//	control
			case 18:	//	alt
			case 37:	//	left
			case 38:	//	top
			case 39:	//	right
			case 40:	//	bottom
				return true;
		}
		return false;
	}

})( jQuery );



/*	
 * jQuery mmenu toggles addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'toggles';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {
	
		//	_init: fired when (re)initiating the plugin
		_init: function( $panels )
		{			
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];
	
	
			//	Refactor toggle classes
			this.__refactorClass( $('input', $panels), this.conf.classNames[ _ADDON_ ].toggle, 'toggle' );
			this.__refactorClass( $('input', $panels), this.conf.classNames[ _ADDON_ ].check, 'check' );
	
			//	Add markup
			$('input.' + _c.toggle + ', input.' + _c.check, $panels)
				.each(
					function()
					{
						var $inpt = $(this),
							$prnt = $inpt.closest( 'li' ),
							cl = $inpt.hasClass( _c.toggle ) ? 'toggle' : 'check',
							id = $inpt.attr( 'id' ) || that.__getUniqueId();

						if ( !$prnt.children( 'label[for="' + id + '"]' ).length )
						{
							$inpt.attr( 'id', id );
							$prnt.prepend( $inpt );
	
							$('<label for="' + id + '" class="' + _c[ cl ] + '"></label>')
								.insertBefore( $prnt.children( 'a, span' ).last() );
						}
					}
				);
		},

		//	_setup: fired once per menu
		_setup: function() {},

		//	_add: fired once per page load
		_add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'toggle check' );
	
			glbl = $[ _PLUGIN_ ].glbl;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		toggle	: 'Toggle',
		check	: 'Check'
	};


	var _c, _d, _e, glbl;

})( jQuery );



