/*!
 * mmenu.js v8.0.1
 * mmenujs.com
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */

import options from './_options';
import configs from './_configs';


/**
 * Class for a mobile menu.
 */
export default class Mmenu {

	/**	Plugin version. */
	static version : string = '8.0.1'


	/**	Default options for menus. */
	static options : mmOptions = options

	/**	Default configuration for menus. */
	static configs : mmConfigs = configs


	/**	Available add-ons for the plugin. */
	static addons  	: mmLooseObject	= {}

	/** Available wrappers for the plugin. */
	static wrappers : mmFunctionObject	= {}

	/**	Globally used HTML elements. */
	static node 	: mmHtmlObject = {}

	/** Globally used EventListeners. */
	static evnt		: mmEventObject = {}

	/**	Features supported by the browser. */
	static support 	: mmBooleanObject = {
		touch: 'ontouchstart' in window || (navigator.msMaxTouchPoints ? true : false) || false
	}


	/**	Options for the menu. */
	opts 	: mmOptions

	/** Configuration for the menu. */
	conf 	: mmConfigs

	/**	Mmethods to expose in the API. */
	_api	: string[]

	/** The menu API. */
	API		: mmApi


	/** HTML elements used for the menu. */
	node 	: mmHtmlObject

	/** Variables used for the menu. */
	vars	: mmLooseObject

	/** Callback hooks used for the menu. */
	hook	: mmLooseObject

	/** MatchMedia hooks used for the menu. */
	mtch	: mmLooseObject

	/** EventListeners used for the menu. */
	evnt	: mmEventObject;

	/** Click handlers used for the menu. */
	clck	: Function[]


	/** Log deprecated warnings when using the debugger. */
	_deprecated : Function

	/** Log debug messages when using the debugger. */
	_debug : Function


	//	screenReader add-on
	static sr_aria	: Function
	static sr_role	: Function
	static sr_text	: Function


	//	TODO: what of the below can be replaced with local functions?


	//	offCanvas add-on
	open 					: Function

	/** Setup the menu so it can be opened. */
	_openSetup 				: Function
	_openFinish 			: Function

	/** Close the menu. */
	close 					: Function
	closeAllOthers 			: Function
	setPage 				: Function
	_initBlocker 			: Function
	_initWindow_offCanvas 	: Function


	//	keyboardNavigation add-on
	_initWindow_keyboardNavigation	: Function


	//	searchfield add-on
	search				: Function
	_initSearchPanel	: Function
	_initNoResultsMsg	: Function
	_initSearchfield	: Function
	_initSearching		: Function



