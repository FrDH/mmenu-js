Mmenu.addons.screenReader = function( 
	this : Mmenu
) {
	var opts = this.opts.screenReader,
		conf = this.conf.screenReader;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		opts = {
			aria: opts,
			text: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	opts = this.opts.screenReader = jQuery.extend( true, {}, Mmenu.options.screenReader, opts );


	//	Add Aria-* attributes
	if ( opts.aria )
	{

		//	Add screenreader / aria hooks for add-ons
		//	In orde to keep this list short, only extend hooks that are actually used by other add-ons
		//	TODO: move to the specific add-on
		this.bind( 'initAddons:after',
			function(
				this : Mmenu
			) {
				this.bind( 'initMenu:after' 	, function( this : Mmenu ) { this.trigger( 'initMenu:after:sr-aria' 	, [].slice.call( arguments )	) });
				this.bind( 'initNavbar:after'	, function( this : Mmenu ) { this.trigger( 'initNavbar:after:sr-aria'	, [].slice.call( arguments )	) });
				this.bind( 'openPanel:start'	, function( this : Mmenu ) { this.trigger( 'openPanel:start:sr-aria'	, [].slice.call( arguments )	) });
				this.bind( 'close:start'		, function( this : Mmenu ) { this.trigger( 'close:start:sr-aria' 		, [].slice.call( arguments )	) });
				this.bind( 'close:finish'		, function( this : Mmenu ) { this.trigger( 'close:finish:sr-aria' 		, [].slice.call( arguments )	) });
				this.bind( 'open:start'			, function( this : Mmenu ) { this.trigger( 'open:start:sr-aria' 		, [].slice.call( arguments )	) });
				this.bind( 'initOpened:after'	, function( this : Mmenu ) { this.trigger( 'initOpened:after:sr-aria'	, [].slice.call( arguments )	) });
			}
		);


		//	Update aria-hidden for hidden / visible listitems
		this.bind( 'updateListview',
			function(
				this : Mmenu
			) {
				this.node.$pnls
					.find( '.mm-listitem' )
					.each(
						( i, elem ) => {
							var $li = jQuery(elem);
							Mmenu.sr_aria( $li, 'hidden', $li.is( '.mm-hidden' ) );
						}
					);
			}
		);


		//	Update aria-hidden for the panels when opening and closing a panel.
		this.bind( 'openPanel:start',
			function( 
				this 	: Mmenu,
				$panel 	: JQuery
			) {
				var $hidden = this.node.$menu
					.find( '.mm-panel' )
					.not( $panel )
					.not( $panel.parents( '.mm-panel' ) );

				var $shown = $panel.add(
					$panel
						.find( '.mm-listitem_vertical .mm-listitem_opened' )
						.children( '.mm-panel' )
				);

				Mmenu.sr_aria( $hidden, 'hidden', true );
				Mmenu.sr_aria( $shown, 'hidden', false );
			}
		);
		this.bind( 'closePanel',
			function( 
				this 	: Mmenu,
				$panel	: JQuery
			) {
				Mmenu.sr_aria( $panel, 'hidden', true );
			}
		);


		//	Add aria-haspopup and aria-owns to prev- and next buttons.
		this.bind( 'initPanels:after',
			function( 
				this 	: Mmenu,
				$panels : JQuery
			) {
				var $btns = $panels
					.find( '.mm-btn' )
					.each(
						function( i, elem )
						{
							let $btn = jQuery(elem);
							Mmenu.sr_aria( $btn, 'owns', $btn.attr( 'href' ).replace( '#', '' ) );
						}
					);

				Mmenu.sr_aria( $btns, 'haspopup', true );
			}
		);


		//	Add aria-hidden for navbars in panels.
		this.bind( 'initNavbar:after',
			function( 
				this 	: Mmenu,
				$panel	: JQuery
			) {
				var $navbar = $panel.children( '.mm-navbar' );
				Mmenu.sr_aria( $navbar, 'hidden', !$panel.hasClass( 'mm-panel_has-navbar' ) );
			}
		);


		//	Text
		if ( opts.text )
		{
			//	Add aria-hidden to titles in navbars
			if ( this.opts.navbar.titleLink == 'parent' )
			{
				this.bind( 'initNavbar:after',
					function(
						this 	: Mmenu, 
						$panel	: JQuery
					) {
						var $navbar = $panel.children( '.mm-navbar' ),
							hidden  = ( $navbar.children( '.mm-btn_prev' ).length ) ? true : false;

						Mmenu.sr_aria( $navbar.children( '.mm-title' ), 'hidden', hidden );
					}
				);
			}
		}
	}


	//	Add screenreader text
	if ( opts.text )
	{

		//	Add screenreader / text hooks for add-ons
		//	In orde to keep this list short, only extend hooks that are actually used by other add-ons
		//	TODO: move to specific add-on
		this.bind( 'initAddons:after',
			function(
				this : Mmenu
			) {
				this.bind( 'setPage:after' 		, function() { this.trigger( 'setPage:after:sr-text' 	, arguments[ 0 ]	) });
				this.bind( 'initBlocker:after'	, function() { this.trigger( 'initBlocker:after:sr-text' 					) });
			}
		);


		//	Add text to the prev-buttons.
		this.bind( 'initNavbar:after',
			function( 
				this 	: Mmenu,
				$panel	: JQuery
			) {
				var $navbar = $panel.children( '.mm-navbar' ),
					text = this.i18n( conf.text.closeSubmenu );

				$navbar.children( '.mm-btn_prev' ).html( Mmenu.sr_text( text ) );
			}
		);


		//	Add text to the next-buttons.
		this.bind( 'initListview:after',
			function( 
				this 	: Mmenu,
				$panel	: JQuery
			) {
				var $parent = $panel.data( 'mm-parent' );
				if ( $parent && $parent.length )
				{
					var $next = $parent.children( '.mm-btn_next' ),
						text = this.i18n( conf.text[ $next.parent().is( '.mm-listitem_vertical' ) ? 'toggleSubmenu' : 'openSubmenu' ] );

					$next.append( Mmenu.sr_text( text ) );
				}			
			}
		);
	}
};


//	Default options and configuration.
Mmenu.options.screenReader = {
	aria: true,
	text: true
};

Mmenu.configs.screenReader = {
	text: {
		closeMenu       : 'Close menu',
		closeSubmenu    : 'Close submenu',
		openSubmenu     : 'Open submenu',
		toggleSubmenu   : 'Toggle submenu'
	}
};


//	Methods
(function() {
	var attr = function( 
		$elem	: JQuery, 
		attr	: string, 
		value	: string | boolean
	) {
		$elem.prop( attr, value );
		if ( value )
		{
			$elem.attr( attr, value.toString() );
		}
		else
		{
			$elem.removeAttr( attr );
		}
	}

	/**
	 * Add aria (property and) attribute to a HTML element.
	 *
	 * @param {JQuery} 			$elem 	The node to add the attribute to.
	 * @param {string}			name	The (non-aria-prefixed) attribute name.
	 * @param {string|boolean}	value	The attribute value.
	 */
	Mmenu.sr_aria = function( 
		$elem	: JQuery, 
		name	: string, 
		value	: string | boolean
	) {
		attr( $elem, 'aria-' + name, value );
	};

	/**
	 * Add role attribute to a HTML element.
	 *
	 * @param {JQuery} 			$elem 	The node to add the attribute to.
	 * @param {string|boolean}	value	The attribute value.
	 */
	Mmenu.sr_role = function( 
		$elem	: JQuery, 
		value	: string | boolean
	) {
		attr( $elem, 'role', value );
	};

	/**
	 * Wrap a text in a screen-reader-only node.
	 *
	 * @param 	{string} text	The text to wrap.
	 * @return	{string}		The wrapped text.
	 */
	Mmenu.sr_text = function( 
		text : string
	) {
		return '<span class="mm-sronly">' + text + '</span>';
	};
})();
