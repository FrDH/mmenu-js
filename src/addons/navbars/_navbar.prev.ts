Mmenu.addons.navbars.prev = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content.
	var $prev = Mmenu.$('<a class="mm-btn mm-btn_prev mm-navbar__btn" href="#" />')
		.appendTo( $navbar );

	
	this.bind( 'initNavbar:after', ( 
		panel : HTMLElement
	) => {
		panel.classList.remove( 'mm-panel_has-navbar' );
	});


	//	Update to opened panel.
	var org : HTMLElement;
	var _url, _txt;

	this.bind( 'openPanel:start', (
		panel : HTMLElement
	) => {
		if ( panel.parentElement.matches( '.mm-listitem_vertical' ) )
		{
			return;
		}

		org = panel.querySelector( '.' + this.conf.classNames.navbars.panelPrev );
		if ( !org )
		{
			org = Mmenu.$(panel).children( '.mm-navbar' ).children( '.mm-btn_prev' )[0];
		}

		_url = org ? org.getAttribute( 'href' ) : '';
		_txt = org.innerHTML;

		if ( _url )
		{
			$prev[ 0 ].setAttribute( 'href', _url );
		}
		else
		{
			$prev[ 0 ].removeAttribute( 'href' );
		}

		$prev[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
		$prev.html( _txt );
	});


	//	Add screenreader / aria support
	this.bind( 'initNavbar:after:sr-aria', (
		panel : HTMLElement
	) => {
		Mmenu.sr_aria( panel.querySelector( '.mm-navbar' ), 'hidden', true );
	});
	this.bind( 'openPanel:start:sr-aria', (
		panel : HTMLElement
	) => {
		Mmenu.sr_aria( $prev, 'hidden', $prev.hasClass( 'mm-hidden' ) );
		Mmenu.sr_aria( $prev, 'owns', ( $prev[ 0 ].getAttribute( 'href' ) || '' ).slice( 1 ) );
	});
};

Mmenu.configs.classNames.navbars.panelPrev = 'Prev';
