/*
 * jQuery mmenu screenReader add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'screenReader';


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
					aria: opts,
					text: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );



			//	Aria
			if ( opts.aria )
			{

				//	Add screenreader / aria hooks for add-ons
				//	In orde to keep this list short, only extend hooks that are actually used by other add-ons
				this.bind( 'initAddons:after',
					function()
					{
						this.bind( 'initMenu:after' 	, function() { this.trigger( 'initMenu:after:sr-aria' 	) });
						this.bind( 'initNavbar:after'	, function() { this.trigger( 'initNavbar:after:sr-aria'	, arguments[ 0 ]	) });
						this.bind( 'openPanel:start'	, function() { this.trigger( 'openPanel:start:sr-aria'	, arguments[ 0 ]	) });
						this.bind( 'close:start'		, function() { this.trigger( 'close:start:sr-aria' 		) });
						this.bind( 'close:finish'		, function() { this.trigger( 'close:finish:sr-aria' 	) });
						this.bind( 'open:start'			, function() { this.trigger( 'open:start:sr-aria' 		) });
						this.bind( 'open:finish'		, function() { this.trigger( 'open:finish:sr-aria' 		) });
					}
				);


				//	Update aria-hidden for hidden / visible listitems
				this.bind( 'updateListview',
					function()
					{
						this.$pnls
							.find( '.' + _c.listview )
							.children()
							.each(
								function()
								{
									that.__sr_aria( $(this), 'hidden', $(this).is( '.' + _c.hidden ) );
								}
							);
					}
				);


				//	Update aria-hidden for the panels when opening a panel
				this.bind( 'openPanel:start',
					function( $panel )
					{
						var $hidden = this.$menu
							.find( '.' + _c.panel )
							.not( $panel )
							.not( $panel.parents( '.' + _c.panel ) );

						var $shown = $panel.add(
							$panel
								.find( '.' + _c.vertical + '.' + _c.opened )
								.children( '.' + _c.panel )
						);

						this.__sr_aria( $hidden, 'hidden', true );
						this.__sr_aria( $shown, 'hidden', false );
					}
				);
				this.bind( 'closePanel',
					function( $panel )
					{
						this.__sr_aria( $panel, 'hidden', true );
					}
				);


				//	Add aria-haspopup and aria-owns to prev- and next buttons
				this.bind( 'initPanels:after',
					function( $panels )
					{
						var $btns = $panels
							.find( '.' + _c.prev + ', .' + _c.next )
							.each(
								function()
								{
									that.__sr_aria( $(this), 'owns', $(this).attr( 'href' ).replace( '#', '' ) );
								}
							);

						this.__sr_aria( $btns, 'haspopup', true );
					}
				);


				//	Add aria-hidden for navbars in panels
				this.bind( 'initNavbar:after',
					function( $panel )
					{
						var $navbar = $panel.children( '.' + _c.navbar );
						this.__sr_aria( $navbar, 'hidden', !$panel.hasClass( _c.hasnavbar ) );
					}
				);


				//	Text
				if ( opts.text )
				{
					//	Add aria-hidden to item text if the full-width next button has screen reader text
					this.bind( 'initlistview:after',
						function( $panel )
						{
						
							var $span = $panel
								.find( '.' + _c.listview )
								.find( '.' + _c.fullsubopen )
								.parent()
								.children( 'span' );

							this.__sr_aria( $span, 'hidden', true );
						}
					);


					//	Add aria-hidden to titles in navbars
					if ( this.opts.navbar.titleLink == 'parent' )
					{
						this.bind( 'initNavbar:after',
							function( $panel )
							{
								var $navbar = $panel.children( '.' + _c.navbar ),
									hidden  = ( $navbar.children( '.' + _c.prev ).length ) ? true : false;

								this.__sr_aria( $navbar.children( '.' + _c.title ), 'hidden', hidden );
							}
						);
					}
				}
			}


			//	Text
			if ( opts.text )
			{

				//	Add screenreader / text hooks for add-ons
				//	In orde to keep this list short, only extend hooks that are actually used by other add-ons
				this.bind( 'initAddons:after',
					function()
					{
						this.bind( 'setPage:after' 	, function() { this.trigger( 'setPage:after:sr-text' 	, arguments[ 0 ]	) });
					}
				);


				//	Apdd text to the prev-buttons
				this.bind( 'initNavbar:after',
					function( $panel )
					{
						var $navbar = $panel.children( '.' + _c.navbar ),
							_text 	= $navbar.children( '.' + _c.title ).text();

						var txt = $[ _PLUGIN_ ].i18n( conf.text.closeSubmenu );

						if ( _text )
						{
							txt += ' (' + _text + ')';
						}

						$navbar.children( '.' + _c.prev ).html( this.__sr_text( txt ) );
					}
				);


				//	Add text to the next-buttons
				this.bind( 'initlistview:after',
					function( $panel )
					{
						$panel
							.find( '.' + _c.listview )
							.children( 'li' )
							.children( '.' + _c.next )
							.each(
								function()
								{
									var $next = $(this),
										_text = $prev.nextAll( 'span, a' ).first().text();

									var txt = $[ _PLUGIN_ ].i18n( conf.text[ $prev.parent().is( '.' + _c.vertical ) ? 'toggleSubmenu' : 'openSubmenu' ] );
									
									if ( _text )
									{
										txt += ' (' + _text + ')';
									}

									$next.html( that.__sr_text( txt ) );
								}
							);
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

			_c.add( 'sronly' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		aria: true,
		text: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		text: {
			closeMenu       : 'Close menu',
			closeSubmenu    : 'Close submenu',
			openSubmenu     : 'Open submenu',
			toggleSubmenu   : 'Toggle submenu'
		}
	};


	//	Methods
	$[ _PLUGIN_ ].prototype.__sr_aria = function( $elem, attr, value )
	{
		$elem
			.prop( 'aria-' + attr, value )
			[ value ? 'attr' : 'removeAttr' ]( 'aria-' + attr, value );
	};
	$[ _PLUGIN_ ].prototype.__sr_text = function( text )
	{
		return '<span class="' + _c.sronly + '">' + text + '</span>';
	};


	var _c, _d, _e, glbl;


})( jQuery );
