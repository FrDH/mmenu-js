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
		this.setPage( Mmenu.node.$page );

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
		$page : JQuery
	) => {
		if ( Mmenu.node.$blck )
		{
			Mmenu.node.$blck
				.children( 'a' )
				.attr( 'href', '#' + $page[ 0 ].id );
		}
	});


	//	Add screenreader / aria support
	this.bind( 'open:start:sr-aria', () => {
		Mmenu.sr_aria( Mmenu.$(this.node.menu), 'hidden', false );
	});
	this.bind( 'close:finish:sr-aria', () => {
		Mmenu.sr_aria( Mmenu.$(this.node.menu), 'hidden', true );
	});
	this.bind( 'initMenu:after:sr-aria', () => {
		Mmenu.sr_aria( Mmenu.$(this.node.menu), 'hidden', true );
	});


	//	Add screenreader / text support
	this.bind( 'initBlocker:after:sr-text', () => {
		Mmenu.node.$blck
			.children( 'a' )
			.html( Mmenu.sr_text( this.i18n( this.conf.screenReader.text.closeMenu ) ) );
	});


	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor
	this.clck.push((
		anchor	: HTMLElement,
		args 	: mmClickArguments
	) => {
		var $a = Mmenu.$(anchor);

		//	Open menu if the clicked anchor links to the menu
		var id = this.vars.orgMenuId;
		if ( id )
		{
			if ( $a.is( '[href="#' + id + '"]' ) )
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
				var $menu = $a.closest( '.mm-menu' );
				if ( $menu.length )
				{
					var api : mmApi = ($menu as any).mmenu;
					if ( api && api.close )
					{
						api.close();
						Mmenu.transitionend( $menu,
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
		id = Mmenu.node.$page[ 0 ].id;
		if ( id )
		{
			if ( $a.is( '[href="#' + id + '"]' ) )
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
		noSelector		: [],
		wrapIfNeeded	: true,
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
	Mmenu.node.$page.each(
		( i, elem ) => {
			let $page = Mmenu.$(elem);
			($page[ 0 ] as any).mmStyle = $page[ 0 ].getAttribute( 'style' ) || '';
		}
	);

	//	Trigger window-resize to measure height
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

	Mmenu.$('html').addClass( clsn.join( ' ' ) );

	//	Open
	//	Without the timeout, the animation won't work because the menu had display: none;
	setTimeout(
		() => {
        	this.vars.opened = true;
    	}, this.conf.openingInterval
    );

	this.node.menu.classList.add( 'mm-menu_opened' );
};

/**
 * Finish opening the menu.
 */
Mmenu.prototype._openFinish = function(
	this : Mmenu
) {
	//	Callback when the page finishes opening.
	Mmenu.transitionend( Mmenu.node.$page.first(), () => {
		this.trigger( 'open:finish' );
	}, this.conf.transitionDuration );

	//	Opening
	this.trigger( 'open:start' );
	Mmenu.$('html').addClass( 'mm-wrapper_opening' );
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
	Mmenu.transitionend( Mmenu.node.$page.first(),
		() => {
			this.node.menu.classList.remove( 'mm-menu_opened' );

			var clsn = [
				'mm-wrapper_opened',
				'mm-wrapper_blocking',
				'mm-wrapper_modal',
				'mm-wrapper_background'
			];

			Mmenu.$('html').removeClass( clsn.join( ' ' ) );

			//	Restore style and position
			Mmenu.node.$page.each( ( i, elem ) => {
				let $page = Mmenu.$(elem);
				$page[ 0 ].setAttribute( 'style', ($page[ 0 ] as any).mmStyle );
			});

			this.vars.opened = false;
			this.trigger( 'close:finish' );

		}, this.conf.transitionDuration
	);

	//	Closing
	this.trigger( 'close:start' );

	Mmenu.$('html').removeClass( 'mm-wrapper_opening' );

	this.trigger( 'close:after' );
};

/**
 * Close all other menus.
 */
Mmenu.prototype.closeAllOthers = function(
	this : Mmenu
) {
	Mmenu.$('body')
		.find( '.mm-menu_offcanvas' )
		.not( this.node.menu )
		.each(
			( i, elem ) => {
				var api : mmApi = (elem as any).mmenu;
				if ( api && api.close )
				{
					api.close();
				}
			}
		);
};

/**
 * Set "page" node.
 */
Mmenu.prototype.setPage = function( 
	this : Mmenu,
	$page: JQuery
) {

	this.trigger( 'setPage:before', [ $page ] );

	var conf = this.conf.offCanvas;

	if ( !$page || !$page.length )
	{
		$page = ( typeof conf.page.selector == 'string' )
			? Mmenu.$('body').find( conf.page.selector )
			: Mmenu.$('body').children( conf.page.nodetype );
		
		$page = $page
			.not( '.mm-menu' )
			.not( '.mm-wrapper__blocker' );

		if ( conf.page.noSelector.length )
		{
			$page = $page.not( conf.page.noSelector.join( ', ' ) );
		}
		if ( $page.length > 1 && conf.page.wrapIfNeeded )
		{
			$page = $page
				.wrapAll( '<' + conf.page.nodetype + ' />' )
				.parent();
		}
	}
	$page.addClass( 'mm-page mm-slideout' )
		.each(
			function( i, elem )
			{
				elem.id = elem.id || Mmenu.getUniqueId();
			}
		);


	Mmenu.node.$page = $page;

	this.trigger( 'setPage:after', [ $page ] );
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
	Mmenu.$(window)
		.off( 'keydown.mm-offCanvas' )
		.on(  'keydown.mm--offCanvas',
			( e ) => {
				if ( Mmenu.$('html').hasClass( 'mm-wrapper_opened' ) )
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
	Mmenu.$(window)
		.off( 'resize.mm-offCanvas' )
		.on( 'resize.mm-offCanvas',
			( e, force ) => {
				if ( Mmenu.node.$page.length == 1 )
				{
					if ( force || Mmenu.$('html').hasClass( 'mm-wrapper_opened' ) )
					{
						newHeight = Mmenu.$(window).height();
						if ( force || newHeight != oldHeight )
						{
							oldHeight = newHeight;
							Mmenu.node.$page.css( 'minHeight', newHeight );
						}
					}
				}
			}
		);
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

	if ( !Mmenu.node.$blck )
	{
		Mmenu.node.$blck = Mmenu.$( '<div class="mm-wrapper__blocker mm-slideout" />' )
			.append( '<a />' );
	}

	Mmenu.node.$blck
		.appendTo( conf.menu.insertSelector )
		.off( 'touchstart.mm-offCanvas touchmove.mm-offCanvas' )
		.on( 'touchstart.mm-offCanvas touchmove.mm-offCanvas',
			( e ) => {
				e.preventDefault();
				e.stopPropagation();
				Mmenu.node.$blck.trigger( 'mousedown.mm-offCanvas' );
			}
		)
		.off( 'mousedown.mm-offCanvas' )
		.on( 'mousedown.mm-offCanvas',
			( e ) => {
				e.preventDefault();
				if ( !Mmenu.$('html').hasClass( 'mm-wrapper_modal' ) )
				{
					this.closeAllOthers();
					this.close();
				}
			}
		);

	this.trigger( 'initBlocker:after' );
};
