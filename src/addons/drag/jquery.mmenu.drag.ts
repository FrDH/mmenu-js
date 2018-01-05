/*	
 * jQuery mmenu drag add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'drag';


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
					menu 	: opts,
					panels 	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			if ( typeof opts.menu == 'boolean' )
			{
				opts.menu = {
					open 	: opts.menu
				};
			}
			if ( typeof opts.menu != 'object' )
			{
				opts.menu = {};
			}
			if ( typeof opts.panels == 'boolean' )
			{
				opts.panels = {
					close 	: opts.panels
				};
			}
			if ( typeof opts.panels != 'object' )
			{
				opts.panels = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Drag open the menu
			if ( opts.menu.open )
			{
				this.bind( 'setPage:after',
					function()
					{
						dragOpenMenu.call( this, opts.menu, conf.menu, glbl );
					}
				);
			}

			//	Drag close panels
			if ( opts.panels.close )
			{
				this.bind( 'initPanel:after',
					function( $panel )
					{
						dragClosePanel.call( this, $panel, opts.panels, conf.panels, glbl );
					}
				);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			if ( typeof Hammer != 'function' || Hammer.VERSION < 2 )
			{
				$[ _PLUGIN_ ].addons[ _ADDON_ ].add = function() {};
				$[ _PLUGIN_ ].addons[ _ADDON_ ].setup = function() {};
				return;
			}

			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'dragging' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		menu 	: {
			open 	: false,
	//		node	: null,
			maxStartPos	: 100,
			threshold	: 50
		},
		panels 	: {
			close 	: false
		},
		vendors	: {
			hammer	: {}
		}
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		menu : {
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
		},
		panels : {}
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

	function dragOpenMenu( opts, conf, glbl )
	{
		//	Set up variables
		var that = this;
			
		//	defaults for "left"
		var drag = {
			events 		: 'panleft panright',
			typeLower 	: 'x',
			typeUpper 	: 'X',
			open_dir 	: 'right',
			close_dir 	: 'left',
			negative	: false
		};
		var _dimension = 'width',
			_direction = drag.open_dir;

		var doPanstart = function( pos )
		{
			if ( pos <= opts.maxStartPos )
			{
				_stage = 1;
			}
		};
		var getSlideNodes = function()
		{
			return $('.' + _c.slideout);
		};

		var _stage 			= 0,
			_distance 		= 0,
			_maxDistance 	= 0;

		var new_distance, drag_distance, css_value;


		//	Find menu position from Positioning extension
		var x = this.opts.extensions.all;
		var position = ( typeof x == 'undefined' )
			? 'left'
			: ( x.indexOf( _c.mm( 'position-right' ) ) > -1 )
				? 'right'
				: ( x.indexOf( _c.mm( 'position-top' ) ) > -1 )
					? 'top'
					: ( x.indexOf( _c.mm( 'position-bottom' ) ) > -1 )
						? 'bottom'
						: 'left';

		var zposition = ( typeof x == 'undefined' )
			? 'back'
			: ( x.indexOf( _c.mm( 'position-top' 	  ) ) > -1 ) ||
			  ( x.indexOf( _c.mm( 'position-bottom' ) ) > -1 ) ||
			  ( x.indexOf( _c.mm( 'position-front'  ) ) > -1 )
				? 'front'
				: 'back';


		switch( position )
		{
			case 'top':
			case 'bottom':
				drag.events		= 'panup pandown';
				drag.typeLower	= 'y';
				drag.typeUpper	= 'Y';

				_dimension 		= 'height';
				break;
		}

		switch( position )
		{	
			case 'right':
			case 'bottom':
				drag.negative 	= true;
				doPanstart		= function( pos )
				{
					if ( pos >= glbl.$wndw[ _dimension ]() - opts.maxStartPos )
					{
						_stage = 1;
					}
				};
				break;
		}

		switch( position )
		{
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

		switch ( zposition )
		{
			case 'front':
				getSlideNodes = function()
				{
					return that.$menu;
				};
				break;
		}

		var $slideOutNodes;
		var $dragNode = this.__valueOrFn( this.$menu, opts.node, glbl.$page );

		if ( typeof $dragNode == 'string' )
		{
			$dragNode = $($dragNode);
		}


		//	Bind events
		var _hammer = new Hammer( $dragNode[ 0 ], this.opts[ _ADDON_ ].vendors.hammer );

		_hammer
			.on( 'panstart',
				function( e )
				{
					doPanstart( e.center[ drag.typeLower ] );
					$slideOutNodes = getSlideNodes();
					_direction = drag.open_dir;
				}
			);

		_hammer
			.on( drag.events + ' panend',
				function( e )
				{
					if ( _stage > 0 )
					{
						e.preventDefault();
					}
				}
			);

		_hammer
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
						_direction = ( new_distance >= _distance ) ? drag.open_dir : drag.close_dir;
					}

					_distance = new_distance;

					if ( _distance > opts.threshold )
					{
						if ( _stage == 1 )
						{
							if ( glbl.$html.hasClass( _c.wrapper + '_opened' ) )
							{
								return;
							}
							_stage = 2;

							that._openSetup();
							that.trigger( 'open:start' );
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
						drag_distance = minMax( _distance, 10, _maxDistance ) - ( zposition == 'front' ? _maxDistance : 0 );
						if ( drag.negative )
						{
							drag_distance = -drag_distance;
						}
						css_value = 'translate' + drag.typeUpper + '(' + drag_distance + 'px )';

						$slideOutNodes.css({
							'-webkit-transform': '-webkit-' + css_value,	
							'transform': css_value
						});
					}
				}
			);

		_hammer
			.on( 'panend',
				function( e )
				{
					if ( _stage == 2 )
					{
						glbl.$html.removeClass( _c.dragging );
						$slideOutNodes.css( 'transform', '' );
						that[ _direction == drag.open_dir ? '_openFinish' : 'close' ]();
					}
		        	_stage = 0;
			    }
			);
	}


	function dragClosePanel( $panel, opts, conf, glbl )
	{
		var that = this;
		var $parent = $panel.data( _d.parent );

		if ( $parent )
		{
			$parent = $parent.closest( '.' + _c.panel );

			var _hammer = new Hammer( $panel[ 0 ], that.opts[ _ADDON_ ].vendors.hammer ),
				timeout = null;

			_hammer
				.on( 'panright',
					function( e )
					{
						if ( timeout )
						{
							return;
						}
						that.openPanel( $parent );

						//	prevent dragging while panel still open.
						timeout = setTimeout(
							function()
							{
								clearTimeout( timeout );
								timeout = null;
							}, that.conf.openingInterval + that.conf.transitionDuration
						);
					}
				);
		}
	}

})( jQuery );