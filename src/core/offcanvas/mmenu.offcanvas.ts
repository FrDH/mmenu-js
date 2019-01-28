Mmenu.addons.offCanvas = function( 
	this : Mmenu
) {

	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts = this.opts.offCanvas,
		conf = this.conf.offCanvas;


	//	Add methods to the API
	this._api.push( 'open', 'close', 'setPage' );


	//	Extend shorthand options
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	this.opts.offCanvas = Mmenu.extend( opts, Mmenu.options.offCanvas );
	this.conf.offCanvas = Mmenu.extend( conf, Mmenu.configs.offCanvas );


	//	Setup the menu
	this.vars.opened = false;


	//	Add off-canvas behavior
	this.bind( 'initMenu:after', () => {

		//	Setup the UI blocker
		this._initBlocker();

		//	Setup the page
		this.setPage( Mmenu.node.page );

		//	Setup window events
		this._initWindow_offCanvas();

		//	Setup the menu
		this.node.menu.classList.add( 'mm-menu_offcanvas' );
		this.node.menu.parentElement.classList.remove( 'mm-wrapper' );
		

		//	Append to the <body>
		document.querySelector( conf.menu.insertSelector )[ conf.menu.insertMethod ]( this.node.menu );

		//	Open if url hash equals menu id (usefull when user clicks the hamburger icon before the menu is created)
		let hash = window.location.hash;
		if ( hash )
		{
			let id = this.vars.orgMenuId;
			if ( id && id == hash.slice( 1 ) )
			{
				setTimeout(() => {
					this.open();
				}, 1000 );
			}
		}
	});


	//	Sync the blocker to target the page.
	this.bind( 'setPage:after', ( 
		page : HTMLElement
	) => {
		if ( Mmenu.node.blck )
		{
			Mmenu.DOM.children( Mmenu.node.blck, 'a' )
				.forEach(( anchor ) => {
					anchor.setAttribute( 'href', '#' + page.id )
				});
		}
	});


	//	Add screenreader / aria support
	this.bind( 'open:start:sr-aria', () => {
		Mmenu.sr_aria( this.node.menu, 'hidden', false );
	});
	this.bind( 'close:finish:sr-aria', () => {
		Mmenu.sr_aria( this.node.menu, 'hidden', true );
	});
	this.bind( 'initMenu:after:sr-aria', () => {
		Mmenu.sr_aria( this.node.menu, 'hidden', true );
	});


	//	Add screenreader / text support
	this.bind( 'initBlocker:after:sr-text', () => {
		Mmenu.DOM.children( Mmenu.node.blck, 'a' )
			.forEach(( anchor ) => {
				anchor.innerHTML = Mmenu.sr_text( this.i18n( this.conf.screenReader.text.closeMenu ) );
			});
	});


	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor
	this.clck.push((
		anchor	: HTMLElement,
		args 	: mmClickArguments
	) => {
		//	Open menu if the clicked anchor links to the menu
		var id = this.vars.orgMenuId;
		if ( id )
		{
			if ( anchor.matches( '[href="#' + id + '"]' ) )
			{
				//	Opening this menu from within this menu
				//		-> Open menu
				if ( args.inMenu )
				{
					this.open();
					return true;
				}

				//	Opening this menu from within a second menu
				//		-> Close the second menu before opening this menu
				var menu = (anchor.closest( '.mm-menu' ) as HTMLElement);
				if ( menu )
				{
					var api : mmApi = (menu as any).mmenu;
					if ( api && api.close )
					{
						api.close();
						Mmenu.transitionend( menu,
							() => {
								this.open();
							}, this.conf.transitionDuration
						);
						return true;
					}
				}

				//	Opening this menu
				this.open();
				return true;
			}
		}

		//	Close menu
		id = Mmenu.node.page.id;
		if ( id )
		{
			if ( anchor.matches( '[href="#' + id + '"]' ) )
			{
				this.close();
				return true;
			}
		}

		return;
	});

};


//	Default options and configuration.
Mmenu.options.offCanvas = {
	blockUI			: true,
	moveBackground	: true
};