	/**
	 * Create a mobile menu.
	 *
	 * @param {HTMLElement|string} 	menu						The menu node.
	 * @param {object} 				[options=Mmenu.options]		Options for the menu.
	 * @param {object} 				[configs=Mmenu.configs]		Configuration options for the menu.
	 */
	constructor(
		menu 		 : HTMLElement | string,
		options 	?: mmOptions,
		configs		?: mmConfigs
	) {

		//	Extend options and configuration from defaults.
		this.opts 	= Mmenu.extend( options, Mmenu.options );
		this.conf 	= Mmenu.extend( configs, Mmenu.configs );

		//	Methods to expose in the API.
		this._api	= [ 'bind', 'initPanels', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected' ];

		//	Storage objects for nodes, variables, hooks, matchmedia and click handlers.
		this.node	= {};
		this.vars	= {};
		this.hook 	= {};
		this.mtch 	= {};
		this.evnt 	= {};
		this.clck 	= [];

		//	Get menu node from string or element.
		this.node.menu = ( typeof menu == 'string' )
			? document.querySelector( menu )
			: menu;


		if ( typeof this._deprecated == 'function' ) {
			this._deprecated();
		}

		this._initWrappers();
		this._initAddons();
		this._initExtensions();

		this._initHooks();
		this._initAPI();

		this._initMenu();
		this._initPanels();
		this._initOpened();
		this._initAnchors();
		this._initMatchMedia();

		if ( typeof this._debug == 'function' ) {
			this._debug();
		}


		return this;
	}


	/**
	 * Open a panel.
	 *
	 * @param {HTMLElement} panel				Panel to open.
	 * @param {boolean}		[animation=true]	Whether or not to open the panel with an animation.
	 */
	openPanel( 
		panel 		 : HTMLElement,
		animation	?: boolean
	) {
		//	Invoke "before" hook.
		this.trigger( 'openPanel:before', [ panel ] );


		//	Find panel.
		if ( !panel ) {
			return;
		}
		if ( !panel.matches( '.mm-panel' ) ) {
			panel = (panel.closest( '.mm-panel' ) as HTMLElement);
		}
		if ( !panel ) {
			return;
		}
		//	/Find panel.


		if ( typeof animation != 'boolean' ) {
			animation = true;
		}


		//	Open a "vertical" panel.
		if ( panel.parentElement.matches( '.mm-listitem_vertical' ) ) {

			//	Open current and all vertical parent panels.
			Mmenu.DOM.parents( panel, '.mm-listitem_vertical' )
				.forEach(( listitem ) => {
					panel.classList.add( 'mm-listitem_opened' );
					Mmenu.DOM.children( listitem, '.mm-panel' )
						.forEach(( panel ) => {
							panel.classList.remove( 'mm-hidden' );
						})
				});

			//	Open first non-vertical parent panel.
			let parents = Mmenu.DOM.parents( panel, '.mm-panel' )
				.filter( panel => !panel.parentElement.matches( '.mm-listitem_vertical' ) );

			this.trigger( 'openPanel:start' , [ panel ] );

			if ( parents.length ) {
				this.openPanel( parents[ 0 ] );
			}

			this.trigger( 'openPanel:finish', [ panel ] );


		//	Open a "horizontal" panel.
		} else {
			if ( panel.matches( '.mm-panel_opened' ) ) {
				return;
			}

			let panels 	= Mmenu.DOM.children( this.node.pnls, '.mm-panel' ),
				current = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];

			//	Close all child panels.
			panels.filter( parent => parent !== panel )
				.forEach(( parent ) => {
					parent.classList.remove( 'mm-panel_opened-parent' );
				});

			//	Open all parent panels.
			let parent : HTMLElement = panel[ 'mmParent' ];
			while( parent ) {
				parent = (parent.closest( '.mm-panel' ) as HTMLElement);
				if ( parent ) {
					if ( !parent.parentElement.matches( '.mm-listitem_vertical' ) ) {
						parent.classList.add( 'mm-panel_opened-parent' );
					}
					parent = parent[ 'mmParent' ];
				}
			}

			//	Add classes for animation.
			panels.forEach(( panel ) => {
				panel.classList.remove(  'mm-panel_highest' );
			});

			panels.filter( hidden => hidden !== current )
				.filter( hidden => hidden !== panel )
				.forEach(( hidden ) => {
					hidden.classList.add( 'mm-hidden' );
				});

			panel.classList.remove( 'mm-hidden' );

			/**	Start opening the panel. */
			let openPanelStart = () => {
				if ( current ) {
					current.classList.remove( 'mm-panel_opened' );
				}
				panel.classList.add( 'mm-panel_opened' );

				if ( panel.matches( '.mm-panel_opened-parent' ) ) {
					if ( current ) {
						current.classList.add( 'mm-panel_highest' );
					}
					panel.classList.remove( 'mm-panel_opened-parent' );

				} else {
					if ( current ) {
						current.classList.add( 'mm-panel_opened-parent' );
					}
					panel.classList.add( 'mm-panel_highest' );
				}


				//	Invoke "start" hook.
				this.trigger( 'openPanel:start', [ panel ] );
			};

			/**	Finish opening the panel. */
			let openPanelFinish = () => {
				if ( current ) {
					current.classList.remove( 'mm-panel_highest' );
					current.classList.add( 'mm-hidden' );
				}
				panel.classList.remove( 'mm-panel_highest' );


				//	Invoke "finish" hook.
				this.trigger( 'openPanel:finish', [ panel ] );
			};

			if ( animation && !panel.matches( '.mm-panel_noanimation' ) ) {

				//	Without the timeout the animation will not work because the element had display: none;
				//	RequestAnimationFrame would be nice here.
				setTimeout(() => {
					//	Callback
					Mmenu.transitionend( panel,
						() => {
							openPanelFinish();
						}, this.conf.transitionDuration
					);

					openPanelStart();

				}, this.conf.openingInterval );

			} else {
				openPanelStart();
				openPanelFinish();
			}
		}

		//	Invoke "after" hook.
		this.trigger( 'openPanel:after', [ panel ] );
	}


	/**
	 * Close a panel.
	 *
	 * @param {HTMLElement} panel Panel to close.
	 */
	closePanel( 
		panel : HTMLElement
	) {
		//	Invoke "before" hook.
		this.trigger( 'closePanel:before', [ panel ] );


		var li = panel.parentElement;

		//	Only works for "vertical" panels.
		if ( li.matches( '.mm-listitem_vertical' ) ) {
			li.classList.remove( 'mm-listitem_opened' );
			panel.classList.add( 'mm-hidden' );


			//	Invoke main hook.
			this.trigger( 'closePanel', [ panel ] );
		}


		//	Invoke "after" hook.
		this.trigger( 'closePanel:after', [ panel ] );
	}


	/**
	 * Close all opened panels.
	 *
	 * @param {HTMLElement} panel Panel to open after closing all other panels.
	 */
	closeAllPanels( 
		panel ?: HTMLElement
	) {
		//	Invoke "before" hook.
		this.trigger( 'closeAllPanels:before' );


		//	Close all "vertical" panels.
		let listitems = this.node.pnls.querySelectorAll( '.mm-listitem' );
		listitems.forEach(( listitem ) => {
			listitem.classList.remove( 'mm-listitem_selected', 'mm-listitem_opened' );
		});

		//	Close all "horizontal" panels.
		var panels = Mmenu.DOM.children( this.node.pnls, '.mm-panel' ),
			opened = ( panel ) ? panel : panels[ 0 ];

		Mmenu.DOM.children( this.node.pnls, '.mm-panel' )
			.forEach(( panel ) => {
				if ( panel !== opened ) {
					panel.classList.remove( 'mm-panel_opened' );
					panel.classList.remove( 'mm-panel_opened-parent' );
					panel.classList.remove( 'mm-panel_highest' );
					panel.classList.add( 'mm-hidden' );
				}
			});

		//	Open first panel.
		this.openPanel( opened, false );


		//	Invoke "after" hook.
		this.trigger( 'closeAllPanels:after' );
	}


