/*	
 * jQuery mmenu iconPanels add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'iconPanels';


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
					add 	: opts
				};
			}
			if ( typeof opts == 'number' )
			{
				opts = {
					add 	: true,
					visible : opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			opts.visible++;


			//	Add the iconbars
			if ( opts.add )
			{

				var clsn: string = '';
				for ( var i = 0; i <= opts.visible; i++ )
				{
					clsn += ' ' + _c.iconpanel + '-' + i;
				}
				if ( clsn.length )
				{
					clsn = clsn.slice( 1 );
				}

				var setPanels = function( $panel )
				{
					if ( $panel.hasClass( _c.vertical ) )
					{
						return;
					}

					that.$pnls
						.children( '.' + _c.panel )
						.removeClass( clsn )
						.filter( '.' + _c.subopened )
						.removeClass( _c.hidden )
						.add( $panel )
						.not( '.' + _c.vertical )
						.slice( -opts.visible )
						.each(
							function( i )
							{
								$(this).addClass( _c.iconpanel + '-' + i );
							}
						);
				};

				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.iconpanel );
					}
				);

				this.bind( 'openPanel:start', setPanels );
				this.bind( 'initPanels:after',
					function( $panels )
					{
						setPanels.call( that, that.$pnls.children( '.' + _c.opened ) );
					}
				);
				this.bind( 'initListview:after',
					function( $panel )
					{
						if ( !$panel.hasClass( _c.vertical ) )
						{
							if ( !$panel.children( '.' + _c.subblocker ).length )
							{
								$panel.prepend( '<a href="#' + $panel.closest( '.' + _c.panel ).attr( 'id' ) + '" class="' + _c.subblocker + '" />' );
							}
						}
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
	
			_c.add( 'iconpanel subblocker' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 		: false,
		visible		: 3
	};


	var _c, _d, _e, glbl;

})( jQuery );