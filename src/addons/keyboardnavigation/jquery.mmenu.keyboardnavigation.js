/*	
 * jQuery mmenu keyboardNavigation addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'keyboardNavigation';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' || typeof opts == 'string' )
			{
				opts = {
					enable: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Enable keyboard navigation
			if ( opts.enable )
			{

				if ( opts.enhance )
				{
					this.$menu.addClass( _c.keyboardfocus );
				}

				var $start = $('<input class="' + _c.tabstart + '" tabindex="0" type="text" />'),
					$end   = $('<input class="' + _c.tabend   + '" tabindex="0" type="text" />');

				this.bind( 'initPanels',
					function()
					{
						this.$menu
							.prepend( $start )
							.append(  $end )
							.children( '.' + _c.navbar )
								.find( focs )
								.attr( 'tabindex', 0 );
					}
				);

				this.bind( 'open',
					function()
					{
						tabindex.call( this );

						this.__transitionend( this.$menu,
							function()
							{
								focus.call( that, null, opts.enable );
							}, this.conf.transitionDuration
						);
					}
				);

				this.bind( 'openPanel',
					function( $panl )
					{
						tabindex.call( this, $panl );

						this.__transitionend( $panl,
							function()
							{
								focus.call( that, $panl, opts.enable );
							}, this.conf.transitionDuration
						);
					}
				);

				this[ '_initWindow_' + _ADDON_ ]( opts.enhance );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'tabstart tabend keyboardfocus' );
			_e.add( 'focusin keydown' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		enable: false,
		enhance: false
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {};


	//	Methods
	$[ _PLUGIN_ ].prototype[ '_initWindow_' + _ADDON_ ] = function( enhance )
	{

		//	Re-enable tabbing in general
		glbl.$wndw
			.off( _e.keydown + '-offCanvas' );

		//	Prevent tabbing outside an offcanvas menu
		glbl.$wndw
			.off( _e.focusin + '-' + _ADDON_ )
			.on( _e.focusin + '-' + _ADDON_,
				function( e ) 
				{
					if ( glbl.$html.hasClass( _c.opened ) )
					{
						var $t = $(e.target);

						if ( $t.is( '.' + _c.tabend ) )
						{
							$t.parent().find( '.' + _c.tabstart ).focus();
						}
					}
				}
			);

		//	Default keyboard navigation
		glbl.$wndw
			.off( _e.keydown + '-' + _ADDON_ )
			.on( _e.keydown + '-' + _ADDON_,
				function( e )
				{
					var $t = $(e.target),
						$m = $t.closest( '.' + _c.menu );

					if ( $m.length )
					{
						var api = $m.data( 'mmenu' );

						//	special case for input and textarea
						if ( $t.is( 'input, textarea' ) )
						{
						}
						else
						{
							switch( e.keyCode )
							{
								//	press enter to toggle and check
								case 13: 
									if ( $t.is( '.mm-toggle' ) || 
										 $t.is( '.mm-check' )
									) {
										$t.trigger( _e.click );
									}
									break;

								//	prevent spacebar or arrows from scrolling the page
								case 32: 	//	space
								case 37: 	//	left
								case 38: 	//	top
								case 39: 	//	right
								case 40: 	//	bottom
									e.preventDefault();
									break;
							}
						}
					}
				}
			);

		//	Enhanced keyboard navigation
		if ( enhance )
		{
			glbl.$wndw
				.on( _e.keydown + '-' + _ADDON_,
					function( e )
					{
						var $t = $(e.target),
							$m = $t.closest( '.' + _c.menu );

						if ( $m.length )
						{
							var api = $m.data( 'mmenu' );

							//	special case for input and textarea
							if ( $t.is( 'input, textarea' ) )
							{
								switch( e.keyCode )
								{
									//	empty searchfield with esc
									case 27:
										$t.val( '' );
										break;
								}
							}
							else
							{
								switch( e.keyCode )
								{
									//	close submenu with backspace
									case 8: 
										var $p = $t.closest( '.' + _c.panel ).data( _d.parent );
										if ( $p && $p.length )
										{
											api.openPanel( $p.closest( '.' + _c.panel ) );
										}
										break;

									//	close menu with esc
									case 27:
										if ( $m.hasClass( _c.offcanvas ) )
										{
											api.close();
										}
										break;
								}
							}
						}
					}
				);
		}
	};

	var _c, _d, _e, glbl;
	var focs = 'input, select, textarea, button, label, a[href]';


	function focus( $panl, enable )
	{
		if ( !$panl )
		{
			$panl = this.$pnls.children( '.' + _c.current );
		}

		var $focs = $();

		if ( enable == 'default' )
		{
			//	first anchor in listview
			$focs = $panl.children( '.' + _c.listview ).find( 'a[href]' ).not( ':hidden' );

			//	first element in panel
			if ( !$focs.length )
			{
				$focs = $panl.find( focs ).not( ':hidden' );
			}

			//	first anchor in navbar
			if ( !$focs.length )
			{
				$focs = this.$menu.children( '.' + _c.navbar ).find( focs ).not( ':hidden' );
			}
		}

		//	default
		if ( !$focs.length )
		{
			$focs = this.$menu.children( '.' + _c.tabstart );
		}

		$focs.first().focus();
	}
	function tabindex( $panl )
	{
		if ( !$panl )
		{
			$panl = this.$pnls.children( '.' + _c.current );
		}

		var $pnls = this.$pnls.children( '.' + _c.panel ),
			$hidn = $pnls.not( $panl );

		$hidn.find( focs ).attr( 'tabindex', -1 );
		$panl.find( focs ).attr( 'tabindex', 0 );

		//	_c.toggle will result in an empty string if the toggle addon is not loaded
		$panl.find( 'input.mm-toggle, input.mm-check' ).attr( 'tabindex', -1 );
	}

})( jQuery );