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

		var $menuStart 	= Mmenu.$('<button class="mm-tabstart" />'),
			$menuEnd   	= Mmenu.$('<button class="mm-tabend" />'),
			$blckEnd 	= Mmenu.$('<button class="mm-tabend" />');

		this.bind( 'initMenu:after', () => {
			if ( opts.enhance )
			{
				this.node.menu.classList.add( 'mm-menu_keyboardfocus' );
			}

			this._initWindow_keyboardNavigation( opts.enhance );
		});
		this.bind( 'initOpened:before', () => {
			Mmenu.$(this.node.menu)
				.prepend( $menuStart )
				.append( $menuEnd )
				.children( '.mm-navbars-top, .mm-navbars-bottom' )
				.children( '.mm-navbar' )
				.children( 'a.mm-title' )
				.attr( 'tabindex', -1 );
		});
		this.bind( 'initBlocker:after', () => {
			Mmenu.node.$blck
				.append( $blckEnd )
				.children( 'a' )
				.addClass( 'mm-tabstart' );
		});


		var focs = 'input, select, textarea, button, label, a[href]';
		function focus( 
			this 	 : Mmenu,
			$panl	?: JQuery
		) {
			$panl = $panl || this.node.$pnls.children( '.mm-panel_opened' );

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
				$focs = $panl.children( '.mm-listview' ).find( 'a[href]' ).not( '.mm-hidden' );

				//	first element in panel
				if ( !$focs.length )
				{
					$focs = $panl.find( focs ).not( '.mm-hidden' );
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
			var $btns = Mmenu.$(this.node.menu).add( Mmenu.node.$blck )
				.children( '.mm-tabstart, .mm-tabend' );

			Mmenu.sr_aria( $btns, 'hidden', true );
			Mmenu.sr_role( $btns, 'presentation' );
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
		.off( 'keydown.mm-offCanvas' )

		//	Prevent tabbing outside an offcanvas menu
		.off( 'focusin.mm-keyboardNavigation' )
		.on( 'focusin.mm-keyboardNavigation', ( evnt ) => {
			if ( Mmenu.$('html').hasClass( 'mm-wrapper_opened' ) )
			{
				var $target = Mmenu.$(evnt.target);

				if ( $target.is( '.mm-tabend' ) )
				{
					var $next = Mmenu.$();

					//	Jump from menu to blocker
					if ( $target.parent().is( '.mm-menu' ) )
					{
						if ( Mmenu.node.$blck )
						{
							$next = Mmenu.node.$blck;
						}
					}
					if ( $target.parent().is( '.mm-wrapper__blocker' ) )
					{
						$next = Mmenu.$('body')
							.find( '.mm-menu_offcanvas' )
							.filter( '.mm-menu_opened' );
					}
					if ( !$next.length )
					{
						($next as any) = $target.parent();	//	Without the any type, Typescript complains about $target being the window.
					}

					$next.children( '.mm-tabstart' ).focus();
				}
			}
		})

		//	Default keyboard navigation
		.off( 'keydown.mm-keyboardNavigation' )
		.on( 'keydown.mm-keyboardNavigation', ( evnt ) => {
			var $target = Mmenu.$(evnt.target),
				$menu 	= $target.closest( '.mm-menu' );

			if ( $menu.length )
			{
				var api : mmApi = ($menu[ 0 ] as any).mmenu;

				//	special case for input and textarea
				if ( $target.is( 'input, textarea' ) )
				{
				}
				else
				{
					switch( evnt.keyCode )
					{
						//	press enter to toggle and check
						case 13: 
							if ( $target.is( '.mm-toggle' ) || 
								 $target.is( '.mm-check' )
							) {
								$target.trigger( 'click.mm' );
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
				var $target = Mmenu.$(evnt.target),
					$menu 	= $target.closest( '.mm-menu' );

				if ( $menu.length )
				{
					var api : mmApi = ($menu[ 0 ] as any).mmenu;

					//	special case for input and textarea
					if ( $target.is( 'input' ) )
					{
						switch( evnt.keyCode )
						{
							//	empty searchfield with esc
							case 27:
								$target.val( '' );
								break;
						}
					}
					else
					{
						switch( evnt.keyCode )
						{
							//	close submenu with backspace
							case 8: 
								var $parent : JQuery = ($menu.find( '.mm-panel_opened' )[ 0 ] as any).mmParent;
								if ( $parent && $parent.length )
								{
									api.openPanel( $parent.closest( '.mm-panel' ) );
								}
								break;

							//	close menu with esc
							case 27:
								if ( $menu.hasClass( 'mm-menu_offcanvas' ) )
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