	/**
	 * Toggle a panel opened/closed.
	 *
	 * @param {HTMLElement} panel Panel to open or close.
	 */
	togglePanel(
		panel : HTMLElement
	) {
		let listitem = panel.parentElement;

		//	Only works for "vertical" panels.
		if ( listitem.matches( '.mm-listitem_vertical' ) ) {
			this[ listitem.matches( '.mm-listitem_opened' ) ? 'closePanel' : 'openPanel' ]( panel );
		}
	}


	/**
	 * Display a listitem as being "selected".
	 *
	 * @param {HTMLElement} listitem Listitem to mark.
	 */
	setSelected(
		listitem : HTMLElement
	) {
		//	Invoke "before" hook.
		this.trigger( 'setSelected:before', [ listitem ] );


		//	First, remove the selected class from all listitems.
		Mmenu.DOM.find( this.node.menu, '.mm-listitem_selected' )
			.forEach(( li ) => {
				li.classList.remove( 'mm-listitem_selected' );
			});

		//	Next, add the selected class to the provided listitem.
		listitem.classList.add( 'mm-listitem_selected' );


		//	Invoke "after" hook.
		this.trigger( 'setSelected:after', [ listitem ] );
	}


	/**
	 * Bind a function to a hook.
	 *
	 * @param {string} 		hook The hook.
	 * @param {function} 	func The function.
	 */
	bind( 
		hook : string,
		func : Function
	) {
		//	Create an array for the hook if it does not yet excist.
		this.hook[ hook ] = this.hook[ hook ] || [];

		//	Push the function to the array.
		this.hook[ hook ].push( func );
	}


	/**
	 * Invoke the functions bound to a hook.
	 *
	 * @param {string} 	hook  	The hook.
	 * @param {array}	[args] 	Arguments for the function.
	 */
	trigger(
		hook  : string,
		args ?: any[]
	) {
		if ( this.hook[ hook ] ) {
			for ( var h = 0, l = this.hook[ hook ].length; h < l; h++ ) {
                this.hook[ hook ][ h ].apply( this, args );
            }
		}
	}


	/**
	 * Bind functions to a matchMedia listener.
	 *
	 * @param {string} 		mediaquery 	Media query to match.
	 * @param {function} 	yes 		Function to invoke when the media query matches.
	 * @param {function} 	no 			Function to invoke when the media query doesn't match.
	 */
	matchMedia( 
		mediaquery	 : string,
		yes			?: Function,
		no			?: Function
	) {
		this.mtch[ mediaquery ] = this.mtch[ mediaquery ] || [];
		this.mtch[ mediaquery ].push({
			'yes': yes,
			'no' : no
		});
	}


	/**
	 * Initialize the matchMedia listener.
	 */
	_initMatchMedia()
	{
		for ( var mediaquery in this.mtch ) {
			let mqstring = mediaquery,
				mqlist   = window.matchMedia( mqstring );

			this._fireMatchMedia( mqstring, mqlist );
			mqlist.addListener(( mqlist ) => {
				this._fireMatchMedia( mqstring, mqlist );
			});
		}
	}


	/**
	 * Fire the "yes" or "no" function for a matchMedia listener.
	 *
	 * @param {string} 			mqstring 	Media query to check for.
	 * @param {MediaQueryList} 	mqlist 		Media query list to check with.
	 */
	_fireMatchMedia(
		mqstring : string,
		mqlist	 : MediaQueryList | MediaQueryListEvent
	) {
		var fn = mqlist.matches ? 'yes' : 'no';
		for ( let m = 0; m < this.mtch[ mqstring ].length; m++ ) {
			this.mtch[ mqstring ][ m ][ fn ].call( this );
		}
	}


	/**
	 * Create the API.
	 */
	_initAPI()
	{
		//	We need this=that because:
		//	1) the "arguments" object can not be referenced in an arrow function in ES3 and ES5.
		var that = this;

		(this.API as mmLooseObject) = {};

		this._api.forEach(( fn ) => {
			this.API[ fn ] = function() {
				var re = that[ fn ].apply( that, arguments ); // 1)
				return ( typeof re == 'undefined' ) ? that.API : re;
			};
		});

		//	Store the API in the HTML node for external usage.
		this.node.menu[ 'mmenu' ] = this.API;
	}


	/**
	 * Bind the hooks specified in the options.
	 */
	_initHooks()
	{
		for ( let hook in this.opts.hooks ) {
			this.bind( hook, this.opts.hooks[ hook ] );
		}
	}


	/**
	 * Initialize the wrappers specified in the options.
	 */
	_initWrappers()
	{
		//	Invoke "before" hook.
		this.trigger( 'initWrappers:before' );


		for ( let w = 0; w < this.opts.wrappers.length; w++ ) {
			Mmenu.wrappers[ this.opts.wrappers[ w ] ].call( this );
		}


		//	Invoke "after" hook.
		this.trigger( 'initWrappers:after' );
	}


	/**
	 * Initialize all available add-ons.
	 */
	_initAddons()
	{
		//	Invoke "before" hook.
		this.trigger( 'initAddons:before' );


		for ( let addon in Mmenu.addons ){
			Mmenu.addons[ addon ].call( this );
		}


		//	Invoke "after" hook.
		this.trigger( 'initAddons:after' );
	}


