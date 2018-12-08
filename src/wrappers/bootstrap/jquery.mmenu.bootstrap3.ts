Mmenu.wrappers.bootstrap3 = function(
	this : Mmenu
) {

	//	Create the menu
	if ( this.node.$menu.hasClass( 'navbar-collapse' ) )
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
			if ( this.node.$menu.find( '.' + types[ t ] ).length )
			{
				_type = types[ t ];
				break;
			}
		}
		if ( _type.length )
		{
			this.opts.hooks[ 'initMenu:before' ] = function(
				this : Mmenu
			) {
				if ( _type == 'navbar-nav' )
				{
					this.node.$menu.wrapInner( '<div />' );
				}
			};
			this.opts.hooks[ 'initMenu:after' ] = function(
				this : Mmenu
			) {
				init.menu.call( this );
				init.dropdown.call( this );
				init[ _type.split( 'nav-' ).join( '' ).split( '-nav' ).join( '' ) ].call( this );
			};
		}
	}

	var init = {
		menu: function(
			this : Mmenu
		) {
			this.node.$menu
				.find( '.nav' )
				.removeClass( 'nav' )
				.end()
				.find( '.sr-only' ).remove().end()
				.find( '.divider:empty' ).remove();

			var attrs = [ 'role', 'aria-haspopup', 'aria-expanded' ];
			for ( var a = 0; a < attrs.length; a++ )
			{
				this.node.$menu.find( '[' + attrs[ a ] + ']' ).removeAttr( attrs[ a ] );
			}
		},
		dropdown: function(
			this : Mmenu
		) {
			var $dropdown = this.node.$menu.find( '.dropdown' );

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
		tabs: function(
			this : Mmenu
		) {
			this.node.$menu
				.find( '.nav-tabs' )
				.removeClass( 'nav-tabs' );
		},
		pills: function(
			this : Mmenu
		) {
			this.node.$menu
				.find( '.nav-pills' )
				.removeClass( 'nav-pills' );
		},
		navbar: function(
			this : Mmenu
		) {

			this.node.$menu
				.removeClass( 'collapse navbar-collapse' )
				.find( '[class*="navbar-"]' )
				.removeClass( 'navbar-left navbar-right navbar-nav navbar-text navbar-btn' );

			var $form = this.node.$menu.find( '.navbar-form' );
			this.conf.searchform = {
				form 	: {
					action 	: $form[ 0 ].getAttribute( 'action' ),
					method 	: $form[ 0 ].getAttribute( 'method' )
				},
				input 	: {
					name 	: $form.find( 'input' )[ 0 ].getAttribute( 'name' )
				},
				submit 	: true
			};
			$form.remove();

			(this.node.$orig || this.node.$menu)
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