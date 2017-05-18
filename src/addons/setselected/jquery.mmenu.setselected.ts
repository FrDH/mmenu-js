/*	
 * jQuery mmenu setSelected add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'setSelected';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					hover	: opts,
					parent	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Find current by URL
			if ( opts.current == 'detect' )
			{
				var findCurrent = function( url )
				{
					url = url.split( "?" )[ 0 ].split( "#" )[ 0 ];

					var $a = that.$menu.find( 'a[href="'+ url +'"], a[href="'+ url +'/"]' );
					if ( $a.length )
					{
						that.setSelected( $a.parent(), true );
					}
					else
					{
						url = url.split( '/' ).slice( 0, -1 );
						if ( url.length )
						{
							findCurrent( url.join( '/' ) );
						}
					}
				};
				this.bind( 'initMenu:after',
					function()
					{
						findCurrent( window.location.href );
					}
				);

			}

			//	Remove current selected item
			else if ( !opts.current )
			{
				this.bind( 'initListview:after',
					function( $panel )
					{
						this.$pnls
							.find( '.' + _c.listview )
							.children( '.' + _c.selected )
							.removeClass( _c.selected );
					}
				);
			}


			//	Add :hover effect on items
			if ( opts.hover )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.hoverselected );
					}
				);
			}


			//	Set parent item selected for submenus
			if ( opts.parent )
			{
				this.bind( 'openPanel:finish',
					function( $panel )
					{
						//	Remove all
						this.$pnls
							.find( '.' + _c.listview )
							.find( '.' + _c.next )
							.removeClass( _c.selected );

						//	Move up the DOM tree
						var $parent = $panel.data( _d.parent );
						while ( $parent )
						{
							$parent
								.not( '.' + _c.vertical )
								.children( '.' + _c.next )
								.addClass( _c.selected );
						
							$parent = $parent		
								.closest( '.' + _c.panel )
								.data( _d.parent );
						}
					}
				);

				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.parentselected );
					}
				);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'hoverselected parentselected' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		current : true,
		hover	: false,
		parent	: false
	};


	var _c, _d, _e, glbl;


})( jQuery );