	/**
	 * Initialize the extensions specified in the options.
	 */
	_initExtensions()
	{
		//	Invoke "before" hook.
		this.trigger( 'initExtensions:before' );


		//	Convert array to object with array.
		if ( Mmenu.typeof( this.opts.extensions ) == 'array' ) {
			this.opts.extensions = {
				'all': this.opts.extensions
			};
		}

		//	Loop over object.
		for ( let mediaquery in this.opts.extensions ) {
			if ( this.opts.extensions[ mediaquery ].length ) {
				let classnames = this.opts.extensions[ mediaquery ].map(( query ) => 'mm-menu_' + query );

				this.matchMedia( mediaquery, () => {
					this.node.menu.classList.add( ...classnames );
				}, () => {
					this.node.menu.classList.remove( ...classnames );
				});
			}
		}

		//	Invoke "after" hook.
		this.trigger( 'initExtensions:after' );
	}


	/**
	 * Initialize the menu.
	 */
	_initMenu()
	{
		//	Invoke "before" hook.
		this.trigger( 'initMenu:before' );


		//	Add an ID to the menu if it does not yet have one.
		this.node.menu.id 	= this.node.menu.id || Mmenu.getUniqueId();

		//	Store the original menu ID.
		this.vars.orgMenuId = this.node.menu.id;

		//	Clone if needed.
		if ( this.conf.clone ) {

			//	Store the original menu.
			this.node.orig = this.node.menu;

			//	Clone the original menu and store it.
			this.node.menu = (this.node.orig.cloneNode( true ) as HTMLElement);

			//	Prefix all ID's in the cloned menu.
			this.node.menu.id = 'mm-' + this.node.menu.id;
			Mmenu.DOM.find( this.node.menu, '[id]' )
				.forEach(( elem ) => {
					elem.id = 'mm-' + elem.id;
				});
		}

		//	Wrap the panels in a node.
		let panels = Mmenu.DOM.create( 'div.mm-panels' );

		Mmenu.DOM.children( this.node.menu )
			.forEach(( panel ) => {
				if ( this.conf.panelNodetype.indexOf( panel.nodeName.toLowerCase() ) > -1 ) {
					panels.append( panel );
				}
			});
		
		this.node.menu.append( panels );
		this.node.pnls = panels;


		//	Add class to the menu.
		this.node.menu.classList.add( 'mm-menu' );

		//	Add class to the wrapper.
		this.node.menu.parentElement.classList.add( 'mm-wrapper' );


		//	Invoke "after" hook.
		this.trigger( 'initMenu:after' );
	}


	/**
	 * Initialize panels.
	 *
	 * @param {array} [panels] Panels to initialize.
	 */
	_initPanels(
		panels ?: HTMLElement[]
	) {

		//	Open / close panels.
		this.clck.push((
			anchor	: HTMLElement,
			args 	: mmClickArguments
		) => {
			if ( args.inMenu ) {
				var href = anchor.getAttribute( 'href' );
				if ( href && href.length > 1 && href.slice( 0, 1 ) == '#' ) {
					try {
						let panel = Mmenu.DOM.find( this.node.menu, href )[ 0 ];
						if ( panel && panel.matches( '.mm-panel' ) ) {
							if ( anchor.parentElement.matches( '.mm-listitem_vertical' ) ) {
								this.togglePanel( panel );
							} else {
								this.openPanel( panel );
							}
							return true;
						}
					}
					catch( err ) {}
				}
			}
		});

		//	Actually initialise the panels
		this.initPanels( panels );
	}


	/**
	 * Initialize panels.
	 *
	 * @param {array} [panels] The panels to initialize.
	 */
	initPanels( 
		panels ?: HTMLElement[]
	) {
		//	Invoke "before" hook.
		this.trigger( 'initPanels:before', [ panels ] );


		var panelNodetype = this.conf.panelNodetype.join( ', ' );

		//	If no panels provided, use all panels.
		panels = panels || Mmenu.DOM.children( this.node.pnls, panelNodetype );

		var newpanels : HTMLElement[] = [];

		var init = ( 
			panels : HTMLElement[]
		) => {
			panels.filter( panel => panel.matches( panelNodetype ) )
				.forEach(( panel ) => {
					var panel = this._initPanel( panel );
					if ( panel ) {

						this._initNavbar( panel );
						this._initListview( panel );

						newpanels.push( panel );

						//	Init subpanels.
						var children : HTMLElement[] = [];

						//	Find panel > panel
						children.push( ...Mmenu.DOM.children( panel, '.' + this.conf.classNames.panel ) );

						//	Find panel listitem > panel
						Mmenu.DOM.children( panel, '.mm-listview' )
							.forEach(( listview ) => {
								Mmenu.DOM.children( listview, '.mm-listitem' )
									.forEach(( listitem ) => {
										children.push( ...Mmenu.DOM.children( listitem, panelNodetype ) );
									});
							});

						if ( children.length ) {
							init( children );
						}
					}
				});
		};

		init( panels );


		//	Invoke "after" hook.
		this.trigger( 'initPanels:after', [ newpanels ] );
	}


