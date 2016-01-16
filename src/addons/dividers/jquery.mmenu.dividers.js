/*	
 * jQuery mmenu dividers addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'dividers';


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
					fixed	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Refactor collapsed class
			this.bind( 'init',
				function( $panels )
				{
					this.__refactorClass( $('li', this.$menu), this.conf.classNames[ _ADDON_ ].collapsed, 'collapsed' );
				}
			);


			//	Add dividers
			if ( opts.add )
			{
				this.bind( 'init',
					function( $panels )
					{
						var $wrapper;
						switch( opts.addTo )
						{
							case 'panels':
								$wrapper = $panels;
								break;
			
							default:
								$wrapper = $(opts.addTo, this.$pnls).filter( '.' + _c.panel );
								break;
						}

						$('.' + _c.divider, $wrapper).remove();

						$wrapper
							.find( '.' + _c.listview )
							.not( '.' + _c.vertical )
							.each(
								function()
								{
									var last = '';
									that.__filterListItems( $(this).children() )
										.each(
											function()
											{
												var crnt = $.trim( $(this).children( 'a, span' ).text() ).slice( 0, 1 ).toLowerCase();
												if ( crnt != last && crnt.length )
												{
													last = crnt;
													$( '<li class="' + _c.divider + '">' + crnt + '</li>' ).insertBefore( this );
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
				this.bind( 'init',
					function( $panels )
					{
						$('.' + _c.divider, $panels )
							.each(
								function()
								{
									var $l = $(this),
										$e = $l.nextUntil( '.' + _c.divider, '.' + _c.collapsed );

									if ( $e.length )
									{
										if ( !$l.children( '.' + _c.subopen ).length )
										{
											$l.wrapInner( '<span />' );
											$l.prepend( '<a href="#" class="' + _c.subopen + ' ' + _c.fullsubopen + '" />' );
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
				var update = function( $panl )
				{
					$panl = $panl || this.$pnls.children( '.' + _c.current );
					var $dvdr = $panl
						.find( '.' + _c.divider )
						.not( '.' + _c.hidden );

					if ( $dvdr.length )
					{
						this.$menu.addClass( _c.hasdividers );

						var scrl = $panl.scrollTop() || 0,
							text = '';

						if ( $panl.is( ':visible' ) )
						{
							$panl
								.find( '.' + _c.divider )
								.not( '.' + _c.hidden )
								.each(
									function()
									{
										if ( $(this).position().top + scrl < scrl + 1 )
										{
											text = $(this).text();
										}
									}
								);
						}
	
						this.$fixeddivider.text( text );
					}
					else
					{
						this.$menu.removeClass( _c.hasdividers );
					}
				};


				//	Add the fixed divider
				this.$fixeddivider = $('<ul class="' + _c.listview + ' ' + _c.fixeddivider + '"><li class="' + _c.divider + '"></li></ul>')
					.prependTo( this.$pnls )
					.children();


				//	Set correct value after opening panels and update
				this.bind( 'openPanel', update );
				this.bind( 'update', update );


				//	Set correct value after scrolling
				this.bind( 'init',
					function( $panels )
					{
						$panels
							.off( _e.scroll + '-dividers ' + _e.touchmove + '-dividers' )
							.on( _e.scroll + '-dividers ' + _e.touchmove + '-dividers',
								function( e )
								{
									update.call( that, $(this) );
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