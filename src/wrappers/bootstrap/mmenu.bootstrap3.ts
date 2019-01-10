Mmenu.wrappers.bootstrap3 = function(
	this : Mmenu
) {

	//	Create the menu
	if ( this.node.menu.classList.contains( 'navbar-collapse' ) )
	{

		//	Set some config
		this.conf.classNames.selected = 'active';
		this.conf.classNames.divider  = 'divider';
		this.conf.clone = true;

		//	After initMenu, filter and refactor HTML for tabs, pills and navbars
		this.opts.hooks = this.opts.hooks || {};
		
		var _type = '',
			types = [ 'nav-tabs', 'nav-pills', 'navbar-nav' ];

		for ( var t = 0; t < types.length; t++ )
		{
			if ( this.node.menu.querySelector( '.' + types[ t ] ) )
			{
				_type = types[ t ];
				break;
			}
		}
		if ( _type.length )
		{
			this.opts.hooks[ 'initMenu:before' ] = () => {
				if ( _type == 'navbar-nav' )
				{
					Mmenu.$(this.node.menu).wrapInner( '<div />' );
				}
			};
			this.opts.hooks[ 'initMenu:after' ] = () => {
				init.menu.call( this );
				init.dropdown.call( this );
				init[ _type.split( 'nav-' ).join( '' ).split( '-nav' ).join( '' ) ].call( this );
			};
		}
	}

	var init = {
		menu: () => {
			Mmenu.$(this.node.menu)
				.find( '.nav' )
				.removeClass( 'nav' )
				.end()
				.find( '.sr-only' ).remove().end()
				.find( '.divider:empty' ).remove();

			var attrs = [ 'role', 'aria-haspopup', 'aria-expanded' ];
			for ( var a = 0; a < attrs.length; a++ )
			{
				Mmenu.$(this.node.menu).find( '[' + attrs[ a ] + ']' ).removeAttr( attrs[ a ] );
			}
		},
		dropdown: () => {
			var $dropdown = Mmenu.$(this.node.menu).find( '.dropdown' );

			$dropdown
				.removeClass( 'dropdown' );

			$dropdown
				.children( '.dropdown-toggle' )
				.find( '.caret' ).remove().end()
				.each(
					( i, elem ) => {
						Mmenu.$(elem).replaceWith( '<span>' + Mmenu.$(elem).html() + '</span>' );
					}
				);
			
			$dropdown
				.children( '.dropdown-menu' )
				.removeClass( 'dropdown-menu' );
		},
		tabs: () => {
			Mmenu.$(this.node.menu)
				.find( '.nav-tabs' )
				.removeClass( 'nav-tabs' );
		},
		pills: () => {
			Mmenu.$(this.node.menu)
				.find( '.nav-pills' )
				.removeClass( 'nav-pills' );
		},
		navbar: () => {

			Mmenu.$(this.node.menu)
				.removeClass( 'collapse navbar-collapse' )
				.find( '[class*="navbar-"]' )
				.removeClass( 'navbar-left navbar-right navbar-nav navbar-text navbar-btn' );

			var $form = Mmenu.$(this.node.menu).find( '.navbar-form' );
			this.conf.searchfield = {
				form 	: {
					action 	: $form[ 0 ].getAttribute( 'action' ),
					method 	: $form[ 0 ].getAttribute( 'method' )
				},
				input 	: {
					name 	: $form.find( 'input' )[ 0 ].getAttribute( 'name' )
				},
				submit 	: true,
				clear 	: false
			};
			$form.remove();

			(Mmenu.$(this.node.orig) || Mmenu.$(this.node.menu))
				.closest( '.navbar' )
				.find( '.navbar-header' )
				.find( '.navbar-toggle' )
				.off( 'click' )
				.on( 'click', ( e ) => {
					this.open();

					e.stopImmediatePropagation();
					e.preventDefault();
				});
		}
	};
};