	/**
	 * Initialize a single panel.
	 *
	 * @param  {HTMLElement} 		panel 	Panel to initialize.
	 * @return {HTMLElement|null} 			Initialized panel.
	 */
	_initPanel(
		panel : HTMLElement
	) : HTMLElement {
		//	Invoke "before" hook.
		this.trigger( 'initPanel:before', [ panel ] );


		//	Stop if already a panel.
		if ( panel.matches( '.mm-panel' ) ) {
			return panel;
		}


		//	Refactor panel classnames
		Mmenu.refactorClass( panel, this.conf.classNames.panel 		, 'mm-panel' 			);
		Mmenu.refactorClass( panel, this.conf.classNames.nopanel 	, 'mm-nopanel' 			);
		Mmenu.refactorClass( panel, this.conf.classNames.inset 		, 'mm-listview_inset'	);

		if ( panel.matches( '.mm-listview_inset' ) ) {
			panel.classList.add( 'mm-nopanel' );
		}


		//	Stop if not supposed to be a panel.
		if ( panel.matches( '.mm-nopanel' ) ) {
			return null;
		}


		//	Wrap UL/OL in DIV
		var vertical = ( panel.matches( '.' + this.conf.classNames.vertical ) || !this.opts.slidingSubmenus );
		panel.classList.remove( this.conf.classNames.vertical );

		var id = panel.id || Mmenu.getUniqueId();

		if ( panel.matches( 'ul, ol' ) ) {
			panel.removeAttribute( 'id' );

			let wrapper = Mmenu.DOM.create( 'div' );
			panel.before( wrapper );
			wrapper.append( panel );

			panel = wrapper;
		}

		panel.id = id;
		panel.classList.add( 'mm-panel', 'mm-hidden' );

		var parent = [ panel.parentElement ].filter( listitem => listitem.matches( 'li' ) )[ 0 ];

		if ( vertical ) {
			if ( parent ) {
				parent.classList.add( 'mm-listitem_vertical' );
			}
		} else {
			this.node.pnls.append( panel );
		}

		//	Store parent/child relation
		if ( parent ) {
			parent[ 'mmChild' ] = panel;
			panel[ 'mmParent' ] = parent;
		}


		//	Invoke "after" hook.
		this.trigger( 'initPanel:after', [ panel ] );

		return panel;
	}


	/**
	 * Initialize a navbar.
	 *
	 * @param {HTMLElement} panel Panel for the navbar.
	 */
	_initNavbar(
		panel : HTMLElement
	) {
		//	Invoke "before" hook.
		this.trigger( 'initNavbar:before', [ panel ] );


		if ( Mmenu.DOM.children( panel, '.mm-navbar' ).length ) {
			return;
		}

		var parent : HTMLElement = panel[ 'mmParent' ],
			navbar : HTMLElement = Mmenu.DOM.create( 'div.mm-navbar' );

		var title = this._getPanelTitle( panel, this.opts.navbar.title ),
			href  = '';

		if ( parent ) {

			if ( parent.matches( '.mm-listitem_vertical' ) ) {
				return;
			}

			let opener : HTMLElement;

			//	Listview, the panel wrapping this panel
			if ( parent.matches( '.mm-listitem' ) ) {
				opener = Mmenu.DOM.children( parent, '.mm-listitem__text' )[ 0 ];
			
			//	Non-listview, the first anchor in the parent panel that links to this panel
			} else {
				opener = (panel.closest( '.mm-panel' ) as HTMLElement);
				opener = Mmenu.DOM.find( opener, 'a[href="#' + panel.id + '"]' )[ 0 ];
			}


			let id = opener.closest( '.mm-panel' ).id;
			title = this._getPanelTitle( panel, opener.textContent );

			switch ( this.opts.navbar.titleLink ) {
				case 'anchor':
					href = opener.getAttribute( 'href' );
					break;

				case 'parent':
					href = '#' + id;
					break;
			}

			let anchor = Mmenu.DOM.create( 'a.mm-btn.mm-btn_prev.mm-navbar__btn' );
				anchor.setAttribute( 'href', '#' + id );

			navbar.append( anchor );
		
		} else if ( !this.opts.navbar.title ) {
			return;
		}

		if ( this.opts.navbar.add ) {
			panel.classList.add( 'mm-panel_has-navbar' );
		}

		let anchor = Mmenu.DOM.create( 'a.mm-navbar__title' );
			anchor.innerHTML = (title as string);

		if ( href ) {
			anchor.setAttribute( 'href', href );
		}

		navbar.append( anchor );
		panel.prepend( navbar );


		//	Invoke "after" hook.
		this.trigger( 'initNavbar:after', [ panel ] );
	}


