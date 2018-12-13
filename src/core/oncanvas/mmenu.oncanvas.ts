/*!
 * mmenu v8.0.0
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */


/**
 * Class for a mobile menu.
 */
class Mmenu {

	/**	Plugin version. */
	static version : string = '8.0.0'


	/**	Default options for menus. */
	static options : mmOptions = {
		hooks 				: {},
		extensions			: [],
		wrappers			: [],
		navbar 				: {
			add 				: true,
			title				: 'Menu',
			titleLink			: 'parent'
		},
		onClick				: {
			close				: null,
			preventDefault		: null,
			setSelected			: true
		},
		slidingSubmenus		: true
	}

	/**	Default configuration for menus. */
	static configs : mmConfigs = {
		classNames			: {
			divider				: 'Divider',
			inset 				: 'Inset',
			nolistview 			: 'NoListview',
			nopanel				: 'NoPanel',
			panel				: 'Panel',
			selected			: 'Selected',
			spacer				: 'Spacer',
			vertical			: 'Vertical'
		},
		clone				: false,
		language			: null,
		openingInterval		: 25,
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 400
	}


	/**	Available add-ons for the plugin. */
	static addons  	: mmLooseObject	= {}

	/** Available wrappers for the plugin. */
	static wrappers : mmLooseObject	= {}

	/**	Globally used HTML nodes. */
	static node 	: mmJqueryObject = {}

	/**	Features supported by the browser. */
	static support 	: mmLooseObject = {
		touch: 'ontouchstart' in window || navigator.msMaxTouchPoints || false,
	}


	/** Library for DOM traversal and DOM manipulations. */
	static $ : JQueryStatic = jQuery || Zepto || cash;


	/**	Options for the menu. */
	opts 	: mmOptions

	/** Configuration for the menu. */
	conf 	: mmConfigs

	/**	Mmethods to expose in the API. */
	_api	: string[]

	/** The menu API. */
	API		: mmApi


	/** HTML nodes used for the menu. */
	node 	: mmJqueryObject

	/** Variables used for the menu. */
	vars	: mmLooseObject
	
	/** Callback hooks used for the menu. */
	hook	: mmLooseObject

	/** MatchMedia hooks used for the menu. */
	mtch	: mmLooseObject

	/** Click handlers used for the menu. */
	clck	: Function[]


	/** Log deprecated warnings when using the debugger. */
	_deprecated : Function

	/** Log debug messages when using the debugger. */
	_debug 		: Function


	//	screenReader add-on
	static sr_aria	: Function
	static sr_role	: Function
	static sr_text	: Function


	//	TODO: what of the below can be replaced with local functions?


