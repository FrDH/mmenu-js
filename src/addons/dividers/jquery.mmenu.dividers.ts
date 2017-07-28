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


			//	Refactor collapsed class
			this.bind( 'initListview:after',
				function( $panel )
				{
					this.__refactorClass( $panel.find( 'li' ), this.conf.classNames[ _ADDON_ ].collapsed, 'collapsed' );
				}
			);


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
							.find( '.' + _c.listview )
							.find( '.' + _c.divider )
							.remove()
							.end()
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
													$( '<li class="' + _c.divider + '">' + letter + '</li>' ).insertBefore( this );
												}
											}
										);
								}
							);
					}
				);
			}


			//	Toggle collapsed list items
			if ( opts.collapse )
			{
				this.bind( 'initListview:after',
					function( $panel )
					{
						$panel
							.find( '.' + _c.divider )
							.each(
								function()
								{
									var $l = $(this),
										$e = $l.nextUntil( '.' + _c.divider, '.' + _c.collapsed );

									if ( $e.length )
									{
										if ( !$l.children( '.' + _c.next ).length )
										{
											$l.wrapInner( '<span />' );
											$l.prepend( '<a href="#" class="' + _c.next + ' ' + _c.fullsubopen + '" />' );
										}
									}
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
							this.$fixeddivider = $('<ul class="' + _c.listview + ' ' + _c.fixeddivider + '"><li class="' + _c.divider + '"></li></ul>')
								.prependTo( this.$pnls )
								.children();
						}
					}
				);

				var setValue = function( $panel )
				{
					$panel = $panel || this.$pnls.children( '.' + _c.opened );
					if ( $panel.is( ':hidden' ) )
					{
						return;
					}

					var $dvdr = $panel
						.children( '.' + _c.listview)
						.children( '.' + _c.divider )
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
					this.$pnls[ text.length ? 'addClass' : 'removeClass' ]( _c.hasdividers );
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
									setValue.call( that, $panel );
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
	
			_c.add( 'collapsed uncollapsed fixeddivider hasdividers' );
			_e.add( 'scroll' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu )
		{
			if ( this.opts[ _ADDON_ ].collapse && inMenu )
			{
				var $l = $a.parent();
				if ( $l.is( '.' + _c.divider ) )
				{
					var $e = $l.nextUntil( '.' + _c.divider, '.' + _c.collapsed );
			
					$l.toggleClass( _c.opened );
					$e[ $l.hasClass( _c.opened ) ? 'addClass' : 'removeClass' ]( _c.uncollapsed );
					
					return true;
				}
			}
			return false;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add			: false,
		addTo		: 'panels',
		fixed		: false,
		collapse	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		collapsed: 'Collapsed'
	};


	var _c, _d, _e, glbl;

})( jQuery );