	/**
	 * Initialize a listview.
	 *
	 * @param {HTMLElement} panel Panel for the listview(s).
	 */
	_initListview(
		panel : HTMLElement
	) {
		//	Invoke "before" hook.
		this.trigger( 'initListview:before', [ panel ] );


		//	Refactor listviews classnames.
		var filter = 'ul, ol',
			listviews = Mmenu.DOM.children( panel, filter );

		if ( panel.matches( filter ) ) {
			listviews.unshift( panel );
		}

		listviews.forEach(( listview ) => {
			Mmenu.refactorClass( listview, this.conf.classNames.nolistview, 'mm-nolistview' );
		});


		var listitems : HTMLElement[] = [];

		//	Refactor listitems classnames
		listviews.forEach(( listview ) => {
			if ( !listview.matches( '.mm-nolistview' ) ) {
				listview.classList.add( 'mm-listview' );

				Mmenu.DOM.children( listview )
					.forEach(( listitem ) => {
						listitem.classList.add( 'mm-listitem' );

						Mmenu.refactorClass( listitem, this.conf.classNames.selected 	, 'mm-listitem_selected' 	);
						Mmenu.refactorClass( listitem, this.conf.classNames.divider 	, 'mm-listitem_divider'		);
						Mmenu.refactorClass( listitem, this.conf.classNames.spacer 		, 'mm-listitem_spacer'		);

						Mmenu.DOM.children( listitem, 'a, span' )
							.forEach(( item ) => {
								if ( !item.matches( '.mm-btn' ) ) {
									item.classList.add( 'mm-listitem__text' );
								}
							});
					});
			}
		});


		//	Add open link to parent listitem
		var parent : HTMLElement = panel[ 'mmParent' ];
		if ( parent && parent.matches( '.mm-listitem' ) ){
			if ( !Mmenu.DOM.children( parent, '.mm-btn' ).length ) {

				let item = Mmenu.DOM.children( parent, 'a, span' )[ 0 ];

				if ( item ) {
					let button = Mmenu.DOM.create( 'a.mm-btn.mm-btn_next.mm-listitem__btn' );
						button.setAttribute( 'href', '#' + panel.id );

					item.parentElement.insertBefore( button, item.nextSibling );

					if ( item.matches( 'span' ) ) {
						button.classList.add( 'mm-listitem__text' );
						button.innerHTML = item.innerHTML;
						item.remove();
					}
				}
			}
		}


		//	Invoke "after" hook.
		this.trigger( 'initListview:after', [ panel ] );
	}


	/**
	 * Find and open the correct panel after creating the menu.
	 */
	_initOpened()
	{
		//	Invoke "before" hook.
		this.trigger( 'initOpened:before' );


		//	Find all selected listitems.
		let listitems = this.node.pnls.querySelectorAll( '.mm-listitem_selected' );
		
		//	Deselect the listitems.
		let lastitem = null;
		listitems.forEach(( listitem ) => {
			lastitem = listitem;
			listitem.classList.remove( 'mm-listitem_selected' );
		});

		if ( lastitem ) {
			lastitem.classList.add( 'mm-listitem_selected' );
		}

		//	Find the current opened panel.
		let current = ( lastitem ) 
			? lastitem.closest( '.mm-panel' )
			: Mmenu.DOM.children( this.node.pnls, '.mm-panel' )[ 0 ];

		//	Open the current opened panel.
		this.openPanel( current, false );


		//	Invoke "after" hook.
		this.trigger( 'initOpened:after' );
	}


	/**
	 * Initialize anchors in / for the menu.
	 */
	_initAnchors()
	{
		//	Invoke "before" hook.
		this.trigger( 'initAnchors:before' );

		document.addEventListener( 'click', ( evnt ) => {

			var target = (evnt.target as HTMLElement);

			if ( !target.matches( 'a[href]' ) ) {
				target = (target.closest( 'a[href]' ) as HTMLElement);
				if ( !target ) {
					return;
				}
			}

			var args : mmClickArguments = {
				inMenu		: target.closest( '.mm-menu' ) === this.node.menu,
				inListview 	: target.matches( '.mm-listitem > a' ),
				toExternal 	: target.matches( '[rel="external"]' ) || target.matches( '[target="_blank"]' )
			};

			var onClick : mmOptionsOnclick = {
				close 			: null,
				setSelected 	: null,
				preventDefault	: target.getAttribute( 'href' ).slice( 0, 1 ) == '#'
			};


			//	Find hooked behavior.
			for ( let c = 0; c < this.clck.length; c++ ) {
				let click = this.clck[ c ].call( this, target, args );
				if ( click ) {
					if ( typeof click == 'boolean' ) {
						evnt.preventDefault();
						return;
					}
					if ( Mmenu.typeof( click ) == 'object' ) {
						onClick = Mmenu.extend( click, onClick );
					}
				}
			}


			//	Default behavior for anchors in lists.
			if ( args.inMenu && args.inListview && !args.toExternal ) {

				//	Set selected item, Default: true
				if ( Mmenu.valueOrFn( target, this.opts.onClick.setSelected, onClick.setSelected ) ) {
					this.setSelected( target.parentElement );
				}

				//	Prevent default / don't follow link. Default: false.
				if ( Mmenu.valueOrFn( target, this.opts.onClick.preventDefault, onClick.preventDefault ) ) {
					evnt.preventDefault();
				}

				//	Close menu. Default: false
				//		TODO: option + code should be in offcanvas add-on
				if ( Mmenu.valueOrFn( target, this.opts.onClick.close, onClick.close ) ) {
					if ( this.opts.offCanvas && typeof this.close == 'function' ) {
						this.close();
					}
				}
			}

		}, true);


		//	Invoke "after" hook.
		this.trigger( 'initAnchors:after' );
	}


//	TODO: interface that tells what will be returned based on input
	/**
	 * Get the translation for a text.
	 *
	 * @param  {string} text 	Text to translate.
	 * @return {string}			The translated text.
	 */
	i18n(
		text : string
	) : string | object {
		return Mmenu.i18n( text, this.conf.language );
	}


//	TODO: interface that tells what will be returned based on input
	/**
	 * get or set a translated / translatable text.
	 *
	 * @param  {string|object} 	[text] 		The translated text to add or get.
	 * @param  {string} 		[language] 	The language for the translated text.
	 * @return {string|object}				The translated text.
	 */
	static i18n : mmMethodI18n = (function() {

		var translations = {};

		return ( 
			text		?: string | object,
			language	?: string
		) : string | object => {
			switch( Mmenu.typeof( text ) ) {
				case 'object':
					if ( typeof language == 'string' ) {
						if ( typeof translations[ language ] == 'undefined' ) {
							translations[ language ] = {};
						}
						Mmenu.extend( translations[ language ], (text as object) );
					}
					return translations;

				case 'string':
					if ( typeof language == 'string' &&
						Mmenu.typeof( translations[ language ] ) == 'object'
					) {
						return translations[ language ][ (text as string) ] || text;
					}
					return text;

				case 'undefined':
				default:
					return translations;
			}
		};
	})();


