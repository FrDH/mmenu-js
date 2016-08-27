/*	
 * Bootstrap wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default Bootstrap tabs, pills and navbar support.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_WRAPPR_ = 'bootstrap';


	//	Set some config
	$[ _PLUGIN_ ].configuration.classNames.selected = 'active';
	$[ _PLUGIN_ ].configuration.classNames.divider  = 'divider';


	//	Store original initMenu
	var orgInitMenu = $[ _PLUGIN_ ].defaults.initMenu || function() {};


	//	On initMenu, filter and refactor HTML for tabs, pills and navbars
	$[ _PLUGIN_ ].defaults.initMenu = function( $menu )
	{
		orgInitMenu.call( this, $menu );

		var _c = $[ _PLUGIN_ ]._c;

		var _type = false,
			types = [ 'nav-tabs', 'nav-pills', 'navbar-nav' ];

		for ( var t = 0; t < types.length; t++ )
		{
			if ( $menu.children( '.' + types[ t ] ).length )
			{
				_type = types[ t ];
				break;
			}
		}

		if ( _type )
		{
			init.menu.call( this );
			init.dropdown.call( this );
			init[ _type.split( 'nav-' ).join( '' ).split( '-nav' ).join( '' ) ].call( this );
		}
	};



	var init = {
		menu: function()
		{
			this.$menu
				.children()
				.removeClass( 'nav' )
				.find( '.sr-only' ).remove().end()
				.find( '.divider:empty' ).remove();

			var attrs = [ 'role', 'aria-haspopup', 'aria-expanded' ];
			for ( var a = 0; a < attrs.length; a++ )
			{
				this.$menu.find( '[' + attrs[ a ] + ']' ).removeAttr( attrs[ a ] );
			}
		},
		dropdown: function()
		{
			var $dropdown = this.$menu.find( '.dropdown' );

			$dropdown
				.removeClass( 'dropdown' );

			$dropdown
				.children( '.dropdown-toggle' )
				.find( '.caret' ).remove().end()
				.each(
					function()
					{
						$(this).replaceWith( '<span>' + $(this).html() + '</span>' );
					}
				);
			
			$dropdown
				.children( '.dropdown-menu' )
				.removeClass( 'dropdown-menu' );
		},
		tabs: function()
		{
			this.$menu
				.children()
				.removeClass( 'nav-tabs' );
		},
		pills: function()
		{
			this.$menu
				.children()
				.removeClass( 'nav-pills' );
		},
		navbar: function()
		{
			this.$menu
				.removeClass( 'collapse navbar-collapse' )
				.wrapInner( '<div />' )
				.children()
				.addClass( 'mm-' + _WRAPPR_ + '-navbar' )
				.children()
				.removeClass( 'navbar-left navbar-right navbar-nav navbar-text navbar-btn' );

			var that = this;

			this.$orig
				.closest( '.navbar' )
				.find( '.navbar-header' )
				.find( '.navbar-toggle' )
				.off( 'click' )
				.on( 'click.mm-' + _WRAPPR_ + '-navbar', function( e ) {
					that.open();

					e.stopImmediatePropagation();
					e.preventDefault();
				});
		}
	};
	

})( jQuery );