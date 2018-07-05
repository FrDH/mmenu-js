/*	
 * jQuery mmenu Bootstrap 4 wrapper
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'bootstrap4';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		var that = this;


		//	Create the menu
		if ( this.$menu.hasClass( 'navbar-collapse' ) )
		{

			//	No need for cloning the menu...
			this.conf.clone = false;


			//	... We'll create a new menu
			var $nav = $('<nav />'),
				$pnl = $('<div />');

			$nav.append( $pnl );

			this.$menu
				.children()
				.each(
					function()
					{
						var $t = $(this);
						switch( true )
						{
							case $t.hasClass( 'navbar-nav' ):
								$pnl.append( cloneNav( $t ) );
								break;

							case $t.hasClass( 'dropdown-menu' ):
								$pnl.append( cloneDropdown( $t ) );
								break;

							case $t.hasClass( 'form-inline' ):
								that.conf.searchfield.form = {
									action	: $t.attr( 'action' ) 	|| null,
									method	: $t.attr( 'method' ) 	|| null
								};
								that.conf.searchfield.input = {
									name	: $t.find( 'input' ).attr( 'name' ) || null
								};
								that.conf.searchfield.clear 	= false;
								that.conf.searchfield.submit	= true;
								break;

							default:
								$pnl.append( $t.clone( true ) )
								break;
						}
					}
				);

			//	Set the menu
			this.bind( 'initMenu:before',
				function()
				{
					$nav.prependTo( 'body' );
					this.$menu = $nav;
				}
			);

			//	Hijack the toggler
			this.$menu
				.parent()
				.find( '.navbar-toggler' )
				.removeAttr( 'data-target' )
				.removeAttr( 'aria-controls' )
				.off( 'click' )
				.on( 'click',
					function( e )
					{
						e.preventDefault();
						e.stopImmediatePropagation();
						that[ that.vars.opened ? 'close' : 'open' ]();
					}
				);
		}
	};


	function cloneLink( $a )
	{
		var $i = $('<a />');
		var attr = ['href', 'title', 'target'];
		for ( var a= 0; a < attr.length; a++ )
		{
			if ( typeof $a.attr( attr[ a ] ) != 'undefined' )
			{
				$i.attr( attr[ a ], $a.attr( attr[ a ] ) );
			}
		}
		$i.html( $a.html() );
		$i.find( '.sr-only' ).remove();
		return $i;
	}
	function cloneDropdown( $d )
	{
		var $ul = $('<ul />');
		$d.find( '.dropdown-item, .dropdown-divider' )
			.each(function() {
				var $di = $(this),
					$li = $('<li />');

				if ( $di.hasClass( 'dropdown-divider' ) )
				{
					$li.addClass( 'Divider' );
				}
				else
				{
					$li.append( cloneLink( $di ) );
				}
				$ul.append( $li );
			}
		);
		return $ul;
	}
	function cloneNav( $n )
	{
		var $ul = $('<ul />');
		$n.find( '.nav-item' )
			.each(function() {
				var $ni = $(this),
					$li = $('<li />');

				if ( $ni.hasClass( 'active' ) )
				{
					$li.addClass( 'Selected' );
				}
				if ( !$ni.hasClass( 'nav-link' ) )
				{
					var $dd = $ni.children( '.dropdown-menu' );
					if ( $dd.length )
					{
						$li.append( cloneDropdown( $dd ) );
					}
					$ni = $ni.children( '.nav-link' );
				}
				$li.prepend( cloneLink( $ni ) );

				$ul.append( $li );
			}
		);
		return $ul;
	}

})( jQuery );