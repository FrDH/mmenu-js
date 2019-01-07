Mmenu.addons.navbars.next = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $next = Mmenu.$('<a class="mm-btn mm-btn_next mm-navbar__btn" href="#" />')
		.appendTo( $navbar );


	//	Update to opened panel
	var $org : JQuery;
	var _url, _txt;


	this.bind( 'openPanel:start', (
		$panel : JQuery
	) => {
		$org = $panel.find( '.' + this.conf.classNames.navbars.panelNext );

		_url = $org.length ? $org[ 0 ].getAttribute( 'href' ) : '';
		_txt = $org.html();

		if ( _url )
		{
			$next[ 0 ].setAttribute( 'href', _url );
		}
		else
		{
			$next[ 0 ].removeAttribute( 'href' );
		}
		
		$next[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
		$next.html( _txt );
	});


	//	Add screenreader / aria support
	this.bind( 'openPanel:start:sr-aria', (
		$panel : JQuery
	) => {
		Mmenu.sr_aria( $next, 'hidden', $next.hasClass( 'mm-hidden' ) );
		Mmenu.sr_aria( $next, 'owns', ( $next[ 0 ].getAttribute( 'href' ) || '' ).slice( 1 ) );
	});
};

Mmenu.configs.classNames.navbars.panelNext = 'Next';