	//	offCanvas add-on
	open 					: Function
	_openSetup 				: Function
	_openFinish 			: Function
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
	 * @param {JQuery|string} 	$menu						The menu node.
	 * @param {object} 			[options=Mmenu.options]		Options for the menu.
	 * @param {object} 			[configs=Mmenu.configs]		Configuration options for the menu.
	 */
	constructor(
		$menu 		 : JQuery | string,
		options 	?: mmOptions,
		configs		?: mmConfigs
	) {

		//	Get menu node from string.
		if ( typeof $menu == 'string' )
		{
			$menu = Mmenu.$($menu);
		}

		//	Store menu node.
		this.node 	= {
			$menu : $menu
		};

		//	Extend options and configuration from defaults.
		this.opts 	= Mmenu.extend( options, Mmenu.options );
		this.conf 	= Mmenu.extend( configs, Mmenu.configs );

		//	Methods to expose in the API.
		this._api	= [ 'bind', 'initPanels', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected' ];

		//	Storage objects for variables, hooks, matchmedia and click handlers.
		this.vars	= {};
		this.hook 	= {};
		this.mtch 	= {};
		this.clck 	= [];


		if ( typeof this._deprecated == 'function' )
		{
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

		if ( typeof this._debug == 'function' )
		{
			this._debug();
		}


		return this;
	}


	/**
	 * Open a panel.
	 *
	 * @param {JQuery}	$panel				Panel to open.
	 * @param {boolean}	[animation=true]	Whether or not to open the panel with an animation.
	 */
	openPanel( 
		$panel 		 : JQuery,
		animation	?: boolean
	) {
		this.trigger( 'openPanel:before', [ $panel ] );

		if ( !$panel || !$panel.length )
		{
			return;
		}
		if ( !$panel.hasClass( 'mm-panel' ) )
		{
			$panel = $panel.closest( '.mm-panel' );
		}
		if ( !$panel.hasClass( 'mm-panel' ) )
		{
			return;
		}


		if ( Mmenu.typeof( animation ) != 'boolean' )
		{
			animation = true;
		}


		//	Open a "vertical" panel
		if ( $panel.parent( '.mm-listitem_vertical' ).length )
		{

			//	Open current and all vertical parent panels
			$panel
				.parents( '.mm-listitem_vertical' )
				.addClass( 'mm-listitem_opened' )
				.children( '.mm-panel' )
				.removeClass( 'mm-hidden' );

			//	Open first non-vertical parent panel
			this.openPanel( 
				$panel
					.parents( '.mm-panel' )
					.not(
						( i, elem ) => {
							return Mmenu.$(elem).parent( '.mm-listitem_vertical' ).length ? true : false
						}
					)
					.first()
			);

			this.trigger( 'openPanel:start' , [ $panel ] );
			this.trigger( 'openPanel:finish', [ $panel ] );
		}

		//	Open a "horizontal" panel
		else
		{
			if ( $panel.hasClass( 'mm-panel_opened' ) )
			{
				return;
			}

			var $panels 	= this.node.$pnls.children( '.mm-panel' ),
				$current 	= this.node.$pnls.children( '.mm-panel_opened' );


			//	Close all child panels
			$panels
				.not( $panel )
				.removeClass( 'mm-panel_opened-parent' );

			//	Open all parent panels
			var $parent : JQuery = ($panel[ 0 ] as any).mmParent;
			while( $parent )
			{
				$parent = $parent.closest( '.mm-panel' );
				if ( !$parent.parent( '.mm-listitem_vertical' ).length )
				{
					$parent.addClass( 'mm-panel_opened-parent' );
				}
				$parent = ($parent[ 0 ] as any).mmParent;
			}

			//	Add classes for animation
			$panels
				.removeClass( 'mm-panel_highest' )
				.not( $current )
				.not( $panel )
				.addClass( 'mm-hidden' );

			$panel
				.removeClass( 'mm-hidden' );

			//	Start opening the panel
			var openPanelStart = () => {
				$current.removeClass( 'mm-panel_opened' );
				$panel.addClass( 'mm-panel_opened' );

				if ( $panel.hasClass( 'mm-panel_opened-parent' ) )
				{
					$current.addClass( 'mm-panel_highest' );
					$panel.removeClass( 'mm-panel_opened-parent' );
				}
				else
				{
					$current.addClass( 'mm-panel_opened-parent' );
					$panel.addClass( 'mm-panel_highest' );
				}

				this.trigger( 'openPanel:start', [ $panel ] );
			};

			//	Finish opening the panel
			var openPanelFinish = () => {
				$current.removeClass( 'mm-panel_highest' ).addClass( 'mm-hidden' );
				$panel.removeClass( 'mm-panel_highest' );

				this.trigger( 'openPanel:finish', [ $panel ] );
			}

			if ( animation && !$panel.hasClass( 'mm-panel_noanimation' ) )
			{
				//	Without the timeout the animation will not work because the element had display: none;
				//	RequestAnimationFrame would be nice here.
				setTimeout(
					() => {
						//	Callback
						Mmenu.transitionend( $panel,
							() => {
								openPanelFinish();
							}, this.conf.transitionDuration
						);

						openPanelStart();

					}, this.conf.openingInterval
				);
			}
			else
			{
				openPanelStart();
				openPanelFinish();
			}
		}

		this.trigger( 'openPanel:after', [ $panel ] );
	}


	/**
	 * Close a panel.
	 *
	 * @param {JQuery} $panel Panel to close.
	 */
	closePanel( 
		$panel : JQuery
	) {
		this.trigger( 'closePanel:before', [ $panel ] );

		var $li = $panel.parent();

		//	Only works for "vertical" panels
		if ( $li.hasClass( 'mm-listitem_vertical' ) )
		{
			$li.removeClass( 'mm-listitem_opened' );
			$panel.addClass( 'mm-hidden' );

			this.trigger( 'closePanel', [ $panel ] );
		}

		this.trigger( 'closePanel:after', [ $panel ] );
	}


	/**
	 * Close all opened panels.
	 *
	 * @param {JQuery} [$panel] Panel to open after closing all other panels.
	 */
	closeAllPanels( 
		$panel ?: JQuery
	) {
		this.trigger( 'closeAllPanels:before' );

		//	Close all "vertical" panels.
		this.node.$pnls
			.find( '.mm-listview' )
			.children()
			.removeClass( 'mm-listitem_selected' )
			.filter( '.mm-listitem_vertical' )
			.removeClass( 'mm-listitem_opened' );

		//	Close all "horizontal" panels.
		var $pnls = this.node.$pnls.children( '.mm-panel' ),
			$frst = ( $panel && $panel.length ) ? $panel : $pnls.first();

		this.node.$pnls
			.children( '.mm-panel' )
			.not( $frst )
			.removeClass( 'mm-panel_opened' )
			.removeClass( 'mm-panel_opened-parent' )
			.removeClass( 'mm-panel_highest' )
			.addClass( 'mm-hidden' );

		//	Open first panel.
		this.openPanel( $frst, false );

		this.trigger( 'closeAllPanels:after' );
	}


	/**
	 * Toggle a panel opened/closed.
	 *
	 * @param {JQuery} $panel Panel to open or close.
	 */
	togglePanel(
		$panel : JQuery
	) {
		var $li = $panel.parent();

		//	Only works for "vertical" panels.
		if ( $li.hasClass( 'mm-listitem_vertical' ) )
		{
			this[ $li.hasClass( 'mm-listitem_opened' ) ? 'closePanel' : 'openPanel' ]( $panel );
		}
	}


	/**
	 * Display a listitem as being "selected".
	 *
	 * @param {JQuery} $listitem Listitem to mark.
	 */
	setSelected(
		$listitem : JQuery
	) {
		this.trigger( 'setSelected:before', [ $listitem ] );

		//	First, remove the selected class from all listitems.
		this.node.$menu
			.find( '.mm-listitem_selected' )
			.removeClass( 'mm-listitem_selected' );

		//	Next, add the selected class to the provided listitem.
		$listitem.addClass( 'mm-listitem_selected' );

		this.trigger( 'setSelected:after', [ $listitem ] );
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
		if ( this.hook[ hook ] )
		{
			for ( var h = 0, l = this.hook[ hook ].length; h < l; h++ )
            {
                this.hook[ hook ][ h ].apply( this, args );
            }
		}
	}


	/**
	 * Bind functions to the match-media listener.
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
	 * Initialize the match-media listener.
	 */
	_initMatchMedia()
	{
		for ( var mediaquery in this.mtch )
		{
			(() => {
				var mqstring = mediaquery,
					mqlist   = window.matchMedia( mqstring );

				this._fireMatchMedia( mqstring, mqlist );
				mqlist.addListener(
					( mqlist ) => {
						this._fireMatchMedia( mqstring, mqlist );
					}
				);
			})();
		}
	}


	/**
	 * Fire the "yes" or "no" function for a match-media listener.
	 *
	 * @param {string} 			mqstring 	Media query to check for.
	 * @param {MediaQueryList} 	mqlist 		Media query list to check with.
	 */
	_fireMatchMedia(
		mqstring : string,
		mqlist	 : any // Typescript "Cannot find name 'MediaQueryListEvent'."
	) {
		var fn = mqlist.matches ? 'yes' : 'no';
		for ( let m = 0; m < this.mtch[ mqstring ].length; m++ )
		{
			this.mtch[ mqstring ][ m ][ fn ].call( this );
		}
	}


	/**
	 * Create the API.
	 */
	_initAPI()
	{
		//	We need this/that because:
		//	1) the "arguments" object can not be referenced in an arrow function in ES3 and ES5.
		var that = this;

		(this.API as mmLooseObject) = {};

		this._api.forEach(
			( fn ) => {
				this.API[ fn ] = function()
				{
					var re = that[ fn ].apply( that, arguments ); // 1)
					return ( Mmenu.typeof( re ) == 'undefined' ) ? that.API : re;
				};
			}
		);

		//	Store the API in the HTML node for external useage.
		(this.node.$menu[ 0 ] as any).mmenu = this.API;
	}


	/**
	 * Bind the hooks specified in the options.
	 */
	_initHooks()
	{
		for ( let hook in this.opts.hooks )
		{
			this.bind( hook, this.opts.hooks[ hook ] );
		}
	}


	/**
	 * Initialize the wrappers specified in the options.
	 */
	_initWrappers()
	{
		this.trigger( 'initWrappers:before' );

		for ( let w = 0; w < this.opts.wrappers.length; w++ )
		{
			Mmenu.wrappers[ this.opts.wrappers[ w ] ].call( this );
		}

		this.trigger( 'initWrappers:after' );
	}


	/**
	 * Initialize all available add-ons.
	 */
	_initAddons()
	{
		this.trigger( 'initAddons:before' );

		for ( let addon in Mmenu.addons )
		{
			Mmenu.addons[ addon ].call( this );
		}

		this.trigger( 'initAddons:after' );
	}


	/**
	 * Initialize the extensions specified in the options.
	 */
	_initExtensions()
	{
		this.trigger( 'initExtensions:before' );

		//	Convert array to object with array
		if ( this.opts.extensions.constructor === Array )
		{
			this.opts.extensions = {
				'all': this.opts.extensions
			};
		}

		//	Loop over object
		for ( let mediaquery in this.opts.extensions )
		{
			this.opts[ 'extensions' ][ mediaquery ] = this.opts[ 'extensions' ][ mediaquery ].length ? 'mm-menu_' + this.opts[ 'extensions' ][ mediaquery ].join( ' mm-menu_' ) : '';
			if ( this.opts.extensions[ mediaquery ] )
			{
				(( mediaquery ) => {
					this.matchMedia( mediaquery,
						function()
						{
							this.node.$menu.addClass( this.opts.extensions[ mediaquery ] );
						},
						function()
						{
							this.node.$menu.removeClass( this.opts.extensions[ mediaquery ] );
						}
					);
				})( mediaquery );
			}
		}

		this.trigger( 'initExtensions:after' );
	}


	/**
	 * Initialize the menu.
	 */
	_initMenu()
	{
		this.trigger( 'initMenu:before' );

		this.vars.orgMenuId = this.node.$menu[ 0 ].id;

		//	Clone if needed.
		if ( this.conf.clone )
		{
			//	Store the original menu.
			this.node.$orig = this.node.$menu;

			//	Clone the original menu and store it.
			this.node.$menu = this.node.$orig.clone();

			//	Prefix all ID's in the cloned menu.
			this.node.$menu
				.filter( '[id]' )
				.add( this.node.$menu.find( '[id]' ) )
				.each(
					( i, elem ) => {
						elem.id = 'mm-' + elem.id;
					}
				);
		}

		//	Add an ID to the menu if it does not yet have one.
		this.node.$menu[ 0 ].id = this.node.$menu[ 0 ].id || Mmenu.getUniqueId();

		//	Wrap the panels in a node.
		this.node.$pnls = Mmenu.$( '<div class="mm-panels" />' )
			.append( this.node.$menu.children( this.conf.panelNodetype ) )
			.prependTo( this.node.$menu );

		//	Add classes to the menu.
		this.node.$menu
			.addClass( 'mm-menu' )
			.parent()
			.addClass( 'mm-wrapper' );

		this.trigger( 'initMenu:after' );
	}


	/**
	 * Initialize panels.
	 *
	 * @param {JQuery} [$panels] Panels to initialize.
	 */
	_initPanels(
		$panels ?: JQuery
	) {

		//	Open / close panels.
		this.clck.push(
			function(
				this : Mmenu,
				$a	 : JQuery,
				args : mmClickArguments
			) {
				if ( args.inMenu )
				{
					var href = $a[ 0 ].getAttribute( 'href' )
					if ( href.length > 1 && href.slice( 0, 1 ) == '#' )
					{
						try
						{
							var $panel = this.node.$menu.find( href );
							if ( $panel.is( '.mm-panel' ) )
							{
								if ( $a.parent().hasClass( 'mm-listitem_vertical' ) )
								{
									this.togglePanel( $panel );
								}
								else
								{
									this.openPanel( $panel );
								}
								return true;
							}
						}
						catch( err ) {}
					}
				}
			}
		);

		//	Actually initialise the panels
		this.initPanels( $panels );
	}


	/**
	 * Initialize panels.
	 *
	 * @param {JQuery} [$panels] The panels to initialize.
	 */
	initPanels( 
		$panels ?: JQuery
	) {
		this.trigger( 'initPanels:before', [ $panels ] );

		//	If no panels provided, use all panels.
		$panels = $panels || this.node.$pnls.children( this.conf.panelNodetype );

		var $newpanels = Mmenu.$();

		var init = ( $panels ) => {
			$panels
				.filter( this.conf.panelNodetype )
				.each(
					( i, elem ) => {
						var $panel = this._initPanel( Mmenu.$(elem) );
						if ( $panel )
						{

							this._initNavbar( $panel );
							this._initListview( $panel );

							$newpanels = $newpanels.add( $panel );

							//	init child panels
							var $child = $panel
								.children( '.mm-listview' )
								.children( 'li' )
								.children( this.conf.panelNodetype )
								.add( $panel.children( '.' + this.conf.classNames.panel ) );

							if ( $child.length )
							{
								init( $child );
							}
						}
					}
				);
		};

		init( $panels );

		this.trigger( 'initPanels:after', [ $newpanels ] );
	}


	/**
	 * Initialize a single panel.
	 *
	 * @param  {JQuery} $panel 	Panel to initialize.
	 * @return {JQuery} 		Initialized panel.
	 */
	_initPanel(
		$panel : JQuery
	) {
		this.trigger( 'initPanel:before', [ $panel ] );

		//	Stop if already a panel
		if ( $panel.hasClass( 'mm-panel' ) )
		{
			return $panel;
		}

		//	Refactor panel classnames
		Mmenu.refactorClass( $panel, this.conf.classNames.panel 	, 'mm-panel' 			);
		Mmenu.refactorClass( $panel, this.conf.classNames.nopanel 	, 'mm-nopanel' 			);
		Mmenu.refactorClass( $panel, this.conf.classNames.inset 	, 'mm-listview_inset'	);

		$panel.filter( '.mm-listview_inset' )
			.addClass( 'mm-nopanel' );


		//	Stop if not supposed to be a panel
		if ( $panel.hasClass( 'mm-nopanel' ) )
		{
			return false;
		}


		//	Wrap UL/OL in DIV
		var vertical = ( $panel.hasClass( this.conf.classNames.vertical ) || !this.opts.slidingSubmenus );
		$panel.removeClass( this.conf.classNames.vertical );

		var id = $panel[ 0 ].id || Mmenu.getUniqueId();

		if ( $panel.is( 'ul, ol' ) )
		{
			$panel[ 0 ].removeAttribute( 'id' );

			$panel.wrap( '<div />' );
			$panel = $panel.parent();
		}

		$panel[ 0 ].id = id;
		$panel.addClass( 'mm-panel mm-hidden' );

		var $parent = $panel.parent( 'li' );

		if ( vertical )
		{
			$parent.addClass( 'mm-listitem_vertical' );
		}
		else
		{
			$panel.appendTo( this.node.$pnls );
		}

		//	Store parent/child relation
		if ( $parent.length )
		{
			($parent[ 0 ] as any).mmChild = $panel;
			($panel[ 0 ] as any).mmParent = $parent;
		}

		this.trigger( 'initPanel:after', [ $panel ] );

		return $panel;
	}


	/**
	 * Initialize a navbar.
	 *
	 * @param {JQuery} $panel Panel for the navbar.
	 */
	_initNavbar(
		$panel : JQuery
	) {
		this.trigger( 'initNavbar:before', [ $panel ] );

		if ( $panel.children( '.mm-navbar' ).length )
		{
			return;
		}

		var $parent : JQuery = ($panel[ 0 ] as any).mmParent,
			$navbar : JQuery = Mmenu.$( '<div class="mm-navbar" />' );

		var title = this._getPanelTitle( $panel, this.opts.navbar.title ),
			href  = '';

		if ( $parent && $parent.length )
		{
			if ( $parent.hasClass( 'mm-listitem_vertical' ) )
			{
				return;
			}

			//	Listview, the panel wrapping this panel
			if ( $parent.parent().hasClass( 'mm-listview' ) )
			{
				var $a = $parent
					.children( 'a, span' )
					.not( '.mm-btn_next' );
			}

			//	Non-listview, the first anchor in the parent panel that links to this panel
			else
			{
				var $a = $parent
					.closest( '.mm-panel' )
					.find( 'a[href="#' + $panel.attr( 'id' ) + '"]' );
			}

			$a = $a.first();
			$parent = $a.closest( '.mm-panel' );

			var id = $parent[ 0 ].id;
			title = this._getPanelTitle( $panel, Mmenu.$('<span>' + $a.text() + '</span>').text() );

			switch ( this.opts.navbar.titleLink )
			{
				case 'anchor':
					href = $a[ 0 ].getAttribute( 'href' );
					break;

				case 'parent':
					href = '#' + id;
					break;
			}

			$navbar.append( '<a class="mm-btn mm-btn_prev mm-navbar__btn" href="#' + id + '" />' );
		}
		else if ( !this.opts.navbar.title )
		{
			return;
		}

		if ( this.opts.navbar.add )
		{
			$panel.addClass( 'mm-panel_has-navbar' );
		}

		$navbar.append( '<a class="mm-navbar__title"' + ( href.length ? ' href="' + href + '"' : '' ) + '>' + title + '</a>' )
			.prependTo( $panel );

		this.trigger( 'initNavbar:after', [ $panel ] );
	}


	/**
	 * Initialize a listview.
	 *
	 * @param {JQuery} $panel Panel for the listview(s).
	 */
	_initListview(
		$panel : JQuery
	) {
		this.trigger( 'initListview:before', [ $panel ] );

		//	Refactor listviews classnames
		var $ul = Mmenu.childAddSelf( $panel, 'ul, ol' );

		Mmenu.refactorClass( $ul, this.conf.classNames.nolistview, 'mm-nolistview' );


		//	Refactor listitems classnames
		var $li = $ul
			.not( '.mm-nolistview' )
			.addClass( 'mm-listview' )
			.children()
			.addClass( 'mm-listitem' );

		Mmenu.refactorClass( $li, this.conf.classNames.selected , 'mm-listitem_selected' 	);
		Mmenu.refactorClass( $li, this.conf.classNames.divider 	, 'mm-listitem_divider'		);
		Mmenu.refactorClass( $li, this.conf.classNames.spacer 	, 'mm-listitem_spacer'		);

		$li.children( 'a, span' )
			.not( '.mm-btn' )
			.addClass( 'mm-listitem__text' );

		//	Add open link to parent listitem
		var $parent : JQuery = ($panel[ 0 ] as any).mmParent;
		if ( $parent && $parent.hasClass( 'mm-listitem' ) )
		{
			if ( !$parent.children( '.mm-btn' ).length )
			{
				var $a = $parent.children( 'a, span' ).first(),
					$b = Mmenu.$( '<a class="mm-btn mm-btn_next mm-listitem__btn" href="#' + $panel[ 0 ].id + '" />' );

				$b.insertAfter( $a );
				if ( $a.is( 'span' ) )
				{
					$b.addClass( 'mm-listitem__text' ).html( $a.html() );
					$a.remove();
				}
			}
		}

		this.trigger( 'initListview:after', [ $panel ] );
	}


	/**
	 * Find and open the correct panel after creating the menu.
	 */
	_initOpened()
	{
		this.trigger( 'initOpened:before' );

		//	Find the selected listitem
		var $selected = this.node.$pnls
			.find( '.mm-listitem_selected' )
			.removeClass( 'mm-listitem_selected' )
			.last()
			.addClass( 'mm-listitem_selected' );

		//	Find the current opened panel
		var $current = ( $selected.length ) 
			? $selected.closest( '.mm-panel' )
			: this.node.$pnls.children( '.mm-panel' ).first();

		//	Open the current opened panel
		this.openPanel( $current, false );

		this.trigger( 'initOpened:after' );
	}


	/**
	 * Initialize anchors in / for the menu.
	 */
	_initAnchors()
	{
		this.trigger( 'initAnchors:before' );


		Mmenu.$('body')
			.on( 'click.mm',
				'a[href]',
				( e ) => {
					var $t = Mmenu.$(e.currentTarget),
						_h = e.currentTarget.getAttribute( 'href' );

					var args : mmClickArguments = {
						inMenu 		: this.node.$menu.find( $t ).length ? true : false, 
						inListview 	: $t.is( '.mm-listitem > a' ),
						toExternal 	: $t.is( '[rel="external"]' ) || $t.is( '[target="_blank"]' )
					};

					var onClick = {
						close 			: null,
						setSelected 	: null,
						preventDefault	: _h.slice( 0, 1 ) == '#'
					};


					//	Find hooked behavior.
					for ( var c = 0; c < this.clck.length; c++ )
					{
						var click = this.clck[ c ].call( this, $t, args );
						if ( click )
						{
							if ( Mmenu.typeof( click ) == 'boolean' )
							{
								e.preventDefault();
								return;
							}
							if ( Mmenu.typeof( click ) == 'object' )
							{
								onClick = Mmenu.extend( click, onClick );
							}
						}
					}


					//	Default behavior for anchors in lists.
					if ( args.inMenu && args.inListview && !args.toExternal )
					{

						//	Set selected item, Default: true
						if ( Mmenu.valueOrFn( $t, this.opts.onClick.setSelected, onClick.setSelected ) )
						{
							this.setSelected( $t.parent() );
						}

						//	Prevent default / don't follow link. Default: false.
						if ( Mmenu.valueOrFn( $t, this.opts.onClick.preventDefault, onClick.preventDefault ) )
						{
							e.preventDefault();
						}

						//	Close menu. Default: false
						//		TODO: option + code should be in offcanvas add-on
						if ( Mmenu.valueOrFn( $t, this.opts.onClick.close, onClick.close ) )
						{
							if ( this.opts.offCanvas && Mmenu.typeof( this.close ) == 'function' )
							{
								this.close();
							}
						}
					}

				}
			);

		this.trigger( 'initAnchors:after' );
	}


	/**
	 * Get the translation for a text.
	 *
	 * @param  {string} text 	Text to translate.
	 * @return {string}			The translated text.
	 */
	i18n(
		text : string
	) {
		return Mmenu.i18n( text, this.conf.language );
	}


	/**
	 * get or set a translated / translatable text.
	 *
	 * @param  {string|object} 	[text] 		The translated text to add or get.
	 * @param  {string} 		[language] 	The language for the translated text.
	 * @return {string|object}				The translated text.
	 */
	static i18n : mmMethodI18n = (function() {

		var translations = {};

		return function( 
			text		?: string | object,
			language	?: string
		) {
			switch( Mmenu.typeof( text ) )
			{
				case 'object':
					if ( typeof language == 'string' )
					{
						if ( typeof translations[ language ] == 'undefined' )
						{
							translations[ language ] = {};
						}
						//jQuery.extend( translations[ language ], text );
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
	 * @param 	{JQuery} 			$panel 		Panel to search in.
	 * @param 	{string|Function} 	[dfault] 	Fallback/default title.
	 * @return	{string}						The title for the panel.
	 */
	_getPanelTitle( 
		$panel  : JQuery, 
		dfault ?: string | Function
	) {
		var title : string;

		//	Function
		if ( typeof this.opts.navbar.title == 'function' )
		{
			title = (this.opts.navbar.title as Function).call( $panel[ 0 ] );
		}

		//	Data attr
		if ( typeof title == 'undefined' )
		{
			title = $panel[ 0 ].getAttribute( 'mm-data-title' );
		}

		if ( typeof title == 'string' && title.length )
		{
			return title;
		}

		//	Fallback
		if ( typeof dfault == 'string' )
		{
			return this.i18n( dfault );
		}
		else if ( typeof dfault == 'function' )
		{
			return this.i18n( (dfault as Function).call( $panel[ 0 ] ) );
		}

		//	Default
		if ( typeof Mmenu.options.navbar.title == 'string' )
		{
			return this.i18n( Mmenu.options.navbar.title );
		}
		return this.i18n( 'Menu' );
	}


	/**
	 * Find the value from an option or function.
	 *
	 * @param 	{JQuery} 	$elem 		Scope for the function.
	 * @param 	{any} 		[option] 	Value or function.
	 * @param 	{any} 		[dfault] 	Default fallback value.
	 * @return	{any}					The given evaluation of the given option, or the default fallback value.
	 */
	static valueOrFn( 
		$elem	 : JQuery,
		option	?: any,
		dfault 	?: any
	) {
		if ( Mmenu.typeof( option ) == 'function' )
		{
			var value = option.call( $elem[ 0 ] );
			if ( Mmenu.typeof( value ) != 'undefined' )
			{
				return value;
			}
		}
		if ( ( Mmenu.typeof( option ) == 'function' || Mmenu.typeof( option ) == 'undefined' ) 
			&& Mmenu.typeof( dfault ) != 'undefined'
		) {
			return dfault;
		}
		return option;
	}


	/**
	 * Refactor a classname on multiple elements.
	 *
	 * @param {JQuery} $elements 	Elements to refactor.
	 * @param {string}	oldClass 	Classname to remove.
	 * @param {string}	newClass 	Classname to add.
	 */
	static refactorClass( 
		$elements 	: JQuery,
		oldClass	: string,
		newClass	: string
	) {
		return $elements.filter( '.' + oldClass ).removeClass( oldClass ).addClass( newClass );
	}


	/**
	 * Find and filter child nodes including the node itself.
	 *
	 * @param  {JQuery} $elements 	Elements to refactor.
	 * @param  {string}	selector 	Selector to filter the elements against.
	 * @return {JQuery}				The expanded and filtered set of nodes.
	 */
	static findAddSelf( 
		$element : JQuery,
		selector : string
	) {
		return $element.find( selector ).add( $element.filter( selector ) );
	}


	/**
	 * Find and filter direct child nodes including the node itself.
	 *
	 * @param  {JQuery} $elements 	Elements to refactor.
	 * @param  {string}	selector 	Selector to filter the elements against.
	 * @return {JQuery}				The expanded and filtered set of nodes.
	 */
	static childAddSelf( 
		$element : JQuery,
		selector : string
	) {
		return $element.children( selector ).add( $element.filter( selector ) );
	}


	/**
	 * Filter out non-listitem listitems.
	 *
	 * @param  {JQuery} $listitems 	Elements to filter.
	 * @return {JQuery}				The filtered set of listitems.
	 */
	static filterListItems(
		$listitems : JQuery
	) {
		return $listitems
			.not( '.mm-listitem_divider' )
			.not( '.mm-hidden' );
	}


	/**
	 * Find anchors in listitems.
	 *
	 * @param  {JQuery} $listitems 	Elements to filter.
	 * @return {JQuery}				The filtered set of listitems.
	 */
	static filterListItemAnchors(
		$listitems : JQuery
	) {
		return Mmenu.filterListItems( $listitems )
			.children( 'a' )
			.not( '.mm-btn_next' );
	}


	/**
	 * Set and invoke a (single) transition-end function with fallback.
	 *
	 * @param {JQuery} 		$element 	Scope for the function.
	 * @param {function}	func		Function to invoke.
	 * @param {number}		duration	The duration of the animation (for the fallback).
	 */
	static transitionend( 
		$element 	: JQuery, 
		func 		: Function,
		duration	: number
	) {
		var guid = Mmenu.getUniqueId();

		var _ended = false,
			_fn = function( e )
			{
				if ( Mmenu.typeof( e ) !== 'undefined' )
				{
					if ( e.target != $element[ 0 ] )
					{
						return;
					}
				}

				if ( !_ended )
				{
					$element.off( 	    'transitionend.' + guid );
					$element.off( 'webkitTransitionEnd.' + guid );
					func.call( $element[ 0 ] );
				}
				_ended = true;
			};

		$element.on( 	   'transitionend.' + guid, _fn );
		$element.on( 'webkitTransitionEnd.' + guid, _fn );
		setTimeout( _fn, duration * 1.1 );
	}


	/**
	 * Get an unique ID.
	 *
	 * @return {string} An unique ID.
	 */
	static getUniqueId : mmMethodUniqueid = (function() {
		var id = 0;

		//	Using a factory for the "id" local var.
		return function()
		{
			return 'mm-guid-' + id++;
		};
	})()


	/**
	 * Get the type of any given variable. Improvement of "typeof".
	 *
	 * @param 	{any}		variable	The variable.
	 * @return	{string}				The type of the variable.
	 */
	static typeof(
		variable : any
	) {
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
		if ( Mmenu.typeof( orignl ) != 'object' )
		{
			orignl = {};
		}
		if ( Mmenu.typeof( dfault ) != 'object' )
		{
			dfault = {};
		}
		for ( let k in dfault )
		{
			if ( !dfault.hasOwnProperty( k ) )
			{
				continue;
			}

			if ( Mmenu.typeof( orignl[ k ] ) == 'undefined' )
			{
				orignl[ k ] = dfault[ k ];
			}
			else if ( Mmenu.typeof( orignl[ k ] ) == 'object' )
			{
				Mmenu.extend( orignl[ k ], dfault[ k ] );
			}
		}
		return orignl;
	}
}




/**
 * jQuery plugin mmenu.
 */
Mmenu.$.fn[ 'mmenu' ] = function( opts, conf )
{
	var $result = Mmenu.$();
	this.each(
		( i, elem ) => {
			if ( (elem as any).mmenu )
			{
				return;
			}

			var $menu = Mmenu.$(elem),
				menu  = new Mmenu( $menu, opts, conf );

			//	Store the API
			menu.node.$menu.data( 'mmenu', menu.API );

			$result = $result.add( menu.node.$menu );
		}
	);

	return $result;
};

