/*	
 * jQuery mmenu navbar add-on close content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'close';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c,
			glbl = $[ _PLUGIN_ ].glbl;


		//	Add content
		var $close = $('<a class="' + _c.close + ' ' + _c.btn + '" href="#" />')
			.appendTo( $navbar );


		//	Update to page node
		this.bind( 'setPage:after',
			function( $page )
			{
				$close.attr( 'href', '#' + $page.attr( 'id' ) );
			}
		);


		//	Add screenreader / text support
		this.bind( 'setPage:after:sr-text',
			function( $page )
			{
				$close.html( this.__sr_text( $[ _PLUGIN_ ].i18n( this.conf.screenReader.text.closeMenu ) ) );
				this.__sr_aria( $close, 'owns', $close.attr( 'href' ).slice( 1 ) );
			}
		);


		//	Detract content count
		return -1;
	};

})( jQuery );