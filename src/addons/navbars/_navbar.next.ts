Mmenu.addons.navbars.next = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var next = document.createElement( 'a' );
	next.classList.add( 'mm-btn', 'mm-btn_next', 'mm-navbar__btn' );
	next.setAttribute( 'href', '#' );
	$navbar.append( next );


	//	Update to opened panel
	var org : HTMLElement;
	var _url, _txt;


	this.bind( 'openPanel:start', (
		panel : HTMLElement
	) => {
		org = panel.querySelector( '.' + this.conf.classNames.navbars.panelNext );

		_url = org ? org.getAttribute( 'href' ) : '';
		_txt = org.innerHTML;

		if ( _url )
		{
			next.setAttribute( 'href', _url );
		}
		else
		{
			next.removeAttribute( 'href' );
		}
		
		next.classList[ _url || _txt ? 'remove' : 'add' ]( 'mm-hidden' );
		next.innerHTML = _txt;
	});


	//	Add screenreader / aria support
	this.bind( 'openPanel:start:sr-aria', (
		panel : HTMLElement
	) => {
		Mmenu.sr_aria( Mmenu.$(next), 'hidden', next.matches( 'mm-hidden' ) );
		Mmenu.sr_aria( Mmenu.$(next), 'owns', ( next.getAttribute( 'href' ) || '' ).slice( 1 ) );
	});
};

Mmenu.configs.classNames.navbars.panelNext = 'Next';