Mmenu.configs.offCanvas = {
	menu 	: {
		insertMethod	: 'prepend',
		insertSelector	: 'body'
	},
	page 	: {
		nodetype		: 'div',
		selector		: null,
		noSelector		: []
	}
};


/**
 * Open the menu.
 */
Mmenu.prototype.open = function( 
	this : Mmenu
) {
	this.trigger( 'open:before' );

	if ( this.vars.opened )
	{
		return;
	}

	this._openSetup();

	//	Without the timeout, the animation won't work because the menu had display: none;
	setTimeout(
		() => {
			this._openFinish();
		}, this.conf.openingInterval
	);

	this.trigger( 'open:after' );
};

/**
 * Setup the menu so it can be opened.
 */
Mmenu.prototype._openSetup = function(
	this : Mmenu
) {
	var opts = this.opts.offCanvas;

	//	Close other menus
	this.closeAllOthers();

	//	Store style and position
	(Mmenu.node.page as any).mmStyle = Mmenu.node.page.getAttribute( 'style' ) || '';

	//	Trigger window-resize to measure height
	//	Je kunt geen custom argumenten meegeven aan window.dispatchEvent( new Event( 'resize' ) )
	//	Daarom de functie opslaan in een object
	Mmenu.$(window).trigger( 'resize.mm-offCanvas', [ true ] );

	var clsn = [ 'mm-wrapper_opened' ];

	//	Add options
	if ( opts.blockUI )
	{
		clsn.push( 'mm-wrapper_blocking' );
	}
	if ( opts.blockUI == 'modal' )
	{
		clsn.push( 'mm-wrapper_modal' );
	}
	if ( opts.moveBackground )
	{
		clsn.push( 'mm-wrapper_background' );
	}

	document.querySelector( 'html' ).classList.add( ...clsn );

	//	Open
	//	Without the timeout, the animation won't work because the menu had display: none;
	setTimeout(() => {
    	this.vars.opened = true;
	}, this.conf.openingInterval );

	this.node.menu.classList.add( 'mm-menu_opened' );
};

/**
 * Finish opening the menu.
 */
Mmenu.prototype._openFinish = function(
	this : Mmenu
) {
	//	Callback when the page finishes opening.
	Mmenu.transitionend( Mmenu.node.page, () => {
		this.trigger( 'open:finish' );
	}, this.conf.transitionDuration );

	//	Opening
	this.trigger( 'open:start' );
	document.querySelector( 'html' ).classList.add( 'mm-wrapper_opening' );
};

/**
 * Close the menu.
 */
Mmenu.prototype.close = function(
	this : Mmenu
) {
	this.trigger( 'close:before' );

	if ( !this.vars.opened )
	{
		return;
	}


	//	Callback when the page finishes closing.
	Mmenu.transitionend( Mmenu.node.page, () => {
		this.node.menu.classList.remove( 'mm-menu_opened' );

		var clsn = [
			'mm-wrapper_opened',
			'mm-wrapper_blocking',
			'mm-wrapper_modal',
			'mm-wrapper_background'
		];

		document.querySelector( 'html' ).classList.remove( ...clsn )

		//	Restore style and position
		Mmenu.node.page.setAttribute( 'style', (Mmenu.node.page as any).mmStyle );

		this.vars.opened = false;
		this.trigger( 'close:finish' );

	}, this.conf.transitionDuration );

	//	Closing
	this.trigger( 'close:start' );

	document.querySelector( 'html' ).classList.remove( 'mm-wrapper_opening' );

	this.trigger( 'close:after' );
};

/**
 * Close all other menus.
 */
Mmenu.prototype.closeAllOthers = function(
	this : Mmenu
) {
	Mmenu.DOM.find( document.body, '.mm-menu_offcanvas' )
		.forEach(( menu ) => {
			if ( menu !== this.node.menu )
			{
				let api : mmApi = (menu as any).mmenu;
				if ( api && api.close )
				{
					api.close();
				}
			}
		});
};

