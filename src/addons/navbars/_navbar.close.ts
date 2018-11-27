Mmenu.addons.navbars.close = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $close = jQuery('<a class="mm-btn mm-btn_close mm-navbar__btn" href="#" />')
		.appendTo( $navbar );


	//	Update to page node
	this.bind( 'setPage:after',
		function( 
			this	: Mmenu,
			$page	: JQuery
		) {
			$close.attr( 'href', '#' + $page.attr( 'id' ) );
		}
	);


	//	Add screenreader / text support
	this.bind( 'setPage:after:sr-text',
		function( 
			this	: Mmenu,
			$page	: JQuery
		) {
			$close.html( Mmenu.sr_text( this.i18n( this.conf.screenReader.text.closeMenu ) ) );
			Mmenu.sr_aria( $close, 'owns', $close.attr( 'href' ).slice( 1 ) );
		}
	);
};