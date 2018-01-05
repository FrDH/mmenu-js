/*	
 * jQuery mmenu iconbar add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'iconbar';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;

			if ( opts instanceof Array )
			{
				opts = {
					add: true,
					top: opts
				};
			}

			if ( !opts.add )
			{
				return;
			}

			var $iconbar = null;

			$.each(
				[ 'top', 'bottom' ],
				function( n, poss )
				{

					var ctnt = opts[ poss ];

					//	Extend shorthand options
					if ( !( ctnt instanceof Array ) )
					{
						ctnt = [ ctnt ];
					}

					//	Create node
					var $ibar = $( '<div class="' + _c.iconbar + '__' + poss + '" />' );


					//	Add content
					for ( var c = 0, l = ctnt.length; c < l; c++ )
					{
						$ibar.append( ctnt[ c ] );
					}

					if ( $ibar.children().length )
					{
						if ( !$iconbar )
						{
							$iconbar = $('<div class="' + _c.iconbar + '" />');
						}
						$iconbar.append( $ibar );
					}
				}
			);


			function selectTab( $panel )
			{
				$tabs.removeClass( _c.iconbar + '__tab_selected' );

				var $tab = $tabs.filter( '[href="#' + $panel.attr( 'id' ) + '"]' );
				if ( $tab.length )
				{
					$tab.addClass( _c.iconbar + '__tab_selected' );
				}
				else
				{
					var $parent = $panel.data( _d.parent );
					if ( $parent && $parent.length )
					{
						selectTab( $parent.closest( '.' + _c.panel ) );
					}
				}
			}

			//	Add to menu
			if ( $iconbar )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu
							.addClass( _c.menu + '_iconbar-' + opts.size )
							.prepend( $iconbar );
					}
				);

				//	Tabs
				if ( opts.type == 'tabs' )
				{
					$iconbar.addClass( _c.iconbar + '_tabs' );
					var $tabs = $iconbar.find( 'a' );

					//	TODO: better via clickAnchor
					$tabs
						.on( _e.click + '-' + _ADDON_,
							function( e )
							{
								var $tab = $(this);
								if ( $tab.hasClass( _c.iconbar + '__tab_selected' ) )
								{
									e.stopImmediatePropagation();
									return;
								}

								try
								{
									var $targ = $( $tab.attr( 'href' ) );
									if ( $targ.hasClass( _c.panel ) )
									{
										e.preventDefault();
										e.stopImmediatePropagation();

										that.__openPanelWoAnimation( $targ );
									}
								}
								catch( err ) {}
							}
						);

					this.bind( 'openPanel:start', selectTab );
				}
			}
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
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 	: false,
		size	: 40,
		top 	: [],
		bottom 	: []
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {};


	var _c, _d, _e, glbl;

})( jQuery );