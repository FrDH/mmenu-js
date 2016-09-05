/*	
 * Debugger for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin to debug your menu.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu';
	
	if ( typeof console == 'undefined' )
	{
		return false;
	}

	var _msg = 0,
		_cns = document[ _PLUGIN_ + '_console' ] || console || { info: function() {}, log: function() {}, warn: function() {} };

	var glbl = $[ _PLUGIN_ ].glbl,
		_c = $[ _PLUGIN_ ]._c,
		_d = $[ _PLUGIN_ ]._d,
		_e = $[ _PLUGIN_ ]._e;


	function debug( msg )
	{
		_msg++;
		_cns.log( 'MMENU: ' + msg );
	}
	function deprc( depr, repl, vers )
	{
		var msg = 'MMENU: ' + depr + ' is deprecated';

		if ( vers )
		{
			msg += ' as of version ' + vers;
		}
		if ( repl )
		{
			msg += ', use ' + repl + ' instead';
		}
		msg += '.';

		_msg++;
		_cns.warn( msg );
	}


	$[ _PLUGIN_ ].prototype.___deprecated = function()
	{
		_msg = 0;

		var extensions = this.opts.extensions.join( ' ' );
		var arr, a, b, l;


		//	Options 5.7
		if ( ( typeof this.opts.currentItem == 'boolean' && this.opts.currentItem )
			|| ( typeof this.opts.currentItem == 'object' && this.opts.currentItem.find )
		) {
			deprc( 'The "currentItem" add-on', '"setSelected.current": "detect"', '5.7' );
		}

		//	Add-ons 5.7
		if ( typeof this.opts.dragOpen != 'undefined' )
		{
			deprc( 'The "dragOpen" add-on', 'the "drag" add-on', '5.7' );
		}
		if ( typeof this.opts.dragClose != 'undefined' )
		{
			deprc( 'The "dragClose" add-on', 'the "drag" add-on', '5.7' );
		}

		//	Extensions 5.7
		if ( extensions.indexOf( 'pageshadow' ) > -1 )
		{
			deprc( 'The "pageshadow" extension', '"shadow-page"', '5.7' );
		}
		if ( extensions.indexOf( 'panelshadow' ) > -1 )
		{
			deprc( 'The "panelshadow" extension', '"shadow-panels"', '5.7' );
		}
		if ( extensions.indexOf( 'leftSubpanels' ) > -1 )
		{
			deprc( 'The "leftSubpanels" extension', 'the "rtl" add-on', '5.7' );	
		}

		//	API 5.7
		//	Won't work untill the backward compat has been removed
		// this.bind( 'init',
		// 	function()
		// 	{
		// 		deprc( 'The API method "init"', '"initPanels"', '5.7' );
		// 	}
		// );


		//	Configuration 5.6
		if ( typeof this.conf.searchfield.form == 'boolean' && this.conf.searchfield.form )
		{
			deprc( 'Boolean "true" for the "searchfield.form" configuration option', 'an object', '5.6' );
		}

		//	Options 5.5
		if ( this.opts.offCanvas )
		{
			if ( typeof this.opts.offCanvas.modal != 'undefined' )
			{
				deprc( 'The option "offCanvas.modal"', '"offCanvas.blockUI"', '5.5' );
			}
		}
		if ( typeof this.opts.onClick.blockUI != 'undefined' )
		{
			deprc( 'The option "onClick.blockUI"', null, '5.5' );
		}

		arr = {
			'menu' 		: [ 'zoom', 'slide', 'fade' ],
			'panels'	: [ 'zoom', 'slide' ],
			'listitems'	: [ 'slide' ]
		};
		for ( a in arr )
		{
			for ( b in arr[ a ] )
			{
				var _o = 'effect-' + arr[ a ][ b ] + '-' + a,
					_n = 'effect-' + a + '-' + arr[ a ][ b ];

				if ( extensions.indexOf( _o ) > -1 )
				{
					deprc( 'The "' + _o + '" extension', '"' + _n + '"', '5.5' );	
				}
			}
		}

		//	Options 5.2
		if ( typeof this.opts.searchfield != 'undefined' )
		{
			if ( this.opts.searchfield.addTo == 'menu' )
			{
				deprc( 'The value "menu" for the "searchfield.addTo" option', 'the "navbars" add-on', '5.2' );
			}
		}

		//	Options 5.1
		if ( typeof this.opts.header != 'undefined' )
		{
			deprc( 'The "header" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.opts.footer != 'undefined' )
		{
			deprc( 'The "footer" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( extensions.indexOf( 'effect-slide' ) > -1 &&
			 extensions.indexOf( 'effect-menu-slide' ) == -1
		) {
			deprc( 'The "effect-slide" extension', '"effect-menu-slide"', '5.1' );	
		}

		//	Configuration 5.1
		if ( typeof this.conf.classNames.header != 'undefined' )
		{
			deprc( 'The "header" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.conf.classNames.footer != 'undefined' )
		{
			deprc( 'The "footer" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.conf.classNames.buttonbars != 'undefined' )
		{
			deprc( 'The "buttonbars" add-on', false, '5.1' );
		}

		//	HTML 5.1
		if ( this.$menu.find( '.Buttonbar' ).length )
		{
			deprc( 'The buttonbars add-on', false, '5.1' );
		}


		//	Options 5.0
		if ( typeof this.opts.labels != 'undefined' )
		{
			deprc( 'The "labels" add-on', '"dividers"', '5.0' );
		}
		if ( typeof this.opts.classes != 'undefined' )
		{
			deprc( 'The option "classes"', '"extensions"', '5.0' );
		}
		if ( typeof this.opts.searchfield != 'undefined' )
		{
			if ( typeof this.opts.searchfield.showLinksOnly != 'undefined' )
			{
				deprc( 'The option "searchfield.showLinksOnly"', '"!searchfield.showTextItems"', '5.0' );
			}
		}
		
		//	Configuration 5.0
		if ( typeof this.conf.classNames.label != 'undefined' )
		{
			deprc( 'The configuration option "classNames.labels"', '"classNames.dividers"', '5.0' );
		}
		
		//	HTML 5.0
		if ( this.$menu.find( '.Label' ).length )
		{
			deprc( 'The classname "Label"', '"Divider"', '5.0' );
		}
		if ( $( '.FixedTop' ).length )
		{
			deprc( 'The classname "FixedTop"', '"Fixed"', '5.0' );
		}
		if ( $( '.FixedBottom' ).length )
		{
			deprc( 'The classname "FixedBottom"', '"Fixed"', '5.0' );
		}

		//	Custom events 5.0
		this.$menu.on(
			'setPage setPage.mm setSelected setSelected.mm open open.mm opening opening.mm opened opened.mm close close.mm closing closing.mm closed closed.mm toggle toggle.mm',
			function( e )
			{
				deprc( 'The custom event "' + e.type + '"', 'the API', '5.0' );
			}
		);


		//	Vendors 4.4
		if ( typeof 'Hammer' == 'function' && Hammer.VERSION < 2 )
		{
			deprc( 'Older version of the Hammer library', 'version 2 or newer', '4.4' );
			return;
		}


		//	Options 4.3
		for ( a = [ 'position', 'zposition', 'modal', 'moveBackground' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.opts[ a[ b ] ] != 'undefined' )
			{
				deprc( 'The option "' + a[ b ] + '"', 'offCanvas.' + a[ b ], '4.3' );
			}
		}

		//	Configuration 4.3
		for ( a = [ 'panel', 'list', 'selected', 'label', 'spacer' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.conf[ a[ b ] + 'Class' ] != 'undefined' )
			{
				deprc( 'The configuration option "' + a[ b ] + 'Class"', 'classNames.' + a[ b ], '4.3' );
			}
		}
		if ( typeof this.conf.counterClass != 'undefined' )
		{
			deprc( 'The configuration option "counterClass"', 'classNames.counters.counter', '4.3' );
		}
		if ( typeof this.conf.collapsedClass != 'undefined' )
		{
			deprc( 'The configuration option "collapsedClass"', 'classNames.labels.collapsed', '4,3' );
		}
		if ( typeof this.conf.header != 'undefined' )
		{
			for ( a = [ 'panelHeader', 'panelNext', 'panelPrev' ], b = 0, l = a.length; b < l; b++ )
			{
				if ( typeof this.conf.header[ a[ b ] + 'Class' ] != 'undefined' )
				{
					deprc( 'The configuration option "header.' + a[ b ] + 'Class"', 'classNames.header.' + a[ b ], '4.3' );
				}
			}
		}
		for ( a = [ 'pageNodetype', 'pageSelector', 'menuWrapperSelector', 'menuInjectMethod' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.conf[ a[ b ] ] != 'undefined' )
			{
				deprc( 'The configuration option "' + a[ b ] + '"', 'offCanvas.' + a[ b ], '4.3' );
			}
		}


		//	Options 4.2
		if ( this.opts.offCanvas )
		{
			if ( this.opts.offCanvas.position == 'top' || this.opts.offCanvas.position == 'bottom' )
			{
				if ( this.opts.offCanvas.zposition == 'back' || this.opts.offCanvas.zposition == 'next' )
				{
					deprc( 'Using offCanvas.position "' + this.opts.offCanvas.position + '" in combination with offCanvas.zposition "' + this.opts.offCanvas.zposition + '"', 'offCanvas.zposition "front"', '4.2' );
				}
			}
		}


		//	Options 4.1
		if ( this.opts.onClick && typeof this.opts.onClick.setLocationHref != 'undefined' )
		{
			deprc( 'The option "onClick.setLocationHref"', '!onClick.preventDefault', '4.1' );
		}

		//	Configuration 4.1
		if ( typeof this.conf.panelNodeType != 'undefined' )
		{
			deprc( 'The configuration option "panelNodeType"', 'panelNodetype', '4.1' );
		}


		//	log results
		if ( _msg > 0 )
		{
			_cns.info( 'MMENU: Found ' + _msg + ' deprecated warning' + ( _msg > 1 ? 's' : '' ) + ' (listed above).' );
		}
	};



	$[ _PLUGIN_ ].prototype.___debug = function()
	{
		_msg = 0;

		//	non-available add-ons
		for ( var a = [ 'autoHeight', 'backButton', 'columns', 'counters', 'dividers', 'dragOpen', 'dropdown', 'iconPanels', 'navbars', 'offCanvas', 'rtl', 'screenReader', 'scrollBugFix', 'searchfield', 'sectionIndexer', 'setSelected', 'toggles' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.opts[ a[ b ] ] != 'undefined' )
			{
				if ( typeof $[ _PLUGIN_ ].addons[ a[ b ] ] == 'undefined' )
				{
					debug( 'The "' + a[ b ] + '" add-on is not available.' );
				}
			}
		}
		if ( typeof $[ _PLUGIN_ ].addons.searchfield == 'undefined' )
		{
			if ( typeof this.opts.searchfield != 'undefined' )
			{
				debug( 'The "searchfield" add-on is not available.' );
			}
			else if ( typeof this.opts.navbars != 'undefined' )
			{
				if ( this.opts.navbars instanceof Array )
				{
					for( var n = 0; n < this.opts.navbars.length; n++ )
					{
						if ( this.opts.navbars[ n ].content instanceof Array )
						{
							for ( var c = 0; c < this.opts.navbars[ n ].content.length; c++ )
							{
								if ( this.opts.navbars[ n ].content[ c ] == 'searchfield' )
								{
									debug( 'The "searchfield" add-on is not available.' );
								}
							}
						}
					}
				}
			}
		}

		//	Options 5.6
		if ( this.opts.searchfield.addTo != 'menu' )
		{
			if ( this.opts.resultsPanel && this.opts.resultsPanel.add )
			{
				debug( 'Using the "searchfield.resultsPanel" option requires the searchfield to be added to a navbar.' );
			}
		}

		//	Configuration 5.6
		if ( this.conf.searchfield.submit )
		{
			if ( !this.conf.searchfield.form )
			{
				debug( 'The "searchfield.submit" configuration option requires the "searchfield.form" configuration option to be set.' );
			}
			if ( !this.conf.searchfield.clear )
			{
				debug( 'It is not possible to use both the "searchfield.clear" and the "searchfield.submit" configuration options.' );
			}
		}

		//	Compat between options, extensions and add-ons
		var extensions  = this.opts.extensions,
			position	= false,
			zposition	= false;

		if ( this.opts.offCanvas )
		{
			position	= this.opts.offCanvas.position;
			zposition	= this.opts.offCanvas.zposition;
		}

		//	background color
		if ( zposition == 'back' )
		{
			switch( $('body').css( 'background-color' ) )
			{
				case '':
				case 'transparent':
				case 'none':
				case 'rgba(0,0,0,0)':
				case 'rgba( 0, 0, 0, 0 )':
				case 'rgba( 0,0,0,0 )':
				case 'rgba(0, 0, 0, 0)':
					debug( 'Set a background-color for the <BODY />.' );
					break;
			}
		}

		//	positioning + autoheight
		if ( position == 'left' || position == 'right' )
		{
			if ( this.opts.autoHeight && this.opts.autoHeight.height != 'default' )
			{
				if ( !this.opts.dropdown.drop )
				{
					debug( 'Don\'t use the "autoHeight" option with the "offCanvas.position" option set to "' + position + '".' );
				}
			}
		}

		//	positioning + dropdown
		if ( this.opts.dropdown.drop )
		{
			if ( position && zposition )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "dropdown" option with the "offCanvas.position" option set to "' + position + '".' );
				}
				else if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "dropdown" option with the "offCanvas.zposition" option set to "' + position + '".' );
				}
			}
		}

		//	positioning + popup
		if ( extensions.indexOf( 'mm-popup' ) > -1 )
		{
			if ( position && zposition )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "popup" extension with the "offCanvas.position" option set to "' + position + '".' );
				}
				else if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "popup" extension with the "offCanvas.zposition" option set to "' + position + '".' );
				}
			}
		}
		

		//	incompattible with iconbar
		var fxSlide 	= ( extensions.indexOf( 'mm-effect-menu-slide' ) 	> -1 ),
			fxZoom		= ( extensions.indexOf( 'mm-effect-menu-zoom' ) 	> -1 ),
			fxZoomPnls	= ( extensions.indexOf( 'mm-effect-panels-zoom' ) > -1 ),
			iconbar		= ( $[ _PLUGIN_ ].glbl.$page && parseInt( $[ _PLUGIN_ ].glbl.$page.css( 'padding-right' ) ) > 0 );

		if ( iconbar )
		{
			//	vertical submenus
			if ( !this.opts.slidingSubmenus )
			{
				debug( 'Don\'t use the "iconbar" extension in combination with the "slidingSubmenus" option set to "false".' );
			}

			//	iconbar + effects
			if ( fxSlide || fxZoom )
			{
				debug( 'Don\'t use the "iconbar" extension in combination with the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect.' );
			}
			
			//	iconbar + (z)position
			if ( this.opts.offCanvas )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "iconbar" extension in combination with the "offCanvas.position" option set to "' + position + '".' );
				}
				if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "iconbar" extension in combination with the "offCanvas.zposition" option set to "' + zposition + '".' );
				}
			}
		}

		//	effects + vertical submenus
		if ( fxZoomPnls && !this.opts.slidingSubmenus )
		{
			debug( 'Don\'t use the "panels-zoom" effect in combination with the "slidingSubmenus" option set to "false".' );
		}

		//	effects +  onCanvas / (z)position
		if ( fxSlide || fxZoom )
		{
			if ( this.opts.offCanvas )
			{
				if ( position == 'top' || position == 'bottom' )
				{
					debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "offCanvas.position" option set to "' + position + '".' );
				}
				if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "offCanvas.zposition" option set to "' + zposition + '".' );
				}
			}
			else
			{
				debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "offCanvas" option set to "false".' );
			}
		}


		//	log results
		if ( _msg > 0 )
		{
			_cns.info( 'MMENU: Found ' + _msg + ' debug warning' + ( _msg > 1 ? 's' : '' ) + ' (listed above).' );
		}
	};


})( jQuery );