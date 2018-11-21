Mmenu.addons.navbars.next = function( 
	this	: Mmenu,
	$navbar	: JQuery, 
	opts	: iLooseObject, 
	conf	: iLooseObject
) {
	//	Add content
	var $next = jQuery('<a class="mm-btn mm-btn_next mm-navbar__btn" href="#" />')
		.appendTo( $navbar );


	//	Update to opened panel
	var $org;
	var _url, _txt;


	this.bind( 'openPanel:start',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			$org = $panel.find( '.' + this.conf.classNames.navbars.panelNext );

			_url = $org.attr( 'href' );
			_txt = $org.html();

			if ( _url )
			{
				$next.attr( 'href', _url );
			}
			else
			{
				$next.removeAttr( 'href' );
			}
			
			$next[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
			$next.html( _txt );
		}
	);


	//	Add screenreader / aria support
	this.bind( 'openPanel:start:sr-aria',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			Mmenu.sr_aria( $next, 'hidden', $next.hasClass( 'mm-hidden' ) );
			Mmenu.sr_aria( $next, 'owns', ( $next.attr( 'href' ) || '' ).slice( 1 ) );
		}
	);
};

Mmenu.configs.classNames.navbars.panelNext = 'Next';
