import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

import options from './_options';
import configs from './_configs';

Mmenu.options.navbars = options;
Mmenu.configs.navbars = configs;

Mmenu.configs.classNames.navbars = {
	panelNext : 'Next',
	panelPrev : 'Prev',
	panelTitle: 'Title'
};


import breadcrumbs from './_navbar.breadcrumbs';
import close from './_navbar.close';
import next from './_navbar.next';
import prev from './_navbar.prev';
import searchfield from './_navbar.searchfield';
import title from './_navbar.title';

const navbarContents = {
	breadcrumbs,
	close,
	next,
	prev,
	searchfield,
	title
};


import tabs from './_navbar.tabs';

const navbarTypes = {
	tabs
};


export default function(
	this : Mmenu
) {
	var navs = this.opts.navbars;


	if ( typeof navs == 'undefined' ) {
		return;
	}

	if ( !( navs instanceof Array ) ) {
		navs = [ navs ];
	}

	var navbars = {};

	if ( !navs.length ) {
		return;
	}

	navs.forEach(( options ) => {

		//	Extend shorthand options.
		if ( typeof options == 'boolean' && options ) {
			options = {};
		}

		if ( Mmenu.typeof( options ) != 'object' ) {
			options = {};
		}

		if ( typeof options.content == 'undefined' ) {
			options.content = [ 'prev', 'title' ];
		}

		if ( !( options.content instanceof Array ) ) {
			options.content = [ options.content ];
		}

		if ( typeof options.use == 'undefined' ) {
			options.use = true;
		}

		if ( typeof options.use == 'boolean' && options.use ) {
			options.use = true;
		}

		if ( typeof options.use == 'number' ) {
			options.use = '(min-width: ' + options.use + 'px)';
		}
		//	/Extend shorthand options.


		if ( !options.use ) {
			return false;
		}


		//	Create the navbar element.
		var navbar = Mmenu.DOM.create( 'div.mm-navbar' );

		//	Get the position for the navbar.
		var position = options.position;

		//	Restrict the position to either "bottom" or "top" (default).
		if ( position !== 'bottom' ) {
			position = 'top';
		}

		//	Create the wrapper for the navbar position.
		if ( !navbars[ position ] ) {
			navbars[ position ] = Mmenu.DOM.create( 'div.mm-navbars_' + position );
		}
		navbars[ position ].append( navbar );


		//	Add content to the navbar.
		for ( let c = 0, l = options.content.length; c < l; c++ ) {

			let ctnt = options.content[ c ];

			//	The content is a string.
			if ( typeof ctnt == 'string' ) {

				//	The content refers to one of the navbar-presets ("prev", "title", etc).
				let func = navbarContents[ ctnt ];
				if ( typeof func == 'function' ) {
					//	Call the preset function.
					func.call( this, navbar );

				//	The content is just HTML.
				} else {
					//	Add the HTML.
					navbar.innerHTML += ctnt;
				}

			//	The content is not a string, it must be an element.
			} else {
				navbar.append( ctnt );
			}
		}

		//	The type option is set.
		if ( typeof options.type == 'string' ) {
			//	The function refers to one of the navbar-presets ("tabs").
			let func = navbarTypes[ options.type ];
			if ( typeof func == 'function' ) {
				//	Call the preset function.
				func.call( this, navbar );
			}
		}

		//	en-/disable the navbar for media queries.
		if ( typeof options.use != 'boolean' ) {
			this.matchMedia( options.use,
				() => {
					navbar.classList.remove( 'mm-hidden' );
				},
				() => {
					navbar.classList.add( 'mm-hidden' );
				}
			);
		}
	});

	//	Add to menu.
	this.bind( 'initMenu:after', () => {
		for ( let position in navbars ) {
			this.node.menu[ position == 'bottom' ? 'append' : 'prepend' ]( navbars[ position ] );
		}
	});
};

