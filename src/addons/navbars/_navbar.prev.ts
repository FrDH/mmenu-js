Mmenu.addons.navbars.prev = function( 
	this	: Mmenu,
	$navbar	: JQuery, 
	opts	: iLooseObject, 
	conf	: iLooseObject
) {
	//	Add content
	var $prev = $('<a class="mm-btn mm-btn_prev mm-navbar__btn" href="#" />')
		.appendTo( $navbar );

	
	this.bind( 'initNavbar:after',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			$panel.removeClass( 'mm-panel_has-navbar' );
		}
	);


	//	Update to opened panel
	var $org;
	var _url, _txt;

	this.bind( 'openPanel:start', 
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			if ( $panel.parent( '.mm-listitem_vertical' ).length )
			{
				return;
			}

			$org = $panel.find( '.' + this.conf.classNames.navbars.panelPrev );
			if ( !$org.length )
			{
				$org = $panel.children( '.mm-navbar' ).children( '.mm-btn_prev' );
			}

			_url = $org.attr( 'href' );
			_txt = $org.html();

			if ( _url )
			{
				$prev.attr( 'href', _url );
			}
			else
			{
				$prev.removeAttr( 'href' );
			}

			$prev[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
			$prev.html( _txt );
		}
	);


	//	Add screenreader / aria support
	this.bind( 'initNavbar:after:sr-aria',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			var $navbar = $panel.children( '.mm-navbar' );
			Mmenu.sr_aria( $navbar, 'hidden', true );
		}
	);
	this.bind( 'openPanel:start:sr-aria',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			Mmenu.sr_aria( $prev, 'hidden', $prev.hasClass( 'mm-hidden' ) );
			Mmenu.sr_aria( $prev, 'owns', ( $prev.attr( 'href' ) || '' ).slice( 1 ) );
		}
	);
};

Mmenu.configs.classNames.navbars.panelPrev = 'Prev';
