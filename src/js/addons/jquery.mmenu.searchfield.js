/*	
 * jQuery mmenu searchfield addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'searchfield';


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
					search	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Bind functions to update
			this.bind( 'init',
				function( $panels )
				{
					//	Add the searchfield(s)
					if ( opts.add )
					{
						switch( opts.addTo )
						{
							case 'menu':
								var $wrapper = this.$menu;
								break;

							case 'panels':
								var $wrapper = $panels;
								break;

							default:
								var $wrapper = $(opts.addTo, this.$menu).filter( '.' + _c.panel );
								break;
						}

						$wrapper
							.each(
								function()
								{
									//	Add the searchfield
									var $panl = $(this);
									if ( $panl.is( '.' + _c.panel ) && $panl.is( '.' + _c.vertical ) )
									{
										return;
									}

									if ( !$panl.children( '.' + _c.search ).length )
									{
										var _node = ( conf.form ) 
											? 'form'
											: 'div';

										var $node = $( '<' + _node + ' class="' + _c.search + '" />' );
			
										if ( conf.form && typeof conf.form == 'object' )
										{
											for ( var f in conf.form )
											{
												$node.attr( f, conf.form[ f ] );
											}
										}

										$node.append( '<input placeholder="' + opts.placeholder + '" type="text" autocomplete="off" />' )
											.prependTo( $panl );
										
										$panl.addClass( _c.hassearch );
									}

									if ( opts.noResults )
									{
										if ( $panl.is( '.' + _c.menu ) )
										{
											$panl = $panl.children( '.' + _c.panel ).first();
										}
										if ( !$panl.children( '.' + _c.noresultsmsg ).length )
										{
											var $lst = $panl.children( '.' + _c.listview );

											$( '<div class="' + _c.noresultsmsg + '" />' )
												.append( opts.noResults )
												[ $lst.length ? 'insertBefore' : 'prependTo' ]( $lst.length ? $lst : $panl );
										}
									}
								}
						);
					}

/*
					if ( this.$menu.children( '.' + _c.search ).length )
					{
						this.$menu.addClass( _c.hassearch );
					}
*/

					//	Search through list items
					if ( opts.search )
					{
						$('.' + _c.search, this.$menu)
							.each(
								function()
								{
									var $srch = $(this);

									if ( opts.addTo == 'menu' )
									{
										var $pnls = $('.' + _c.panel, that.$menu),
											$panl = that.$menu;
									}
									else
									{
										var $pnls = $srch.closest( '.' + _c.panel ),
											$panl = $pnls;
									}
									var $inpt = $srch.children( 'input' ),
										$itms = that.__findAddBack( $pnls, '.' + _c.listview ).children( 'li' ),
										$dvdr = $itms.filter( '.' + _c.divider ),
										$rslt = that.__filterListItems( $itms );

									var _anchor = '> a',
										_both = _anchor + ', > span';

									var search = function()
									{

										var query = $inpt.val().toLowerCase();

										//	Scroll to top
										$pnls.scrollTop( 0 );
			
										//	Search through items
										$rslt
											.add( $dvdr )
											.addClass( _c.hidden )
											.find( '.' + _c.fullsubopensearch )
											.removeClass( _c.fullsubopen )
											.removeClass( _c.fullsubopensearch );

										$rslt
											.each(
												function()
												{
													var $item = $(this),
														_search = _anchor;

													if ( opts.showTextItems || ( opts.showSubPanels && $item.find( '.' + _c.next ) ) )
													{
														_search = _both;
													}

													if ( $(_search, $item).text().toLowerCase().indexOf( query ) > -1 )
													{
														$item.add( $item.prevAll( '.' + _c.divider ).first() ).removeClass( _c.hidden );
													}
												}
											);

										//	Update sub items
										if ( opts.showSubPanels )
										{
											$pnls.each(
												function( i )
												{
													var $panl = $(this);
													that.__filterListItems( $panl.find( '.' + _c.listview ).children() )
														.each(
															function()
															{
																var $li = $(this),
																	$su = $li.data( _d.sub );

																$li.removeClass( _c.nosubresults );
																if ( $su )
																{
																	$su.find( '.' + _c.listview ).children().removeClass( _c.hidden );
																}
															}
														);
												}
											);
										}

										//	Update parent for submenus
										$( $pnls.get().reverse() )
											.each(
												function( i )
												{
													var $panl = $(this),
														$prnt = $panl.data( _d.parent );

													if ( $prnt )
													{
														if ( that.__filterListItems( $panl.find( '.' + _c.listview ).children() ).length )
														{
															if ( $prnt.hasClass( _c.hidden ) )
															{
																$prnt.children( '.' + _c.next )
																	.not( '.' + _c.fullsubopen )
																	.addClass( _c.fullsubopen )
																	.addClass( _c.fullsubopensearch );
															}
															$prnt
																.removeClass( _c.hidden )
																.removeClass( _c.nosubresults )
																.prevAll( '.' + _c.divider )
																.first()
																.removeClass( _c.hidden );
														}
														else if ( opts.addTo == 'menu' )
														{
															if ( $panl.hasClass( _c.opened ) )
															{
																//	Compensate the timeout for the opening animation
																setTimeout(
																	function()
																	{
																		that.openPanel( $prnt.closest( '.' + _c.panel ) );
																	}, ( i + 1 ) * ( that.conf.openingInterval * 1.5 )
																);
															}
															$prnt.addClass( _c.nosubresults );
														}
													}
												}
											);
	
										//	Show/hide no results message
										$panl[ $rslt.not( '.' + _c.hidden ).length ? 'removeClass' : 'addClass' ]( _c.noresults );

										// Update for other addons
										this.update();
									}


									$inpt
										.off( _e.keyup + '-searchfield ' + _e.change + '-searchfield' )
										.on( _e.keyup + '-searchfield',
											function( e )
											{
												if ( !preventKeypressSearch( e.keyCode ) )
												{
													search.call( that );
												}
											}
										)
										.on( _e.change + '-searchfield',
											function( e )
											{
												search.call( that );
											}
										);
								}
							);
					}
				}
		 	);
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'search hassearch noresultsmsg noresults nosubresults fullsubopensearch' );
			_e.add( 'change keyup' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add				: false,
		addTo			: 'menu',
		search			: false,
		placeholder		: 'Search',
		noResults		: 'No results found.',
		showTextItems	: false,
		showSubPanels	: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		form			: false
	};
	

	var _c, _d, _e, glbl;


	function preventKeypressSearch( c )
	{
		switch( c )
		{
			case 9:		//	tab
			case 16:	//	shift
			case 17:	//	control
			case 18:	//	alt
			case 37:	//	left
			case 38:	//	top
			case 39:	//	right
			case 40:	//	bottom
				return true;
		}
		return false;
	}

})( jQuery );