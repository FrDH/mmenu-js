Mmenu.addons.navbars = function(
	this : Mmenu
) {
	var navs = this.opts.navbars;


	if ( typeof navs == 'undefined' ) {
		return;
	}

	if ( !( navs instanceof Array ) ) {
		navs = [ navs ];
	}

	var sizes 	= {},
		navbars = {};

	if ( !navs.length ) {
		return;
	}

	navs.forEach(( options ) => {

		//	Extend shorthand options.
		if ( typeof options == 'boolean' && options ) {
			(options as mmLooseObject) = {};
		}

		if ( typeof options != 'object' ) {
			(options as mmLooseObject) = {};
		}

		if ( typeof options.content == 'undefined' ) {
			options.content = [ 'prev', 'title' ];
		}

		if ( !( options.content instanceof Array ) ) {
			options.content = [ options.content ];
		}
		//	/Extend shorthand options.


		//	Create the navbar element.
		var navbar = Mmenu.DOM.create( 'div.mm-navbar' );
			

		//	Get the height for the navbar.
		var height = options.height;
		if ( typeof height != 'number' ) {
			//	Defaults to a height of 1.
			height = 1;

		} else {
			//	Restrict the height between 1 to 4.
			height = Math.min( 4, Math.max( 1, height ) );
			if ( height > 1 )
			{
				//	Add the height class to the navbar.
				navbar.classList.add( 'mm-navbar_size-' + height );
			}
		}

		//	Get the position for the navbar.
		var position = options.position;

		//	Restrict the position to either "bottom" or "top" (default).
		if ( position !== 'bottom' ) {
			position = 'top';
		}

		//	Add up the wrapper height for the navbar position.
		if ( !sizes[ position ] ) {
			sizes[ position ] = 0;
		}
		sizes[ position ] += height;

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
				let func = Mmenu.addons.navbars[ ctnt ];
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

		//	If buttons were added, tell the navbar.
		if ( navbar.querySelector( '.mm-navbar__btn' ) ) {
			navbar.classList.add( 'mm-navbar_has-btns' );
		}

		//	The type option is set.
		if ( typeof options.type == 'string' ) {
			//	The function refers to one of the navbar-presets ("tabs").
			let func = Mmenu.addons.navbars[ options.type ];
			if ( typeof func == 'function' ) {
				//	Call the preset function.
				func.call( this, navbar );
			}
		}
	});

	//	Add to menu
	this.bind( 'initMenu:after', () => {
		for ( let position in navbars ) {
			this.node.menu.classList.add( 'mm-menu_navbar_' + position + '-' + sizes[ position ] );
			this.node.menu[ position == 'bottom' ? 'append' : 'prepend' ]( navbars[ position ] );
		}
	});
};

