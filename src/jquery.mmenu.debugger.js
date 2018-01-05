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

	var _cns = document[ _PLUGIN_ + '_console' ] || console || { info: function() {}, log: function() {}, warn: function() {} };

	var glbl = $[ _PLUGIN_ ].glbl,
		_c = $[ _PLUGIN_ ]._c,
		_d = $[ _PLUGIN_ ]._d,
		_e = $[ _PLUGIN_ ]._e;


	function debug( msg )
	{
		_cns.warn( 'MMENU: ' + msg );
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

		_cns.warn( msg );
	}


	$[ _PLUGIN_ ].prototype.___deprecated = function()
	{
		var ext = this.opts.extensions,
			extensions = '';

		if ( ext.constructor === Array )
		{
			ext = {
				'all' : ext
			};
		}
		for ( var e in ext )
		{
			extensions += ext[ e ].join( ' ' ) + ' ';
		}

		var arr, a, b, l;


		//	Opties 7.0
		if ( typeof this.opts.initMenu == 'function' )
		{
			deprc( 'The option "initMenu"', '"hooks.initMenu:before" or "hooks.initMenu:after"', '7.0' );
		}
		if ( typeof this.opts.initPanels == 'function' )
		{
			deprc( 'The option "initPanels"', '"hooks.initPanels:before", "hooks.initPanels:after", "hooks.initPanel:before" or "hooks.initPanel:after"', '7.0' );
		}

		//	Addons 7.0
		if ( this.opts.offCanvas )
		{
			if ( this.opts.offCanvas.position )
			{
				deprc( 'The option "offCanvas.position"', 'the "positioning" extension', '7.0' );
			}
			if ( this.opts.offCanvas.zposition )
			{
				deprc( 'The option "offCanvas.zposition"', 'the "positioning" extension', '7.0' );
			}

			if ( this.opts.searchfield && typeof this.opts.searchfield.resultsPanel != 'undefined' )
			{
				deprc( 'The option "searchfield.resultsPanel"', '"searchfield.panel"', '7.0' );
			}
			
		}

		//	Extensions 7.0
		if ( extensions.indexOf( 'widescreen' ) > -1 )
		{
			deprc( 'The "widescreen" extension', 'the "sidebar" add-on', '7.0' );
		}
		if ( extensions.indexOf( 'iconbar' ) > -1 )
		{
			deprc( 'The "iconbar" extension', 'the "sidebar" add-on', '7.0' );
		}



		//	Options 6.0
		if ( this.opts.counters )
		{
			if ( typeof this.opts.counters.update != 'undefined' )
			{
				deprc( 'The option "counters.update"', '"counters.count"', '6.0' );
			}
		}
		if ( this.opts.navbar && this.opts.navbar.titleLink == 'panel' )
		{
			deprc( 'The value "panel" for the "navbar.titleLink" option', '"parent"', '6.0' );
		}

		//	Extensions 6.0
		if ( extensions.indexOf( 'effect-' ) > -1 )
		{
			deprc( 'The "effect-" prefix for the "effects" extension', '"fx-"', '6.0' );
		}
		if ( extensions.indexOf( 'justfied-listview' ) > -1 )
		{
			deprc( 'The "justified-listview" extension', '"listview-justify"', '6.0' );
		}

		//	Configuration 6.0
		if ( typeof this.conf.offCanvas.menuInjectMethod != 'undefined' )
		{
			if ( this.conf.offCanvas.menuInjectMethod == 'append' ||
				this.conf.offCanvas.menuInjectMethod == 'prepend'
			) {
				deprc( '"' + this.conf.offCanvas.menuInjectMethod + '" for the "offCanvas.menuInjectMethod" configuration option', '"' + this.conf.offCanvas.menuInjectMethod + 'To"', '6.0' );
			}

			deprc( 'The "offCanvas.menuInjectMethod" configuration option', '"offCanvas.menuInsertMethod"', '6.0' );
		}
		if ( typeof this.conf.offCanvas.menuWrapperSelector != 'undefined' )
		{
			deprc( 'The "offCanvas.menuWrapperSelector" configuration option', '"offCanvas.menuInsertSelector"', '6.0' );
		}


		//	Add-ons 5.7
		if ( ( typeof this.opts.currentItem == 'boolean' && this.opts.currentItem )
			|| ( typeof this.opts.currentItem == 'object' && this.opts.currentItem.find )
		) {
			deprc( 'The "currentItem" add-on', '"setSelected.current": "detect"', '5.7' );
		}

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
		this.bind( 'init',
			function()
			{
				deprc( 'The API method "init"', '"initPanels"', '5.7' );
			}
		);


		//	Configuration 5.6
		if ( typeof this.conf.searchfield != "undefined" && typeof this.conf.searchfield.form == 'boolean' && this.conf.searchfield.form )
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
		if ( extensions.indexOf( 'effect-slide' ) > -1 )
		{
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
		for ( a = [ 'pageNodetype', 'pageSelector', 'menuWrapperSelector', 'menuInjectMethod' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.conf[ a[ b ] ] != 'undefined' )
			{
				deprc( 'The configuration option "' + a[ b ] + '"', 'offCanvas.' + a[ b ], '4.3' );
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
	};



	$[ _PLUGIN_ ].prototype.___debug = function()
	{
		//	non-available add-ons
		for ( var a = [
				'offCanvas', 'screenReader', 'scrollBugFix',
				'autoHeight', 'backButton', 'columns', 'counters', 'dividers', 'drag', 'dropdown', 'iconbar', 'iconPanels', 'keyboardNavigation', 'lazySubmenus', 'navbars', 'pageScroll', 'rtl', 'searchfield', 'sectionIndexer', 'setSelected', 'sidebar', 'toggles'
			], b = 0, l = a.length; b < l; b++
		) {
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
			if ( typeof this.opts.navbars != 'undefined' )
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

		//	Configuration 5.6
		if ( typeof this.opts.searchfield != "undefined" && this.conf.searchfield.submit )
		{
			if ( !this.conf.searchfield.form )
			{
				debug( 'The "searchfield.submit" configuration option requires the "searchfield.form" configuration option to be set.' );
			}
			if ( this.conf.searchfield.clear )
			{
				debug( 'It is not possible to use both the "searchfield.clear" and the "searchfield.submit" configuration options.' );
			}
		}

		//	Compat between options, extensions and add-ons
		var position	= false,
			zposition	= false;

		var ext = this.opts.extensions,
			extensions = '';

		if ( ext.constructor === Array )
		{
			ext = {
				'all' : ext
			};
		}
		for ( var e in ext )
		{
			extensions += ext[ e ] + ' ';
		}

		if ( this.opts.offCanvas )
		{
			position	= 'left';
			zposition	= 'back';
		}
		switch( true )
		{
			case extensions.indexOf( 'position-right' ) > -1:
				position = 'right';
				break;

			case extensions.indexOf( 'position-top' ) > -1:
				position = 'top';
				zposition = 'front';
				break;

			case extensions.indexOf( 'position-bottom' ) > -1:
				position = 'bottom';
				zposition = 'front';
				break;
		}
		switch( true )
		{
			case extensions.indexOf( 'position-front' ) > -1:
				zposition = 'front';
				break;
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

		//	positioning + sidebar
		if ( typeof this.opts.sidebar != "undefined" && ( this.opts.sidebar.collapsed.use || this.opts.sidebar.expanded.use ) )
		{
			if ( position && zposition )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "sidebar" add-on with the "position-' + position + '" extension.' );
				}
				else if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "sidebar" add-on with the "position-' + zposition + '" extension.' );
				}
			}
		}

		//	positioning + dropdown
		if ( typeof this.opts.dropdown != "undefined" && this.opts.dropdown.drop )
		{
			if ( position && zposition )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "dropdown" add-on with the "position-' + position + '" extension.' );
				}
				else if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "dropdown" add-on with the "position-' + zposition + '" extension.' );
				}
			}
		}

		//	positioning + popup
		if ( extensions.indexOf( 'popup' ) > -1 )
		{
			if ( position && zposition )
			{
				if ( position != 'left' )
				{
					debug( 'Don\'t use the "popup" extension with the "position-' + position + '" extension.' );
				}
				else if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "popup" extension with the "position-' + zposition + '" extension.' );
				}
			}
		}
		

		//	incompattible with effects
		var fxSlide 	= ( extensions.indexOf( 'mm-fx-menu-slide' ) 	> -1 ),
			fxZoom		= ( extensions.indexOf( 'mm-fx-menu-zoom' ) 	> -1 ),
			fxZoomPnls	= ( extensions.indexOf( 'mm-fx-panels-zoom' ) 	> -1 );


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
					debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "position-' + position + '" extension.' );
				}
				if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "position-' + zposition + '" extension.' );
				}
			}
			else
			{
				debug( 'Don\'t use the "' + ( fxSlide ? 'menu-slide' : 'menu-zoom' ) + '" effect in combination with the "offCanvas" option set to "false".' );
			}
		}
	};


})( jQuery );