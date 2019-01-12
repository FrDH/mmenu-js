Mmenu.addons.navbars.title = function( 
	this	: Mmenu,
	$navbar	: JQuery
) {
	//	Add content
	var $title = Mmenu.$('<a class="mm-navbar__title" />')
		.appendTo( $navbar );


	//	Update to opened panel
	var _url, _txt;
	var org : HTMLElement;

	this.bind( 'openPanel:start', ( 
		panel : HTMLElement
	) => {
		if ( panel.parentElement.matches( '.mm-listitem_vertical' ) )
		{
			return;
		}

		org = panel.querySelector( '.' + this.conf.classNames.navbars.panelTitle );
		if ( !org )
		{
			org = panel.querySelector( '.mm-navbar__title' );
		}

		_url = org.getAttribute( 'href' );
		_txt = org.innerHTML;

		if ( _url )
		{
			$title[ 0 ].setAttribute( 'href', _url );
		}
		else
		{
			$title[ 0 ].removeAttribute( 'href' );
		}

		$title[ _url || _txt ? 'removeClass' : 'addClass' ]( 'mm-hidden' );
		$title.html( _txt );
	});


	//	Add screenreader / aria support
	var $prev;

	this.bind( 'openPanel:start:sr-aria', (
		panel : HTMLElement
	) => {
		if ( this.opts.screenReader.text )
		{
			if ( !$prev )
			{
				$prev = Mmenu.$(this.node.menu)
					.children( '.mm-navbars_top, .mm-navbars_bottom' )
					.children( '.mm-navbar' )
					.children( '.mm-btn_prev' );
			}
			if ( $prev.length )
			{
				var hidden = true;
				if ( this.opts.navbar.titleLink == 'parent' )
				{
					hidden = !$prev.hasClass( 'mm-hidden' );
				}
				Mmenu.sr_aria( $title, 'hidden', hidden );
			}
		}
	});
};

Mmenu.configs.classNames.navbars.panelTitle = 'Title';