	/**
	 * Find the title for a panel.
	 *
	 * @param 	{HTMLElement}			panel 		Panel to search in.
	 * @param 	{string|Function} 		[dfault] 	Fallback/default title.
	 * @return	{string}							The title for the panel.
	 */
	_getPanelTitle( 
		panel   : HTMLElement, 
		dfault ?: string | Function
	) : string | object {
		var title : string;

		//	Function
		if ( typeof this.opts.navbar.title == 'function' ) {
			title = (this.opts.navbar.title as Function).call( panel );
		}

		//	Data attr
		if ( typeof title == 'undefined' ) {
			title = panel.getAttribute( 'mm-data-title' );
		}

		if ( typeof title == 'string' && title.length ) {
			return title;
		}

		//	Fallback
		if ( typeof dfault == 'string' ) {
			return this.i18n( dfault );

		} else if ( typeof dfault == 'function' ){
			return this.i18n( (dfault as Function).call( panel ) );
		}

		//	Default
		if ( typeof Mmenu.options.navbar.title == 'string' ) {
			return this.i18n( Mmenu.options.navbar.title );
		}

		return this.i18n( 'Menu' );
	}


	/**
	 * Find the value from an option or function.
	 *
	 * @param 	{HTMLElement} 	element 	Scope for the function.
	 * @param 	{any} 			[option] 	Value or function.
	 * @param 	{any} 			[dfault] 	Default fallback value.
	 * @return	{any}						The given evaluation of the given option, or the default fallback value.
	 */
	static valueOrFn( 
		element	 : HTMLElement,
		option	?: any,
		dfault 	?: any
	) : any {
		if ( typeof option == 'function' ) {
			var value = option.call( element );
			if ( typeof value != 'undefined' ) {
				return value;
			}
		}
		if ( ( typeof option == 'function' || typeof option == 'undefined' ) 
			&& typeof dfault != 'undefined'
		) {
			return dfault;
		}
		return option;
	}


	/** Set of DOM-traversing, -manupulation and -measuring methods. */
	static DOM = {

		/**
		 * Create an element with classname.
		 *
		 * @param 	{string}		selector	The nodeName and classnames for the element to create.
		 * @return	{HTMLElement}				The created element.
		 */
		create: (
			selector : string
		) : HTMLElement => {
			var elem;
			selector.split( '.' ).forEach(( arg, a ) => {
				if ( a == 0 ) {
					elem = document.createElement( arg );
				} else {
					elem.classList.add( arg );
				}
			});
			return elem;
		},

		/**
		 * Find all elements matching the selector.
		 * Basically the same as element.querySelectorAll() but it returns an actuall array.
		 *
		 * @param 	{HTMLElement} 	element Element to search in.
		 * @param 	{string}		filter	The filter to match.
		 * @return	{array}					Array of elements that match the filter.
		 */
		find: (
			element	: HTMLElement,
			filter	: string
		) : HTMLElement[] => {
			return Array.prototype.slice.call( element.querySelectorAll( filter ) );
		},

		/**
		 * Find all child elements matching the (optional) selector.
		 *
		 * @param 	{HTMLElement} 	element Element to search in.
		 * @param 	{string}		filter	The filter to match.
		 * @return	{array}					Array of child elements that match the filter.
		 */
		children: (
			element	 : HTMLElement,
			filter	?: string
		) : HTMLElement[] => {
			var children : HTMLElement[] = Array.prototype.slice.call( element.children );
			return filter
				? children.filter( child => child.matches( filter ) )
				: children;
		},

		/**
		 * Find all preceding elements matching the selector.
		 *
		 * @param 	{HTMLElement} 	element Element to start searching from.
		 * @param 	{string}		filter	The filter to match.
		 * @return	{array}					Array of preceding elements that match the selector.
		 */
		parents: (
			element	 : HTMLElement,
			filter	?: string
		) : HTMLElement[] => {

			/** Array of preceding elements that match the selector. */
			var parents : HTMLElement[] = [];

			/** Array of preceding elements that match the selector. */
			var parent = element.parentElement;
			while ( parent )  {
				parents.push( parent );
				parent = parent.parentElement;
			}

			return filter
				? parents.filter( parent => parent.matches( filter ) )
				: parents;
		},

		/**
		 * Find all previous siblings matching the selecotr.
		 *
		 * @param 	{HTMLElement} 	element Element to start searching from.
		 * @param 	{string}		filter	The filter to match.
		 * @return	{array}					Array of previous siblings that match the selector.
		 */
		prevAll: (
			element	 : HTMLElement,
			filter  ?: string
		) : HTMLElement[] => {

			/** Array of previous siblings that match the selector. */
			var previous : HTMLElement[] = [];

			/** Current element in the loop */
			var current = (element.previousElementSibling as HTMLElement);

			while ( current ) {
				if ( !filter || current.matches( filter ) ) {
					previous.push( current );
				}
				current = (current.previousElementSibling as HTMLElement);
			}

			return previous;
		},

		/**
		 * Get an element offset relative to the document.
		 *
		 * @param 	{HTMLElement}	 element 			Element to start measuring from.
		 * @param 	{string}		 [direction=top] 	Offset top or left.
		 * @return	{number}							The element offset relative to the document.
		 */
		offset: (
			element 	 : HTMLElement,
			direction	?: string
		) : number => {

			return element.getBoundingClientRect()[ direction ] + document.body[ ( direction === 'left' ) ? 'scrollLeft' : 'scrollTop' ];
		}
	}


