/*	
 * jQuery mmenu searchfield add-on
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


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			if ( typeof opts.resultsPanel == 'boolean' )
			{
				opts.resultsPanel = {
					add: opts.resultsPanel
				};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			conf = this.conf[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].configuration[ _ADDON_ ], conf );


			//	Blur searchfield
			this.bind( 'close:start',
				function()
				{
					this.$menu
						.find( '.' + _c.search )
						.find( 'input' )
						.blur();
				}
			);


			//	Bind functions to update
			this.bind( 'initPanels:after',
				function( $panels )
				{

					//	Add the searchfield(s)
					if ( opts.add )
					{
						var $wrapper;
						switch( opts.addTo )
						{
							case 'panels':
								$wrapper = $panels;
								break;

							default:
								$wrapper = this.$menu.find( opts.addTo );
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
										var clear  = that.__valueOrFn( conf.clear , $panl ),
											form   = that.__valueOrFn( conf.form  , $panl ),
											input  = that.__valueOrFn( conf.input , $panl ),
											submit = that.__valueOrFn( conf.submit, $panl );

										var $srch = $( '<' + ( form ? 'form' : 'div' ) + ' class="' + _c.search + '" />' ),
											$inpt = $( '<input placeholder="' + $[ _PLUGIN_ ].i18n( opts.placeholder ) + '" type="text" autocomplete="off" />' );

										$srch.append( $inpt );

										var k;

										if ( input )
										{
											for ( k in input )
											{
												$inpt.attr( k, input[ k ] );
											}
										}
										if ( clear )
										{
											$('<a class="' + _c.btn + ' ' + _c.clear + '" href="#" />')
												.appendTo( $srch )
												.on( _e.click + '-searchfield',
													function( e )
													{
														e.preventDefault();
														$inpt
															.val( '' )
															.trigger( _e.keyup + '-searchfield' );
													}
												);
										}
										if ( form )
										{
											for ( k in form )
											{
												$srch.attr( k, form[ k ] );
											}
											if ( submit && !clear )
											{
												$('<a class="' + _c.btn + ' ' + _c.next + '" href="#" />')
													.appendTo( $srch )
													.on( _e.click + '-searchfield',
														function( e )
														{
															e.preventDefault();
															$srch.submit();
														}
													);
											}
										}

										if ( $panl.hasClass( _c.search ) )
										{
											$panl.replaceWith( $srch );
										}
										else
										{
											$panl.prepend( $srch )
												.addClass( _c.hassearch );
										}
									}

									if ( opts.noResults )
									{
										var inPanel = $panl.closest( '.' + _c.panel ).length;

										//	Not in a panel
										if ( !inPanel )
										{
											$panl = that.$pnls.children( '.' + _c.panel ).first();
										}

										//	Add no-results message
										if ( !$panl.children( '.' + _c.noresultsmsg ).length )
										{
											var $lst = $panl.children( '.' + _c.listview ).first();

											$( '<div class="' + _c.noresultsmsg + ' ' + _c.hidden + '" />' )
												.append( $[ _PLUGIN_ ].i18n( opts.noResults ) )
												[ $lst.length ? 'insertAfter' : 'prependTo' ]( $lst.length ? $lst : $panl );
										}
									}
								}
						);


						//	Search through list items
						if ( opts.search )
						{

							if ( opts.resultsPanel.add )
							{
								opts.showSubPanels = false;

								var $rpnl = this.$pnls.children( '.' + _c.resultspanel );
								if ( !$rpnl.length )
								{
									$rpnl = $( '<div class="' + _c.panel + ' ' + _c.resultspanel + ' ' + _c.noanimation + ' ' + _c.hidden + '" />' )
										.appendTo( this.$pnls )
										.append( '<div class="' + _c.navbar + ' ' + _c.hidden + '"><a class="' + _c.title + '">' + $[ _PLUGIN_ ].i18n( opts.resultsPanel.title ) + '</a></div>' )
										.append( '<ul class="' + _c.listview + '" />' )
										.append( this.$pnls.find( '.' + _c.noresultsmsg ).first().clone() );

									this.initPanels( $rpnl );
								}
							}

							this.$menu
								.find( '.' + _c.search )
								.each(
									function()
									{
										var $srch 	= $(this),
											inPanel = $srch.closest( '.' + _c.panel ).length;

										var $pnls, $panl;

										//	In a panel
										if ( inPanel )
										{
											$pnls = $srch.closest( '.' + _c.panel );
											$panl = $pnls;
										}

										//	Not in a panel
										else
										{
											$pnls = $('.' + _c.panel, that.$menu);
											$panl = that.$menu;
										}

										if ( opts.resultsPanel.add )
										{
											$pnls = $pnls.not( $rpnl );
										}

										var $inpt = $srch.children( 'input' ),
											$itms = that.__findAddBack( $pnls, '.' + _c.listview ).children( 'li' ),
											$dvdr = $itms.filter( '.' + _c.divider ),
											$rslt = that.__filterListItems( $itms );

										var _anchor = 'a',
											_both = _anchor + ', span';


										var query = '';
										var search = function()
										{

											var q = $inpt.val().toLowerCase();
											if ( q == query )
											{
												return;
											}
											query = q;


											if ( opts.resultsPanel.add )
											{
												$rpnl
													.children( '.' + _c.listview )
													.empty();
											}

											//	Scroll to top
											$pnls.scrollTop( 0 );

											//	Search through items
											$rslt
												.add( $dvdr )
												.addClass( _c.hidden )
												.find( '.' + _c.fullsubopensearch )
												.removeClass( _c.fullsubopen + ' ' +  _c.fullsubopensearch );

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

														var txt = $item.data( _d.searchtext ) || $item.children( _search ).text();
														if ( txt.toLowerCase().indexOf( query ) > -1 )
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
																		$su = $li.data( _d.child );

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

											//	All results in one panel
											if ( opts.resultsPanel.add )
											{
												if ( query === '' )
												{
													this.closeAllPanels();
													this.openPanel( this.$pnls.children( '.' + _c.subopened ).last() );
												}
												else
												{
													var $itms = $();
													$pnls
														.each(
															function()
															{
																var $i = that.__filterListItems( $(this).find( '.' + _c.listview ).children() ).not( '.' + _c.hidden ).clone( true );
																if ( $i.length )
																{
																	if ( opts.resultsPanel.dividers )
																	{
																		$itms = $itms.add( '<li class="' + _c.divider + '">' + $(this).children( '.' + _c.navbar ).children( '.' + _c.title ).text() + '</li>' );
																	}
																	$itms = $itms.add( $i );
																}
															}
														);

													$itms
														.find( '.' + _c.next )
														.remove();

													$rpnl
														.children( '.' + _c.listview )
														.append( $itms );

													this.openPanel( $rpnl );
												}
											}

											//	Update parent for submenus
											else
											{

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
																else if ( !inPanel )
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
											}

											//	Show/hide no results message
											$panl.find( '.' + _c.noresultsmsg )[ $rslt.not( '.' + _c.hidden ).length ? 'addClass' : 'removeClass' ]( _c.hidden );

											//	Update for other addons
											this.trigger( 'updateListview' );

										};

										$inpt
											.off( _e.keyup + '-' + _ADDON_ + ' ' + _e.change + '-' + _ADDON_ )
											.on(  _e.keyup + '-' + _ADDON_,
												function( e )
												{
													if ( !preventKeypressSearch( e.keyCode ) )
													{
														search.call( that );
													}
												}
											)
											.on( _e.change + '-' + _ADDON_,
												function( e )
												{
													search.call( that );
												}
											);

										var $btn = $srch.children( '.' + _c.btn );
										if ( $btn.length )
										{
											$inpt
												.on( _e.keyup + '-' + _ADDON_,
													function( e )
													{
														$btn[ $inpt.val().length ? 'removeClass' : 'addClass' ]( _c.hidden );
													}
												);
										}
										$inpt.trigger( _e.keyup + '-' + _ADDON_ );
									}
								);
						}
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

			_c.add( 'clear search hassearch resultspanel noresultsmsg noresults nosubresults fullsubopensearch' );
			_d.add( 'searchtext' );
			_e.add( 'change keyup' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 			: false,
		addTo			: 'panels',
		placeholder		: 'Search',
		noResults		: 'No results found.',
		resultsPanel 	: {
			add 			: false,
			dividers		: true,
			title			: 'Search results'
		},
		search			: true,
		showTextItems	: false,
		showSubPanels	: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		clear			: false,
		form			: false,
		input			: false,
		submit			: false
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