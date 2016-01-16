/*	
 * jQuery mmenu setSelected addon
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


			//	Extend shortcut options
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


			//	Remove current selected item
			if ( !opts.current )
			{
				this.bind( 'init',
					function( $panels )
					{
						$panels
							.find( '.' + _c.listview )
							.children( '.' + _c.selected )
							.removeClass( _c.selected );
					}
				);
			}


			//	Add :hover effect on items
			if ( opts.hover )
			{
				this.$menu.addClass( _c.hoverselected );
			}


			//	Set parent item selected for submenus
			if ( opts.parent )
			{
				this.$menu.addClass( _c.parentselected );

				var update = function( $panel )
				{
					//	Remove all
					this.$pnls
						.find( '.' + _c.listview )
						.find( '.' + _c.next )
						.removeClass( _c.selected );

					//	Move up the DOM tree
					var $li = $panel.data( _d.parent );
					while ( $li && $li.length )
					{
						$li = $li
							.children( '.' + _c.next )
							.addClass( _c.selected )
							.closest( '.' + _c.panel )
							.data( _d.parent );
					}
				};

				this.bind( 'openedPanel', update );
				this.bind( 'init',
					function( $panls )
					{
						update.call( this, this.$pnls.children( '.' + _c.current ) );
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