	/**
	 * Refactor a classname on multiple elements.
	 *
	 * @param {HTMLElement} element 	Element to refactor.
	 * @param {string}		oldClass 	Classname to remove.
	 * @param {string}		newClass 	Classname to add.
	 */
	static refactorClass( 
		element 	: HTMLElement,
		oldClass	: string,
		newClass	: string
	) {
		if ( element.matches( '.' + oldClass ) ) {
			element.classList.remove( oldClass );
			element.classList.add( newClass );
		}
	}


	/**
	 * Filter out non-listitem listitems.
	 *
	 * @param  {array} listitems 	Elements to filter.
	 * @return {array}				The filtered set of listitems.
	 */
	static filterListItems(
		listitems : HTMLElement[]
	) : HTMLElement[] {
		return listitems
			.filter( listitem => !listitem.matches( '.mm-listitem_divider' ) )
			.filter( listitem => !listitem.matches( '.mm-hidden' ) );
	}


	/**
	 * Find anchors in listitems (excluding anchor that open a sub-panel).
	 *
	 * @param  {array} 	listitems 	Elements to filter.
	 * @return {array}				The found set of anchors.
	 */
	static filterListItemAnchors(
		listitems : HTMLElement[]
	) : HTMLElement[] {
		var anchors = [];
		Mmenu.filterListItems( listitems )
			.forEach(( listitem ) => {
				anchors.push( ...Mmenu.DOM.children( listitem, 'a.mm-listitem__text' ) );
			});
		return anchors.filter( anchor => !anchor.matches( '.mm-btn_next' ) )
	}


	/**
	 * Set and invoke a (single) transition-end function with fallback.
	 *
	 * @param {HTMLElement} 	eelement 	Scope for the function.
	 * @param {function}		func		Function to invoke.
	 * @param {number}			duration	The duration of the animation (for the fallback).
	 */
	static transitionend( 
		element 	: HTMLElement,
		func 		: Function,
		duration	: number
	) {
		var guid = Mmenu.getUniqueId();

		var _ended = false,
			_fn = function( evnt ) {
				if ( typeof evnt !== 'undefined' ) {
					if ( evnt.target !== element ) {
						return;
					}
				}

				if ( !_ended ) {
					element.removeEventListener( 	   'transitionend', _fn );
					element.removeEventListener( 'webkitTransitionEnd', _fn );
					func.call( element );
				}
				_ended = true;
			};

		element.addEventListener( 	    'transitionend', _fn );
		element.addEventListener( 'webkitTransitionEnd', _fn );
		setTimeout( _fn, duration * 1.1 );
	}


	/**
	 * Get an unique ID.
	 *
	 * @return {string} An unique ID.
	 */
	static getUniqueId : mmMethodUniqueid = (() => {
		var id = 0;

		//	Using a factory for the "id" local var.
		return () => {
			return 'mm-' + id++;
		};
	})()


	/**
	 * Get the type of any given variable. Improvement of "typeof".
	 *
	 * @param 	{any}		variable	The variable.
	 * @return	{string}				The type of the variable in lowercase.
	 */
	static typeof(
		variable : any
	) : string {
		return ({}).toString.call( variable ).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}


	/**
	 * Deep extend an object with the given defaults.
	 * Note that the extended object is not a clone, meaning the original object will also be updated.
	 *
	 * @param 	{object}	orignl	The object to extend to.
	 * @param 	{object}	dfault	The object to extend from.
	 * @return	{object}			The extended "orignl" object.
	 */
	static extend (
		orignl	: any,	//	Unfortunately, Typescript doesn't allow "object", "mmLooseObject" or anything other than "any".
		dfault	: mmLooseObject
	) {
		if ( Mmenu.typeof( orignl ) != 'object' ) {
			orignl = {};
		}
		if ( Mmenu.typeof( dfault ) != 'object' ) {
			dfault = {};
		}

		for ( let k in dfault ) {
			if ( !dfault.hasOwnProperty( k ) ) {
				continue;
			}

			if ( typeof orignl[ k ] == 'undefined' ) {
				orignl[ k ] = dfault[ k ];

			} else if ( Mmenu.typeof( orignl[ k ] ) == 'object' ) {
				Mmenu.extend( orignl[ k ], dfault[ k ] );
			}
		}
		return orignl;
	}
}


import nl from './translations/nl';
import fa from './translations/fa';
import de from './translations/de';
import ru from './translations/ru';

Mmenu.i18n( nl, 'nl' );
Mmenu.i18n( fa, 'fa' );
Mmenu.i18n( de, 'de' );
Mmenu.i18n( ru, 'ru' );

