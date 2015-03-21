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
					add		: opts,
					update	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


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
			this.$footer = this.$menu.children( '.' + _c.footer );


			//	Update content
			if ( opts.update && this.$footer && this.$footer.length )
			{
				var update = function( $panl )
				{
					$panl = $panl || this.$menu.children( '.' + _c.current );
					var _cnt = $('.' + this.conf.classNames[ _ADDON_ ].panelFooter, $panl).html() || opts.title;

					this.$footer[ _cnt ? 'removeClass' : 'addClass' ]( _c.hidden );
					this.$footer.html( _cnt );
				};

				this.bind( 'openPanel', update );
				this.bind( 'init',
					function()
					{
						update.call( this, this.$menu.children( '.' + _c.current ) );
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
	
			_c.add( 'footer hasfooter' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
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