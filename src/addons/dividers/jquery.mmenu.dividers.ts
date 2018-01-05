/*	
 * jQuery mmenu dividers add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'dividers';


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
					add		: opts,
					fixed	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Type dividers
			if ( opts.type )
			{
				this.bind( 'initMenu:after',
					function()
					{
						this.$menu.addClass( _c.menu + '_' + _ADDON_ + '-' + opts.type );
					}
				);
			}

			//	Add dividers
			if ( opts.add )
			{
				this.bind( 'initListview:after',
					function( $panel )
					{
						var $wrapper;
						switch( opts.addTo )
						{
							case 'panels':
								$wrapper = $panel;
								break;

							default:
								$wrapper = $panel.filter( opts.addTo );
								break;
						}

						if ( !$wrapper.length )
						{
							return;
						}

						$wrapper
							.children( '.' + _c.listitem + '_divider' )
							.remove();
							
						$wrapper
							.find( '.' + _c.listview )
							.each(
								function()
								{
									var last = '';
									that.__filterListItems( $(this).children() )
										.each(
											function()
											{
												var letter = $.trim( $(this).children( 'a, span' ).text() ).slice( 0, 1 ).toLowerCase();
												if ( letter != last && letter.length )
												{
													last = letter;
													$( '<li class="' + _c.listitem + ' ' + _c.listitem + '_divider' + '">' + letter + '</li>' ).insertBefore( this );
												}
											}
										);
								}
							);
					}
				);
			}
			

			//	Fixed dividers
			if ( opts.fixed )
			{
				//	Add the fixed divider
				this.bind( 'initPanels:after',
					function()
					{
						if ( typeof this.$fixeddivider == 'undefined' )
						{
							this.$fixeddivider = $('<ul class="' + _c.listview + ' ' + _c.listview + '_fixeddivider"><li class="' + _c.listitem + ' ' + _c.listitem + '_divider' + '"></li></ul>')
								.appendTo( this.$pnls )
								.children();
						}
					}
				);

				var setValue = function( $panel )
				{
					$panel = $panel || this.$pnls.children( '.' + _c.panel + '_opened' );
					if ( $panel.is( ':hidden' ) )
					{
						return;
					}

					var $dvdr = $panel
						.find( '.' + _c.listitem + '_divider' )
						.not( '.' + _c.hidden );

					var scrl = $panel.scrollTop() || 0,
						text = '';

					$dvdr.each(
						function()
						{
							if ( $(this).position().top + scrl < scrl + 1 )
							{
								text = $(this).text();
							}
						}
					);

					this.$fixeddivider.text( text );
					this.$pnls[ text.length ? 'addClass' : 'removeClass' ]( _c.panel + '_dividers' );
				};

				//	Set correct value when opening menu
				this.bind( 'open:start', setValue );

				//	Set correct value when opening a panel
				this.bind( 'openPanel:start', setValue );

				//	Set correct value after updating listviews
				this.bind( 'updateListview', setValue );

				//	Set correct value after scrolling
				this.bind( 'initPanel:after',
					function( $panel )
					{
						$panel
							.off( _e.scroll + '-' + _ADDON_ + ' ' + _e.touchmove + '-' + _ADDON_ )
							.on(  _e.scroll + '-' + _ADDON_ + ' ' + _e.touchmove + '-' + _ADDON_,
								function( e )
								{
									if ( $panel.hasClass( _c.panel + '_opened' ) )
									{
										setValue.call( that, $panel );
									}
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

			_e.add( 'scroll' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add			: false,
		addTo		: 'panels',
		fixed		: false,
		type		: null
	};


	var _c, _d, _e, glbl;

})( jQuery );