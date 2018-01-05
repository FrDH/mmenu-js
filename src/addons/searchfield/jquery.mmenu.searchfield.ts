/*	
 * jQuery mmenu searchfield add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'searchfield';


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
			if ( typeof opts.panel == 'boolean' )
			{
				opts.panel = {
					add: opts.panel
				};
			}
			if ( typeof opts.panel != 'object' )
			{
				opts.panel = {};
			}


			if ( !opts.add )
			{
				return;
			}


			//	Extend logical options
			if ( opts.addTo == 'panel' )
			{
				opts.panel.add = true;
			}
			if ( opts.panel.add )
			{
				opts.showSubPanels = false;

				if ( opts.panel.splash )
				{
					opts.cancel = true;
				}
			}


			//	Extend from default options
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );
			conf = this.conf[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].configuration[ _ADDON_ ], conf );


			//	Blur searchfield
			this.bind( 'close:start',
				function()
				{
					this.$menu
						.find( '.' + _c.searchfield )
						.children( 'input' )
						.blur();
				}
			);
			
			this.bind( 'initPanels:after',
				function( $pnls )
				{
					var $spnl = $();

					//	Add the search panel
					if ( opts.panel.add )
					{
						$spnl = this._initSearchPanel( $pnls );
					}

					//	Add the searchfield
					var $field;
					switch( opts.addTo )
					{
						case 'panels':
							$field = $pnls;
							break;

						case 'panel':
							$field = $spnl;
							break;

						default:
							$field = this.$menu.find( opts.addTo );
							break;
					}

					$field
						.each(
							function()
							{
								var $srch = that._initSearchfield( $(this) );

								if ( opts.search )
								{
									that._initSearching( $srch );
								}
							}
						);


					//	Add the no-results message
					if ( opts.noResults )
					{
						var $results = ( opts.panel.add ) ? $spnl : $pnls;
						$results
							.each(
								function()
								{
									that._initNoResultsMsg( $(this) );
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

			_c.add( 'searchfield' );
			_d.add( 'searchfield' );
			_e.add( 'input focus blur' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {

			if ( $a.hasClass( _c.searchfield + '__btn' ) )
			{
				//	Clicking the clear button
				if ( $a.hasClass( _c.btn + '_clear' ) )
				{
					var $inpt = $a.closest( '.' + _c.searchfield ).find( 'input' );
					$inpt.val( '' );
					this.search( $inpt );

					return true;
				}

				//	Clicking the submit button
				if ( $a.hasClass( _c.btn + '_next' ) )
				{
					$a.closest( '.' + _c.searchfield )
						.submit();

					return true;
				}
			}
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add 			: false,
		addTo			: 'panels',
		noResults		: 'No results found.',
		placeholder		: 'Search',
		panel 			: {
			add 			: false,
			dividers		: true,
			fx 				: 'none',
			id				: null,
			splash			: null,
			title			: 'Search'
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


	$[ _PLUGIN_ ].prototype._initSearchPanel = function( $panels )
	{
		var opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];


		//	Only once
		if ( this.$pnls.children( '.' + _c.panel + '_search' ).length )
		{
			return $();
		}


		var $spnl = $( '<div class="' + _c.panel + '_search " />' )
			.append( '<ul />' )
			.appendTo( this.$pnls );

		if ( opts.panel.id )
		{
			$spnl.attr( 'id', opts.panel.id );
		}
		if ( opts.panel.title )
		{
			$spnl.attr( 'data-mm-title', opts.panel.title );
		}

		switch ( opts.panel.fx )
		{
			case false:
				break;

			case 'none':
				$spnl.addClass( _c.panel + '_noanimation' );
				break;

			default:
				$spnl.addClass( _c.panel + '_fx-' + opts.panel.fx )
				break;
		}

		//	Add splash content
		if ( opts.panel.splash )
		{
			$spnl.append( '<div class="' + _c.panel + '__searchsplash">' + opts.panel.splash + '</div>' );
		}

		this._initPanels( $spnl );

		return $spnl;
	};

	$[ _PLUGIN_ ].prototype._initSearchfield = function( $wrpr )
	{
		var opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];

	
		//	No searchfield in vertical submenus	
		if ( $wrpr.parent( '.' + _c.listitem + '_vertical' ).length )
		{
			return;
		}

		//	Only one searchfield per panel
		if (  $wrpr.find( '.' + _c.searchfield ).length )
		{
			return;
		}


		var $srch = $( '<' + ( conf.form ? 'form' : 'div' ) + ' class="' + _c.searchfield + '" />' ),
			$inpd = $( '<div class="' + _c.searchfield + '__input" />' ),
			$inpt = $( '<input placeholder="' + $[ _PLUGIN_ ].i18n( opts.placeholder ) + '" type="text" autocomplete="off" />' );

		$inpd.append( $inpt ).appendTo( $srch );


		//	Wrapper already is a searchfield: Replace wrapper with newly build searchfield.
		//		A bit unusual, but the navbar searchfield content uses this
		if ( $wrpr.hasClass( _c.searchfield ) )
		{
			$wrpr.replaceWith( $srch );
		}

		//	Default: in Panel
		else
		{
			$wrpr.prepend( $srch );
			if ( $wrpr.hasClass( _c.panel ) )
			{
				$wrpr.addClass( _c.panel + '_has-searchfield' );
			}
		}


		//	Add attributes to the input
		addAttributes( $inpt, conf.input );
		

		//	Add the clear button
		if ( conf.clear )
		{
			$('<a class="' + _c.btn + ' ' + _c.btn + '_clear ' + _c.searchfield + '__btn" href="#" />')
				.appendTo( $inpd );
		}


		//	Add attributes and submit to the form
		addAttributes( $srch, conf.form );
		if ( conf.form && conf.submit && !conf.clear )
		{
			$('<a class="' + _c.btn + ' ' + _c.btn + '_next ' + _c.searchfield + '__btn" href="#" />')
				.appendTo( $inpd );
		}

		if ( opts.cancel )
		{
			$('<a href="#" class="' + _c.searchfield + '__cancel">' + $[ _PLUGIN_ ].i18n( 'cancel' ) + '</a>')
				.appendTo( $srch );
		}

		return $srch;
	};

	$[ _PLUGIN_ ].prototype._initSearching = function( $srch )
	{
		var that = this,
			opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];

		var data: any = {};

		//	In searchpanel
		if ( $srch.closest( '.' + _c.panel + '_search' ).length )
		{
			data.$pnls = this.$pnls.find( '.' + _c.panel );
			data.$nrsp = $srch.closest( '.' + _c.panel );
		}

		//	In a panel
		else if (  $srch.closest( '.' + _c.panel ).length )
		{
			data.$pnls = $srch.closest( '.' + _c.panel );
			data.$nrsp = data.$pnls;
		}

		//	Not in a panel
		else
		{
			data.$pnls = this.$pnls.find( '.' + _c.panel );
			data.$nrsp = this.$menu;
		}

		if ( opts.panel.add )
		{
			data.$pnls = data.$pnls.not( '.' + _c.panel + '_search' );
		}

		var $inpt = $srch.find( 'input' ),
			$cncl = $srch.find( '.' + _c.searchfield + '__cancel' ),
			$spnl = this.$pnls.children( '.' + _c.panel + '_search' ),
			$itms = data.$pnls.find( '.' + _c.listitem );

		data.$itms = $itms.not( '.' + _c.listitem + '_divider' );
		data.$dvdr = $itms.filter( '.' + _c.listitem + '_divider' );


		if ( opts.panel.add && opts.panel.splash )
		{
			$inpt
				.off( _e.focus + '-' + _ADDON_ + '-splash' )
				.on(  _e.focus + '-' + _ADDON_ + '-splash',
					function( e )
					{
						that.openPanel( $spnl );
					}
				);
		}
		if ( opts.cancel )
		{
			$inpt
				.off( _e.focus + '-' + _ADDON_ + '-cancel' )
				.on(  _e.focus + '-' + _ADDON_ + '-cancel',
					function( e )
					{
						$cncl.addClass(  _c.searchfield + '__cancel-active' );
					}
				);


			$cncl
				.off( _e.click + '-' + _ADDON_ + '-splash' )
				.on(  _e.click + '-' + _ADDON_ + '-splash',
					function( e )
					{
						e.preventDefault();
						$(this).removeClass( _c.searchfield + '__cancel-active' );

						if ( $spnl.hasClass( _c.panel + '_opened' ) )
						{
							that.openPanel( that.$pnls.children( '.' + _c.panel + '_opened-parent' ).last() );
						}
					}
				);
		}

		if ( opts.panel.add && opts.addTo == 'panel' )
		{
			this.bind( 'openPanel:finish',
				function( $panel )
				{
					if ( $panel[ 0 ] === $spnl[ 0 ] )
					{
						$inpt.focus();
					}
				}
			);
		}


		$inpt
			.data( _d.searchfield, data )
			.off( _e.input + '-' + _ADDON_ )
			.on(  _e.input + '-' + _ADDON_,
				function( e )
				{
					if ( !preventKeypressSearch( e.keyCode ) )
					{
						that.search( $inpt );
					}
				}
			);


		//	Fire once initially
		this.search( $inpt );
	};	

	$[ _PLUGIN_ ].prototype._initNoResultsMsg = function( $wrpr )
	{
		var opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];

		//	Not in a panel
		if ( !$wrpr.closest( '.' + _c.panel ).length )
		{
			$wrpr = this.$pnls.children( '.' + _c.panel ).first();
		}

		//	Only once
		if ( $wrpr.children( '.' + _c.panel + '__noresultsmsg' ).length )
		{
			return;
		}

		//	Add no-results message
		var $lst = $wrpr.children( '.' + _c.listview ).first(),
			$msg = $( '<div class="' + _c.panel + '__noresultsmsg ' + _c.hidden + '" />' )
				.append( $[ _PLUGIN_ ].i18n( opts.noResults ) );

		if ( $lst.length )
		{
			$msg.insertAfter( $lst );
		}
		else
		{
			$msg.prependTo( $wrpr );
		}
	}

	$[ _PLUGIN_ ].prototype.search = function( $inpt, query )
	{
		var that = this,
			opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];


		$inpt = $inpt || this.$menu.find( '.' + _c.searchfield ).chidren( 'input' ).first();
		query = query || $inpt.val();
		query = query.toLowerCase().trim();

		var _anchor = 'a',
			_both   = 'a, span';

		var data  = $inpt.data( _d.searchfield );
		
		var $srch = $inpt.closest( '.' + _c.searchfield ),
			$btns = $srch.find( '.' + _c.btn ),
			$spnl = this.$pnls.children( '.' + _c.panel + '_search' ),
			$pnls = data.$pnls,
			$itms = data.$itms,
			$dvdr = data.$dvdr,
			$nrsp = data.$nrsp;




		//	Reset previous results
		$itms
			.removeClass( _c.listitem + '_nosubitems' )
			.find( '.' + _c.btn + '_fullwidth-search' )
			.removeClass( _c.btn + '_fullwidth-search' + ' ' +  _c.btn + '_fullwidth' );

		$spnl.children( '.' + _c.listview ).empty();
		$pnls.scrollTop( 0 );


		//	Search
		if ( query.length )
		{

			//	Initially hide all listitems
			$itms
				.add( $dvdr )
				.addClass( _c.hidden );


			//	Re-show only listitems that match
			$itms
				.each(
					function()
					{
						var $item = $(this),
							_search = _anchor;

						if ( opts.showTextItems || ( opts.showSubPanels && $item.find( '.' + _c.btn + '_next' ) ) )
						{
							_search = _both;
						}
						if ( $item.children( _search ).not( '.' + _c.btn + '_next' ).text().toLowerCase().indexOf( query ) > -1 )
						{
							$item.removeClass( _c.hidden );
						}
					}
				);


			//	Show all mached listitems in the search panel
			if ( opts.panel.add )
			{
				//	Clone all matched listitems into the search panel
				var $lis = $();
				$pnls
					.each(
						function()
						{
							var $li = that.__filterListItems( $(this).find( '.' + _c.listitem ) ).clone( true );
							if ( $li.length )
							{
								if ( opts.panel.dividers )
								{
									$lis = $lis.add( '<li class="' + _c.listitem + ' ' + _c.listitem + '_divider' + '">' + $(this).find( '.' + _c.navbar + '__title' ).text() + '</li>' );
								}
								$lis = $lis.add( $li );
							}
						}
					);


				//	Remove toggles, checks and open buttons
				$lis
					.find( '.' + _c.mm( 'toggle' ) ).remove().end()
					.find( '.' + _c.mm( 'check' ) ).remove().end()
					.find( '.' + _c.btn ).remove();


				//	Add to the search panel
				$spnl
					.children( '.' + _c.listview )
					.append( $lis );


				//	Open the search panel
				this.openPanel( $spnl );
			}

			else
			{

				//	Also show listitems in sub-panels for matched listitems
				if ( opts.showSubPanels )
				{
					$pnls.each(
						function( i )
						{
							var $panl = $(this);
							that.__filterListItems( $panl.find( '.' + _c.listitem ) )
								.each(
									function()
									{
										var $li = $(this),
											$su = $li.data( _d.child );

										if ( $su )
										{
											$su.find( '.' + _c.listview ).children().removeClass( _c.hidden );
										}
									}
								);
						}
					);
				}


				//	Update parent for sub-panel
				$( $pnls.get().reverse() )
					.each(
						function( i )
						{
							var $panl = $(this),
								$prnt = $panl.data( _d.parent );

							if ( $prnt )
							{
								//	The current panel has mached listitems
								if ( that.__filterListItems( $panl.find( '.' + _c.listitem ) ).length )
								{
									//	Show parent
									if ( $prnt.hasClass( _c.hidden ) )
									{
										$prnt
											.removeClass( _c.hidden )
											.children( '.' + _c.btn + '_next' )
											.not( '.' + _c.btn + '_fullwidth' )
											.addClass( _c.btn + '_fullwidth' )
											.addClass( _c.btn + '_fullwidth-search' );
									}
								}

								else if ( !$inpt.closest( '.' + _c.panel ).length )
								{
									if ( $panl.hasClass( _c.panel + '_opened' ) || 
										$panl.hasClass( _c.panel + '_opened-parent' )
									) {
										//	Compensate the timeout for the opening animation
										setTimeout(
											function()
											{
												that.openPanel( $prnt.closest( '.' + _c.panel ) );
											}, ( i + 1 ) * ( that.conf.openingInterval * 1.5 )
										);
									}
									$prnt.addClass( _c.listitem + '_nosubitems' );
								}
							}
						}
					);


				//	Show first preceeding divider of parent
				this.__filterListItems( $pnls.find( '.' + _c.listitem ) )
					.each(
						function()
						{
							$(this).prevAll( '.' + _c.listitem + '_divider' )
								.first()
								.removeClass( _c.hidden );
						}
					);
			}


			//	Show submit / clear button
			$btns.removeClass( _c.hidden );


			//	Show/hide no results message
			$nrsp.find( '.' + _c.panel + '__noresultsmsg' )[ $itms.not( '.' + _c.hidden ).length ? 'addClass' : 'removeClass' ]( _c.hidden );


			if ( opts.panel.add )
			{
				//	Hide splash
				if ( opts.panel.splash )
				{
					$spnl.find( '.' + _c.panel + '__searchsplash' ).addClass( _c.hidden );
				}

				//	Re-show original listitems when in search panel
				$itms
					.add( $dvdr )
					.removeClass( _c.hidden );
			}
		}


		//	Don't search
		else
		{

			//	Show all items
			$itms
				.add( $dvdr )
				.removeClass( _c.hidden );


			//	Hide submit / clear button
			$btns.addClass( _c.hidden );

		
			//	Hide no results message
			$nrsp.find( '.' + _c.panel + '__noresultsmsg' ).addClass( _c.hidden );


			if ( opts.panel.add )
			{
				//	Show splash
				if ( opts.panel.splash )
				{
					$spnl.find( '.' + _c.panel + '__searchsplash' ).removeClass( _c.hidden );
				}

				//	Close panel 
				else if ( !$inpt.closest( '.' + _c.panel + '_search' ).length )
				{
					this.openPanel( this.$pnls.children( '.' + _c.panel + '_opened-parent' ).last() );
				}
			}
		}


		//	Update for other addons
		this.trigger( 'updateListview' );
	};

	function addAttributes( $el, attr )
	{
		if ( attr )
		{
			for ( var a in attr )
			{
				$el.attr( a, attr[ a ] );
			}
		}
	}

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