Mmenu.addons.navbars.prev = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content.
	var $prev = Mmenu.$('<a class="mm-btn mm-btn_prev mm-navbar__btn" href="#" />')
		.appendTo( $navbar );

	
	this.bind( 'initNavbar:after', ( 
		$panel : JQuery
	) => {
		$panel.removeClass( 'mm-panel_has-navbar' );
	});


	//	Update to opened panel.
	var $org : JQuery;
	var _url, _txt;

	this.bind( 'openPanel:start', (
		$panel : JQuery
	) => {
		if ( $panel.parent( '.mm-listitem_vertical' ).length )
		{
			return;
		}

		$org = $panel.find( '.' + this.conf.classNames.navbars.panelPrev );
		if ( !$org.length )
		{
			$org = $panel.children( '.mm-navbar' ).children( '.mm-btn_prev' );
		}

		_url = $org.length ? $org[ 0 ].getAttribute( 'href' ) : '';
		_txt = $org.html();

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
		$panel : JQuery
	) => {
		var $navbar = $panel.children( '.mm-navbar' );
		Mmenu.sr_aria( $navbar, 'hidden', true );
	});
	this.bind( 'openPanel:start:sr-aria', (
		$panel : JQuery
	) => {
		Mmenu.sr_aria( $prev, 'hidden', $prev.hasClass( 'mm-hidden' ) );
		Mmenu.sr_aria( $prev, 'owns', ( $prev[ 0 ].getAttribute( 'href' ) || '' ).slice( 1 ) );
	});
};

Mmenu.configs.classNames.navbars.panelPrev = 'Prev';
