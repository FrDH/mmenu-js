Mmenu.addons.navbars = function(
	this : Mmenu
) {
	var navs = this.opts.navbars;


	if ( typeof navs == 'undefined' )
	{
		return;
	}

	if ( !( navs instanceof Array ) )
	{
		navs = [ navs ];
	}

	var sizes 	= {},
		navbars = {};

	if ( !navs.length )
	{
		return;
	}

	navs.forEach(( opts ) => {

		//	Extend shorthand options.
		if ( typeof opts == 'boolean' && opts )
		{
			(opts as mmLooseObject) = {};
		}
		if ( typeof opts != 'object' )
		{
			(opts as mmLooseObject) = {};
		}
		if ( typeof opts.content == 'undefined' )
		{
			opts.content = [ 'prev', 'title' ];
		}
		if ( !( opts.content instanceof Array ) )
		{
			opts.content = [ opts.content ];
		}
		//	/Extend shorthand options.


		//	Create the navbar element.
		var navbar = Mmenu.DOM.create( 'div.mm-navbar' );
			

		//	Get the height for the navbar.
		var height = opts.height;
		if ( typeof height != 'number' )
		{
			//	Defaults to a height of 1.
			height = 1;
		}
		else
		{
			//	Restrict the height between 1 to 4.
			height = Math.min( 4, Math.max( 1, height ) );
			if ( height > 1 )
			{
				//	Add the height class to the navbar.
				navbar.classList.add( 'mm-navbar_size-' + height );
			}
		}

		//	Get the position for the navbar.
		var position = opts.position;

		//	Restrict the position to either "bottom" or "top" (default).
		if ( position !== 'bottom' )
		{
			position = 'top';
		}

		//	Add up the wrapper height for the navbar position.
		if ( !sizes[ position ] )
		{
			sizes[ position ] = 0;
		}
		sizes[ position ] += height;

		//	Create the wrapper for the navbar position.
		if ( !navbars[ position ] )
		{
			navbars[ position ] = Mmenu.DOM.create( 'div.mm-navbars_' + position );
		}
		navbars[ position ].append( navbar );


		//	Add content to the navbar
		for ( let c = 0, l = opts.content.length; c < l; c++ )
		{
			//	Content from
			let ctnt = ( typeof opts.content[ c ] == 'string' && Mmenu.addons.navbars[ (opts.content[ c ] as string) ] ) || null;

			if ( ctnt )
			{
				ctnt.call( this, navbar );
			}
			else
			{
//	TODO... <a href="/"></a> moet ook werken
//		zie iconbar?
				ctnt = opts.content[ c ];
				if ( !( ctnt instanceof Mmenu.$ ) )
				{
					ctnt = Mmenu.$( (opts.content[ c ] as string) );
				}
				navbar.append( ctnt );
			}
		}

		//	Added buttons
		if ( navbar.querySelector( '.mm-navbar__btn' ) )
		{
			navbar.classList.add( 'mm-navbar_has-btns' );
		}

		//	Call type
		var type = ( typeof opts.type == 'string' && Mmenu.addons.navbars[ opts.type ] ) || null;
		if ( type )
		{
			type.call( this, navbar );
		}
	});

	//	Add to menu
	this.bind( 'initMenu:after', () => {
		for ( let position in navbars )
		{
			this.node.menu.classList.add( 'mm-menu_navbar_' + position + '-' + sizes[ position ] );
			this.node.menu[ position == 'bottom' ? 'append' : 'prepend' ]( navbars[ position ] );
		}
	});
};


//	Default options and configuration.
Mmenu.options.navbars = [];

Mmenu.configs.navbars = {
	breadcrumbs: {
		separator 	: '/',
		removeFirst : false
	}
};

Mmenu.configs.classNames.navbars = {};