/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function( 
	this : Mmenu,
	page : HTMLElement
) {

	this.trigger( 'setPage:before', [ page ] );

	var conf = this.conf.offCanvas;

	//	If no page was specified, find it.
	if ( !page )
	{
		/** Array of elements that are / could be "the page". */
		let pages = ( typeof conf.page.selector == 'string' )
			? Mmenu.DOM.find( document.body, conf.page.selector )
			: Mmenu.DOM.children( document.body, conf.page.nodetype );

		//	Filter out elements that are absolutely not "the page".
		pages = pages.filter( page => !page.matches( '.mm-menu, .mm-wrapper__blocker' ) );

		//	Filter out elements that are configured to not be "the page".
		if ( conf.page.noSelector.length )
		{
			pages = pages.filter( page => !page.matches( conf.page.noSelector.join( ', ' ) ) );
		}

		//	Wrap multiple pages in a single element.
		if ( pages.length > 1 )
		{
			pages = [ Mmenu.$(pages)
				.wrapAll( '<' + conf.page.nodetype + ' />' )
				.parent()[ 0 ] ];
		}

		page = pages[ 0 ];
	}
	page.classList.add( 'mm-page', 'mm-slideout' );
	page.id = page.id || Mmenu.getUniqueId();

	Mmenu.node.page = page;

	this.trigger( 'setPage:after', [ page ] );
};

/**
 * Initialize the <window>
 */
Mmenu.prototype._initWindow_offCanvas = function(
	this : Mmenu
) {

	//	Prevent tabbing
	//	Because when tabbing outside the menu, the element that gains focus will be centered on the screen.
	//	In other words: The menu would move out of view.

	//	TODO event opslaan zodat het weer verwijderd kan worden met removeListener en direct aangeroepen ipv trigger()
	Mmenu.$(window)
		.off( 'keydown.mm-offCanvas' )
		.on(  'keydown.mm--offCanvas',
			( e ) => {
				if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
				{
					if ( e.keyCode == 9 )
					{
						e.preventDefault();
						return false;
					}
				}
			}
		);

	//	Set "page" node min-height to window height
	var oldHeight, newHeight;

	//	TODO event opslaan zodat het weer verwijderd kan worden met removeListener en direct aangeroepen ipv trigger()
	Mmenu.$(window)
		.off( 'resize.mm-offCanvas' )
		.on( 'resize.mm-offCanvas', ( evnt, force ) => {
			if ( Mmenu.node.page )
			{
				if ( force || document.documentElement.matches( '.mm-wrapper_opened' ) )
				{
					newHeight = window.innerHeight;
					if ( force || newHeight != oldHeight )
					{
						oldHeight = newHeight;
						Mmenu.node.page.style.minHeight = newHeight + 'px';
					}
				}
			}
		});
};

/**
 * Initialize "blocker" node
 */
Mmenu.prototype._initBlocker = function(
	this : Mmenu
) {
	var opts = this.opts.offCanvas,
		conf = this.conf.offCanvas;

	this.trigger( 'initBlocker:before' );


	if ( !opts.blockUI )
	{
		return;
	}


	//	Create the blocker node.
	if ( !Mmenu.node.blck )
	{
		let blck = Mmenu.DOM.create( 'div.mm-wrapper__blocker.mm-slideout' ); 
			blck.innerHTML = '<a></a>';

		//	Append the blocker node to the body.
		document.querySelector( conf.menu.insertSelector )
			.append( blck );

		//	Store the blocker node.
		Mmenu.node.blck = blck;
	}

	//	Close the menu when 
	//		1) clicking, 
	//		2) touching or 
	//		3) dragging the blocker node.
	var closeMenu = ( evnt : Event ) => {
		evnt.preventDefault();
		evnt.stopPropagation();

		if ( !document.documentElement.matches( '.mm-wrapper_modal' ) )
		{
			this.close();
		}
	};
	Mmenu.node.blck.addEventListener( 'mousedown'	, closeMenu ); // 1
	Mmenu.node.blck.addEventListener( 'touchstart'	, closeMenu ); // 2
	Mmenu.node.blck.addEventListener( 'touchmove'	, closeMenu ); // 3


	this.trigger( 'initBlocker:after' );
};
