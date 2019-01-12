Mmenu.addons.navbars.close = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var close = document.createElement( 'a' );
	close.classList.add( 'mm-btn', 'mm-btn_close', 'mm-navbar__btn' );
	close.setAttribute( 'href', '#' );
	$navbar.append( close );


	//	Update to page node
	this.bind( 'setPage:after', (
		page : HTMLElement
	) => {
		close.setAttribute( 'href', '#' + page.id );
	});


	//	Add screenreader / text support
	this.bind( 'setPage:after:sr-text', () => {
		close.innerHTML = Mmenu.sr_text( this.i18n( this.conf.screenReader.text.closeMenu ) );
		Mmenu.sr_aria( Mmenu.$(close), 'owns', close.getAttribute( 'href' ).slice( 1 ) );
	});
};
