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

	var _log 	= document[ _PLUGIN_ + '_debug_log' ] 	|| console.log,
		_warn	= document[ _PLUGIN_ + '_debug_warn' ] 	|| console.warn;

	var glbl = $[ _PLUGIN_ ].glbl,
		_c = $[ _PLUGIN_ ]._c,
		_d = $[ _PLUGIN_ ]._d,
		_e = $[ _PLUGIN_ ]._e;


	function debug( msg )
	{
		_log( 'MMENU: ' + msg );
	};
	function deprecated( depr, repl, vers )
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

		_warn( msg );
	};


	$[ _PLUGIN_ ].prototype.___deprecated = function()
	{

		//	Options 5.1
		if ( typeof this.opts.header != 'undefined' )
		{
			deprecated( 'The "header" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.opts.footer != 'undefined' )
		{
			deprecated( 'The "footer" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( this.opts.extensions.indexOf( 'mm-effect-slide' ) > -1 &&
			 this.opts.extensions.indexOf( 'mm-effect-slide-menu' ) == -1
		) {
			deprecated( 'The "effect-slide" extension', '"effect-slide-menu"', '5.1' );	
		}

		//	Configuration 5.1
		if ( typeof this.conf.classNames.header != 'undefined' )
		{
			deprecated( 'The "header" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.conf.classNames.footer != 'undefined' )
		{
			deprecated( 'The "footer" add-on', 'the "navbars" add-on', '5.1' );
		}
		if ( typeof this.conf.classNames.buttonbars != 'undefined' )
		{
			deprecated( 'The "buttonbars" add-on', false, '5.1' );
		}

		//	HTML 5.1
		if ( this.$menu.find( '.Buttonbar' ).length )
		{
			deprecated( 'The buttonbars add-on', false, '5.1' );
		}


		//	Options 5.0
		if ( typeof this.opts.labels != 'undefined' )
		{
			deprecated( 'The "labels" add-on', '"dividers"', '5.0' );
		}
		if ( typeof this.opts.classes != 'undefined' )
		{
			deprecated( 'The option "classes"', '"extensions"', '5.0' );
		}
		if ( typeof this.opts.searchfield != 'undefined' )
		{
			if ( typeof this.opts.searchfield.showLinksOnly != 'undefined' )
			{
				deprecated( 'The option "searchfield.showLinksOnly"', '"!searchfield.showTextItems"', '5.0' );
			}
		}
		
		//	Configuration 5.0
		if ( typeof this.conf.classNames.label != 'undefined' )
		{
			deprecated( 'The configuration option "classNames.labels"', '"classNames.dividers"', '5.0' );
		}
		
		//	HTML 5.0
		if ( this.$menu.find( '.Label' ).length )
		{
			deprecated( 'The classname "Label"', '"Divider"', '5.0' );
		}
		if ( $( '.FixedTop' ).length )
		{
			deprecated( 'The classname "FixedTop"', '"Fixed"', '5.0' );
		}
		if ( $( '.FixedBottom' ).length )
		{
			deprecated( 'The classname "FixedBottom"', '"Fixed"', '5.0' );
		}

		//	Custom events 5.0
		this.$menu.on(
			'setPage setPage.mm setSelected setSelected.mm open open.mm opening opening.mm opened opened.mm close close.mm closing closing.mm closed closed.mm toggle toggle.mm',
			function( e )
			{
				deprecated( 'The custom event "' + e.type + '"', 'the API', '5.0' );
			}
		)


		//	Vendors 4.4
		if ( typeof 'Hammer' == 'function' && Hammer.VERSION < 2 )
		{
			deprecated( 'Older version of the Hammer library', 'version 2 or newer', '4.4' );
			return;
		}


		//	Options 4.3
		for ( var a = [ 'position', 'zposition', 'modal', 'moveBackground' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.opts[ a[ b ] ] != 'undefined' )
			{
				deprecated( 'The option "' + a[ b ] + '"', 'offCanvas.' + a[ b ], '4.3' );
			}
		}

		//	Configuration 4.3
		for ( var a = [ 'panel', 'list', 'selected', 'label', 'spacer' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.conf[ a[ b ] + 'Class' ] != 'undefined' )
			{
				deprecated( 'The configuration option "' + a[ b ] + 'Class"', 'classNames.' + a[ b ], '4.3' );
			}
		}
		if ( typeof this.conf.counterClass != 'undefined' )
		{
			deprecated( 'The configuration option "counterClass"', 'classNames.counters.counter', '4.3' );
		}
		if ( typeof this.conf.collapsedClass != 'undefined' )
		{
			deprecated( 'The configuration option "collapsedClass"', 'classNames.labels.collapsed', '4,3' );
		}
		if ( typeof this.conf.header != 'undefined' )
		{
			for ( var a = [ 'panelHeader', 'panelNext', 'panelPrev' ], b = 0, l = a.length; b < l; b++ )
			{
				if ( typeof this.conf.header[ a[ b ] + 'Class' ] != 'undefined' )
				{
					deprecated( 'The configuration option "header.' + a[ b ] + 'Class"', 'classNames.header.' + a[ b ], '4.3' );
				}
			}
		}
		for ( var a = [ 'pageNodetype', 'pageSelector', 'menuWrapperSelector', 'menuInjectMethod' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof this.conf[ a[ b ] ] != 'undefined' )
			{
				deprecated( 'The configuration option "' + a[ b ] + '"', 'offCanvas.' + a[ b ], '4.3' );
			}
		}


		//	Options 4.2
		if ( this.opts.offCanvas )
		{
			if ( this.opts.offCanvas.position == 'top' || this.opts.offCanvas.position == 'bottom' )
			{
				if ( this.opts.offCanvas.zposition == 'back' || this.opts.offCanvas.zposition == 'next' )
				{
					deprecated( 'Using offCanvas.position "' + this.opts.offCanvas.position + '" in combination with offCanvas.zposition "' + this.opts.offCanvas.zposition + '"', 'offCanvas.zposition "front"', '4.2' );
				}
			}
		}


		//	Options 4.1
		if ( this.opts.onClick && typeof this.opts.onClick.setLocationHref != 'undefined' )
		{
			deprecated( 'The option "onClick.setLocationHref"', '!onClick.preventDefault', '4.1' );
		}

		//	Configuration 4.1
		if ( typeof this.conf.panelNodeType != 'undefined' )
		{
			deprecated( 'The configuration option "panelNodeType"', 'panelNodetype', '4.1' );
		}
	};



	$[ _PLUGIN_ ].prototype.___debug = function()
	{

		//	non-available add-ons
		var addons = [ 'autoHeight', 'backButton', 'counters', 'dividers', 'dragOpen', 'navbars', 'offCanvas', 'searchfield', 'sectionIndexer', 'toggles' ];
		for ( var a in addons )
		{
			if ( typeof this.opts[ addons[ a ] ] != 'undefined' )
			{
				if ( typeof $[ _PLUGIN_ ].addons[ addons[ a ] ] == 'undefined' )
				{
					debug( 'The "' + addons[ a ] + '" add-on is not available.' );
				}
			}
		}
		
		var position	= false,
			zposition	= false;

		if ( this.opts.offCanvas )
		{
			position	= this.opts.offCanvas.position;
			zposition	= this.opts.offCanvas.zposition;
		}

		//	background color
		if ( zposition == 'back' )
		{
			var bg = $('body').css( 'background-color' );
			if ( typeof bg == 'undefined' || bg  == '' || bg == 'transparent' )
			{
				debug( 'Set a background-color for the <BODY />.' );
			}
		}

		if ( position == 'left' || position == 'right' )
		{
			if ( this.opts.autoHeight && this.opts.autoHeight.height != 'default' )
			{
				debug( 'Don\'t use the "autoHeight" option with the "offCanvas.position" option set to "' + position + '".' );
			}
		}

		//	incompattible with iconbar
		var fxSlide 	= ( this.opts.extensions.indexOf( 'mm-effect-slide-menu' ) 	> -1 ),
			fxZoom		= ( this.opts.extensions.indexOf( 'mm-effect-zoom-menu' ) 	> -1 ),
			fxZoomPnls	= ( this.opts.extensions.indexOf( 'mm-effect-zoom-panels' ) > -1 ),
			iconbar		= ( $[ _PLUGIN_ ].glbl.$page && parseInt( $[ _PLUGIN_ ].glbl.$page.css( 'padding-right' ) ) > 0 );

		if ( iconbar )
		{
			//	iconbar + effects
			if ( fxSlide || fxZoom )
			{
				debug( 'Don\'t use the "iconbar" extension in combination with the "' + ( fxSlide ? 'slide-menu' : 'zoom-menu' ) + '" effect.' );
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
			debug( 'Don\'t use the "zoom-panels" effect in combination with the "slidingSubmenus" option set to "false".' );
		}

		//	effects +  onCanvas / (z)position
		if ( fxSlide || fxZoom )
		{
			if ( this.opts.offCanvas )
			{
				if ( position == 'top' || position == 'bottom' )
				{
					debug( 'Don\'t use the "' + ( fxSlide ? 'slide-menu' : 'zoom-menu' ) + '" effect in combination with the "offCanvas.position" option set to "' + position + '".' );
				}
				if ( zposition != 'back' )
				{
					debug( 'Don\'t use the "' + ( fxSlide ? 'slide-menu' : 'zoom-menu' ) + '" effect in combination with the "offCanvas.zposition" option set to "' + zposition + '".' );
				}
			}
			else
			{
				debug( 'Don\'t use the "' + ( fxSlide ? 'slide-menu' : 'zoom-menu' ) + '" effect in combination with the "offCanvas" option set to "false".' );
			}
		}
	};


})( jQuery );