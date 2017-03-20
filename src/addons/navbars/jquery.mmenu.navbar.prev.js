/*
 * jQuery mmenu navbar add-on prev content
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
		var $prev = $('<a class="' + _c.prev + ' ' + _c.btn + '" href="#" />')
			.appendTo( $navbar );

		
		this.bind( 'initNavbar:after',
			function( $panel )
			{
				$panel.removeClass( _c.hasnavbar );
			}
		);


		//	Update to opened panel
		var $org;
		var _url, _txt;

		this.bind( 'openPanel:start', 
			function( $panel )
			{
				if ( $panel.hasClass( _c.vertical ) )
				{
					return;
				}

				$org = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelPrev );
				if ( !$org.length )
				{
					$org = $panel.children( '.' + _c.navbar ).children( '.' + _c.prev );
				}

				_url = $org.attr( 'href' );
				_txt = $org.html();

				$prev[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
				$prev[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
				$prev.html( _txt );
			}
		);


		//	Add screenreader / aria support
		this.bind( 'initNavbar:after:sr-aria',
			function( $panel )
			{
				var $navbar = $panel.children( '.' + _c.navbar );
				this.__sr_aria( $navbar, 'hidden', true );
			}
		);
		this.bind( 'openPanel:start:sr-aria',
			function( $panel )
			{
				this.__sr_aria( $prev, 'hidden', $prev.hasClass( _c.hidden ) );
				this.__sr_aria( $prev, 'owns', ( $prev.attr( 'href' ) || '' ).slice( 1 ) );
			}
		);


		//	Detract content count
		return -1;
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelPrev = 'Prev';

})( jQuery );
