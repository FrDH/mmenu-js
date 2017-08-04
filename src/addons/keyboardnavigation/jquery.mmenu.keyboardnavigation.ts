/*	
 * jQuery mmenu keyboardNavigation add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'keyboardNavigation';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			//	Keyboard navigation on touchscreens opens the virtual keyboard :/
			if ( $[ _PLUGIN_ ].support.touch )
			{
				return;
			}


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

				var $start = $('<button class="' + _c.tabstart + '" tabindex="0" type="button" />'),
					$end   = $('<button class="' + _c.tabend   + '" tabindex="0" type="button" />');

				this.bind( 'initMenu:after',
					function()
					{
						if ( opts.enhance )
						{
							this.$menu.addClass( _c.keyboardfocus );
						}

						this[ '_initWindow_' + _ADDON_ ]( opts.enhance );
					}
				);
				this.bind( 'initOpened:before',
					function()
					{
						this.$menu
							.prepend( $start )
							.append( $end )
							.children( '.' + _c.mm( 'navbars-top' ) + ', .' + _c.mm( 'navbars-bottom' )  )
							.children( '.' + _c.navbar )
							.children( 'a.' + _c.title )
							.attr( 'tabindex', -1 );
					}
				);
				this.bind( 'open:start',
					function()
					{
						tabindex.call( this );
					}
				);
				this.bind( 'open:finish',
					function()
					{
						focus.call( this, null, opts.enable );
					}
				);
				this.bind( 'openPanel:start',
					function( $panl )
					{
						tabindex.call( this, $panl );
					}
				);
				this.bind( 'openPanel:finish',
					function( $panl )
					{
						focus.call( this, $panl, opts.enable );
					}
				);


				//	Add screenreader / aria support
				this.bind( 'initOpened:after',
					function()
					{
						this.__sr_aria( this.$menu.children( '.' + _c.mm( 'tabstart' ) + ', .' + _c.mm( 'tabend' ) ), 'hidden', true );
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
		$panl = $panl || this.$pnls.children( '.' + _c.opened );

		var $focs = $(),
			$navb = this.$menu
				.children( '.' + _c.mm( 'navbars-top' ) + ', .' + _c.mm( 'navbars-bottom' )  )
				.children( '.' + _c.navbar );

		//	already focus in navbar
		if ( $navb.find( focs ).filter( ':focus' ).length )
		{
			return;
		}

		if ( enable == 'default' )
		{
			//	first anchor in listview
			$focs = $panl.children( '.' + _c.listview ).find( 'a[href]' ).not( '.' + _c.hidden );

			//	first element in panel
			if ( !$focs.length )
			{
				$focs = $panl.find( focs ).not( '.' + _c.hidden );
			}

			//	first anchor in navbar
			if ( !$focs.length )
			{
				$focs = $navb
					.find( focs )
					.not( '.' + _c.hidden );
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
			$panl = this.$pnls.children( '.' + _c.opened );
		}

		var $pnls = this.$pnls.children( '.' + _c.panel ),
			$hidn = $pnls.not( $panl );

		$hidn.find( focs ).attr( 'tabindex', -1 );
		$panl.find( focs ).attr( 'tabindex', 0 );

		//	_c.toggle will result in an empty string if the toggle addon is not loaded
		$panl.find( '.' + _c.mm( 'toggle' ) + ', .' + _c.mm( 'check' ) ).attr( 'tabindex', -1 );
		$panl.children( '.' + _c.navbar ).children( '.' + _c.title ).attr( 'tabindex', -1 );
	}

})( jQuery );