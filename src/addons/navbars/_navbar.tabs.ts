import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

import * as DOM from '../../core/_dom';

export default function( 
	this	: Mmenu,
	navbar	: HTMLElement
) {

	navbar.classList.add( 'mm-navbar_tabs' );
	navbar.parentElement.classList.add( 'mm-navbars_has-tabs' );

	var anchors = DOM.children( navbar, 'a' );
	
	navbar.addEventListener( 'click', ( evnt ) => {
		var anchor = (evnt.target as HTMLElement);
		if ( !anchor.matches( 'a' ) ) {
			return;
		}
		if ( anchor.matches( '.mm-navbar__tab_selected' ) ) {
			evnt.stopImmediatePropagation();
			return;
		}

		try {
			this.openPanel( this.node.menu.querySelector( anchor.getAttribute( 'href' ) ), false );
			evnt.stopImmediatePropagation();
		}
		catch( err ) {}
	});

	function selectTab( 
		this	: Mmenu,
		panel	: HTMLElement
	) {
		anchors.forEach(( anchor ) => {
			anchor.classList.remove( 'mm-navbar__tab_selected' );
		});
		
		var anchor = anchors.filter( anchor => anchor.matches( '[href="#' + panel.id + '"]' ) )[ 0 ];
		if ( anchor ) {
			anchor.classList.add( 'mm-navbar__tab_selected' );
		} else {
			var parent : HTMLElement = panel[ 'mmParent' ];
			if ( parent ) {
				selectTab.call( this, parent.closest( '.mm-panel' ) );
			}
		}
	}

	this.bind( 'openPanel:start', selectTab );
};
