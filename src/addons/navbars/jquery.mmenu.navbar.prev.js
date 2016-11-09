/*
 * jQuery mmenu navbar addon prev content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'prev';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		var $prev = $('<a class="' + _c.prev + ' ' + _c.btn + '" href="#" />').appendTo( $navbar );
		this.bind( 'initPanels',
			function( $panl )
			{
				$panl
					.removeClass( _c.hasnavbar )
					.children( '.' + _c.navbar )
					.addClass( _c.hidden );
			}
		);


		//	Update
		var _url, _txt;

		var update = function( $panel )
		{
			$panel = $panel || this.$pnls.children( '.' + _c.current );
			if ( $panel.hasClass( _c.vertical ) )
			{
				return;
			}

			var $orgn = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelPrev );
			if ( !$orgn.length )
			{
				$orgn = $panel.children( '.' + _c.navbar ).children( '.' + _c.prev );
			}

			_url  = $orgn.attr( 'href' );
			_owns = $orgn.attr( 'aria-owns' );
			_txt  = $orgn.html();

			$prev[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
			$prev[ _owns ? 'attr' : 'removeAttr' ]( 'aria-owns', _owns );
			$prev[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
			$prev.html( _txt );
		};

		this.bind( 'openPanel', update );
		this.bind( 'initPanels',
			function()
			{
				update.call( this );
			}
		);


		//	Detract content count
		return -1;
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelPrev = 'Prev';

})( jQuery );
