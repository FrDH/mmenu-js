Mmenu.wrappers.bootstrap4 = function(
	this : Mmenu
) {

	//	Create the menu
	if ( this.node.$menu.hasClass( 'navbar-collapse' ) )
	{

		//	No need for cloning the menu...
		this.conf.clone = false;


		//	... We'll create a new menu
		var $nav = jQuery('<nav />'),
			$pnl = jQuery('<div />');

		$nav.append( $pnl );

		this.node.$menu
			.children()
			.each(
				( i, elem ) => {
					var $t = jQuery(elem);
					switch( true )
					{
						case $t.hasClass( 'navbar-nav' ):
							$pnl.append( cloneNav( $t ) );
							break;

						case $t.hasClass( 'dropdown-menu' ):
							$pnl.append( cloneDropdown( $t ) );
							break;

						case $t.hasClass( 'form-inline' ):
							this.conf.searchfield.form = {
								action	: $t.attr( 'action' ) 	|| null,
								method	: $t.attr( 'method' ) 	|| null
							};
							this.conf.searchfield.input = {
								name	: $t.find( 'input' ).attr( 'name' ) || null
							};
							this.conf.searchfield.clear 	= false;
							this.conf.searchfield.submit	= true;
							break;

						default:
							$pnl.append( $t.clone( true ) );
							break;
					}
				}
			);

		//	Set the menu
		this.bind( 'initMenu:before',
			function(
				this : Mmenu
			) {
				$nav.prependTo( 'body' );
				this.node.$menu = $nav;
			}
		);

		//	Hijack the toggler
		this.node.$menu
			.parent()
			.find( '.navbar-toggler' )
			.removeAttr( 'data-target' )
			.removeAttr( 'aria-controls' )
			.off( 'click' )
			.on( 'click',
				( e ) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					this[ this.vars.opened ? 'close' : 'open' ]();
				}
			);
	}



	function cloneLink( 
		$a : JQuery
	) {
		var $i = jQuery('<a />');
		var attr = ['href', 'title', 'target'];
		for ( var a = 0; a < attr.length; a++ )
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
	function cloneDropdown( 
		$d : JQuery
	) {
		var $ul = jQuery('<ul />');
		$d.children()
			.each(function() {
				var $di = jQuery(this),
					$li = jQuery('<li />');

				if ( $di.hasClass( 'dropdown-divider' ) )
				{
					$li.addClass( 'Divider' );
				}
				else if ( $di.hasClass( 'dropdown-item' ) )
				{
					$li.append( cloneLink( $di ) );
				}
				$ul.append( $li );
			}
		);
		return $ul;
	}
	function cloneNav( 
		$n : JQuery
	) {
		var $ul = jQuery('<ul />');
		$n.find( '.nav-item' )
			.each(function() {
				var $ni = jQuery(this),
					$li = jQuery('<li />');

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
};