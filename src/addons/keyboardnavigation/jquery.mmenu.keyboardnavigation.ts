Mmenu.addons.keyboardNavigation = function(
	this : Mmenu
) {
	//	Keyboard navigation on touchscreens opens the virtual keyboard :/
	if ( Mmenu.support.touch )
	{
		return;
	}


	var opts = this.opts.keyboardNavigation,
		conf = this.conf.keyboardNavigation;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' || typeof opts == 'string' )
	{
		opts = {
			enable: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		opts = {};
	}
	opts = this.opts.keyboardNavigation = jQuery.extend( true, {}, Mmenu.options.keyboardNavigation, opts );


	//	Enable keyboard navigation
	if ( opts.enable )
	{

		var $menuStart 	= jQuery('<button class="mm-tabstart" />'),
			$menuEnd   	= jQuery('<button class="mm-tabend" />'),
			$blckEnd 	= jQuery('<button class="mm-tabend" />');

		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				if ( opts.enhance )
				{
					this.node.$menu.addClass( 'mm-menu_keyboardfocus' );
				}

				this._initWindow_keyboardNavigation( opts.enhance );
			}
		);
		this.bind( 'initOpened:before',
			function(
				this : Mmenu
			) {
				this.node.$menu
					.prepend( $menuStart )
					.append( $menuEnd )
					.children( '.mm-navbars-top, .mm-navbars-bottom' )
					.children( '.mm-navbar' )
					.children( 'a.mm-title' )
					.attr( 'tabindex', -1 );
			}
		);
		this.bind( 'initBlocker:after',
			function(
				this : Mmenu
			) {
				Mmenu.node.$blck
					.append( $blckEnd )
					.children( 'a' )
					.addClass( 'mm-tabstart' );
			}
		);


		var focs = 'input, select, textarea, button, label, a[href]';
		function focus( 
			this 	: Mmenu,
			$panl	: JQuery
		) {
			$panl = $panl || this.node.$pnls.children( '.mm-panel_opened' );

			var $focs = jQuery(),
				$navb = this.node.$menu
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
				$focs = this.node.$menu.children( '.mm-tabstart' );
			}

			$focs.first().focus();
		}
		this.bind( 'open:finish'		, focus );
		this.bind( 'openPanel:finish'	, focus );


		//	Add screenreader / aria support
		this.bind( 'initOpened:after:sr-aria',
			function(
				this : Mmenu
			) {
				var $btns = this.node.$menu.add( Mmenu.node.$blck )
					.children( '.mm-tabstart, .mm-tabend' );

				Mmenu.sr_aria( $btns, 'hidden', true );
				Mmenu.sr_role( $btns, 'presentation' );
			}
		);
	}
};

//	Default options and configuration
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

	//	Re-enable tabbing in general
	jQuery(window)
		.off( 'keydown.mm-offCanvas' );

	//	Prevent tabbing outside an offcanvas menu
	jQuery(window)
		.off( 'focusin.mm-keyboardNavigation' )
		.on( 'focusin.mm-keyboardNavigation',
			( e ) => {
				if ( jQuery('html').hasClass( 'mm-wrapper_opened' ) )
				{
					var $t = jQuery(e.target);

					if ( $t.is( '.mm-tabend' ) )
					{
						var $target : any = jQuery();	//	Should be type JQuery, but Typescript does not understand

						//	Jump from menu to blocker
						if ( $t.parent().is( '.mm-menu' ) )
						{
							if ( Mmenu.node.$blck )
							{
								$target = Mmenu.node.$blck;
							}
						}
						if ( $t.parent().is( '.mm-wrapper__blocker' ) )
						{
							$target = jQuery('body')
								.find( '.mm-menu_offcanvas' )
								.filter( '.mm-menu_opened' );
						}
						if ( !$target.length )
						{
							$target = $t.parent();
						}

						$target.children( '.mm-tabstart' ).focus();
					}
				}
			}
		);

	//	Default keyboard navigation
	jQuery(window)
		.off( 'keydown.mm-keyboardNavigation' )
		.on( 'keydown.mm-keyboardNavigation',
			( e ) => {
				var $t = jQuery(e.target),
					$m = $t.closest( '.mm-menu' );

				if ( $m.length )
				{
					var api = $m.data( 'mmenu' );

					//	special case for input and textarea
					if ( $t.is( 'input, textarea' ) )
					{
					}
					else
					{
						switch( e.keyCode )
						{
							//	press enter to toggle and check
							case 13: 
								if ( $t.is( '.mm-toggle' ) || 
									 $t.is( '.mm-check' )
								) {
									$t.trigger( 'click.mm' );
								}
								break;

							//	prevent spacebar or arrows from scrolling the page
							case 32: 	//	space
							case 37: 	//	left
							case 38: 	//	top
							case 39: 	//	right
							case 40: 	//	bottom
								e.preventDefault();
								break;
						}
					}
				}
			}
		);

	//	Enhanced keyboard navigation
	if ( enhance )
	{
		jQuery(window)
			.off( 'keydown.mm-keyboardNavigation' )
			.on( 'keydown.mm-keyboardNavigation',
				( e ) => {
					var $t = jQuery(e.target),
						$m = $t.closest( '.mm-menu' );

					if ( $m.length )
					{
						var api = $m.data( 'mmenu' );

						//	special case for input and textarea
						if ( $t.is( 'input' ) )
						{
							switch( e.keyCode )
							{
								//	empty searchfield with esc
								case 27:
									$t.val( '' );
									break;
							}
						}
						else
						{
							switch( e.keyCode )
							{
								//	close submenu with backspace
								case 8: 
									var $p = $m.find( '.mm-panel_opened' ).data( 'mm-parent' );
									if ( $p && $p.length )
									{
										api.openPanel( $p.closest( '.mm-panel' ) );
									}
									break;

								//	close menu with esc
								case 27:
									if ( $m.hasClass( 'mm-menu_offcanvas' ) )
									{
										api.close();
									}
									break;
							}
						}
					}
				}
			);
	}
};

