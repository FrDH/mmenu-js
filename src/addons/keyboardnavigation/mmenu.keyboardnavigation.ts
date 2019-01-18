Mmenu.addons.keyboardNavigation = function(
	this : Mmenu
) {
	//	Keyboard navigation on touchscreens opens the virtual keyboard :/
	//	Lets prevent that.
	if ( Mmenu.support.touch )
	{
		return;
	}


	var opts = this.opts.keyboardNavigation;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' || typeof opts == 'string' )
	{
		(opts as mmLooseObject) = {
			enable: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	this.opts.keyboardNavigation = Mmenu.extend( opts, Mmenu.options.keyboardNavigation );


	//	Enable keyboard navigation
	if ( opts.enable )
	{

		let menuStart 	= Mmenu.DOM.create( 'button.mm-tabstart' ),
			menuEnd   	= Mmenu.DOM.create( 'button.mm-tabend' ),
			blockerEnd 	= Mmenu.DOM.create( 'button.mm-tabend' );

		this.bind( 'initMenu:after', () => {
			if ( opts.enhance )
			{
				this.node.menu.classList.add( 'mm-menu_keyboardfocus' );
			}

			this._initWindow_keyboardNavigation( opts.enhance );
		});
		this.bind( 'initOpened:before', () => {
			this.node.menu.prepend( menuStart );
			this.node.menu.append( menuEnd );
			Mmenu.DOM.children( this.node.menu, '.mm-navbars-top, .mm-navbars-bottom' )
				.forEach(( navbars ) => {
					navbars.querySelectorAll( 'a.mm-navbar__title' )
						.forEach(( title ) => {
							title.setAttribute( 'tabindex', '-1' );
						});
				});
		});
		this.bind( 'initBlocker:after', () => {
			Mmenu.node.blck.append( blockerEnd );
			Mmenu.DOM.children( Mmenu.node.blck, 'a' )[ 0 ]
				.classList.add( 'mm-tabstart' );
		});


		var focs = 'input, select, textarea, button, label, a[href]';
		function focus( 
			this 	 : Mmenu,
			panel	?: HTMLElement
		) {
			panel = panel || Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];

			var $focs = Mmenu.$(),
				$navb = Mmenu.$(this.node.menu)
					.children( '.mm-navbars_top, .mm-navbars_bottom'  )
					.children( '.mm-navbar' );

			//	already focus in navbar
			if ( $navb.find( focs ).filter( ':focus' ).length )
			{
				return;
			}

			if ( opts.enable == 'default' )
			{
				//	first anchor in listview
				$focs = Mmenu.$(panel).children( '.mm-listview' ).find( 'a[href]' ).not( '.mm-hidden' );

				//	first element in panel
				if ( !$focs.length )
				{
					$focs = Mmenu.$(panel)
						.find( focs )
						.not( '.mm-hidden' );
				}

				//	first element in navbar
				if ( !$focs.length )
				{
					$focs = $navb
						.find( focs )
						.not( '.mm-hidden' );
				}
			}

			//	default
			if ( !$focs.length )
			{
				$focs = Mmenu.$(this.node.menu).children( '.mm-tabstart' );
			}

			$focs.first().focus();
		}
		this.bind( 'open:finish'		, focus );
		this.bind( 'openPanel:finish'	, focus );


		//	Add screenreader / aria support
		this.bind( 'initOpened:after:sr-aria', () => {
			var $btns = Mmenu.$(this.node.menu).add( Mmenu.node.blck )
				.children( '.mm-tabstart, .mm-tabend' );

			$btns.each(( b, btn ) => {
				Mmenu.sr_aria( btn, 'hidden', true );
				Mmenu.sr_role( btn, 'presentation' );
			});
		});
	}
};

//	Default options and configuration.
Mmenu.options.keyboardNavigation = {
	enable 	: false,
	enhance	: false
};


/**
 * Initialize the window.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
Mmenu.prototype._initWindow_keyboardNavigation = function( 
	this	: Mmenu,
	enhance	: boolean
) {

	Mmenu.$(window)

		//	Re-enable tabbing in general
		//	TODO: dit wordt lastig omdat removeEventListner de functie als argument nodig heeft
		.off( 'keydown.mm-offCanvas' )

		//	Prevent tabbing outside an offcanvas menu
		.off( 'focusin.mm-keyboardNavigation' )
		.on( 'focusin.mm-keyboardNavigation', ( evnt ) => {
			if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
			{
				let target = (evnt.target as any); // Typecast to any because somehow, TypeScript thinks event.target is the window.

				if ( target.matches( '.mm-tabend' ) )
				{
					let next;

					//	Jump from menu to blocker
					if ( target.parentElement.matches( '.mm-menu' ) )
					{
						if ( Mmenu.node.blck )
						{
							next = Mmenu.node.blck;
						}
					}
					if ( target.parentElement.matches( '.mm-wrapper__blocker' ) )
					{
						next = Mmenu.DOM.find( document.body, '.mm-menu_offcanvas.mm-menu_opened' )[ 0 ];
					}
					if ( !next )
					{
						next = target.parentElement;
					}

					Mmenu.DOM.children( next, '.mm-tabstart' )[ 0 ].focus();
				}
			}
		})

		//	Default keyboard navigation
		.off( 'keydown.mm-keyboardNavigation' )
		.on( 'keydown.mm-keyboardNavigation', ( evnt ) => {
			var target 	= (evnt.target as any);
			var menu	= target.closest( '.mm-menu' );

			if ( menu )
			{
				var api : mmApi = (menu as any).mmenu;

				//	special case for input and textarea
				if ( target.matches( 'input, textarea' ) )
				{
				}
				else
				{
					switch( evnt.keyCode )
					{
						//	press enter to toggle and check
						case 13: 
							if ( target.matches( '.mm-toggle' ) || 
								 target.matches( '.mm-check' )
							) {
								Mmenu.$(target).trigger( 'click.mm' );
							}
							break;

						//	prevent spacebar or arrows from scrolling the page
						case 32: 	//	space
						case 37: 	//	left
						case 38: 	//	top
						case 39: 	//	right
						case 40: 	//	bottom
							evnt.preventDefault();
							break;
					}
				}
			}
		});

	if ( enhance )
	{
		Mmenu.$(window)

			//	Enhanced keyboard navigation
			.off( 'keydown.mm-keyboardNavigation' )
			.on( 'keydown.mm-keyboardNavigation', ( evnt ) => {
				var target 	= (evnt.target as any), // Typecast to any because somehow, TypeScript thinks event.target is the window.
					menu 	= target.closest( '.mm-menu' );

				if ( menu )
				{
					var api : mmApi = (menu as any).mmenu;

					//	special case for input and textarea
					if ( target.matches( 'input' ) )
					{
						switch( evnt.keyCode )
						{
							//	empty searchfield with esc
							case 27:
								target.value = '';
								break;
						}
					}
					else
					{
						switch( evnt.keyCode )
						{
							//	close submenu with backspace
							case 8: 
								var parent : HTMLElement = (menu.querySelector( '.mm-panel_opened' ) as any).mmParent;
								if ( parent )
								{
									api.openPanel( parent.closest( '.mm-panel' ) );
								}
								break;

							//	close menu with esc
							case 27:
								if ( menu.matches( '.mm-menu_offcanvas' ) )
								{
									api.close();
								}
								break;
						}
					}
				}
			});
	}
};

