Mmenu.addons.setSelected = function(
	this : Mmenu
) {
	var opts = this.opts.setSelected,
		conf = this.conf.setSelected;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		opts = {
			hover	: opts,
			parent	: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		opts = {};
	}
	opts = this.opts.setSelected = jQuery.extend( true, {}, Mmenu.options.setSelected, opts );


	//	Find current by URL
	if ( opts.current == 'detect' )
	{
		function findCurrent( 
			this : Mmenu,
			url  : string
		) {
			url = url.split( "?" )[ 0 ].split( "#" )[ 0 ];

			var $a = this.node.$menu.find( 'a[href="'+ url +'"], a[href="'+ url +'/"]' );
			if ( $a.length )
			{
				this.setSelected( $a.parent() );
			}
			else
			{
				var arr = url.split( '/' ).slice( 0, -1 );
				if ( arr.length )
				{
					findCurrent.call( this, arr.join( '/' ) );
				}
			}
		};
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				findCurrent.call( this, window.location.href );
			}
		);

	}

	//	Remove current selected item
	else if ( !opts.current )
	{
		this.bind( 'initListview:after',
			function( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				$panel
					.find( '.mm-listview' )
					.children( '.mm-listitem_selected' )
					.removeClass( 'mm-listitem_selected' );
			}
		);
	}


	//	Add :hover effect on items
	if ( opts.hover )
	{
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$menu.addClass( 'mm-menu_selected-hover' );
			}
		);
	}


	//	Set parent item selected for submenus
	if ( opts.parent )
	{
		this.bind( 'openPanel:finish',
			function( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				//	Remove all
				this.node.$pnls
					.find( '.mm-listitem_selected-parent' )
					.removeClass( 'mm-listitem_selected-parent' );

				//	Move up the DOM tree
				var $parent = $panel.data( 'mm-parent' );
				while ( $parent )
				{
					$parent
						.not( '.mm-listitem_vertical' )
						.addClass( 'mm-listitem_selected-parent' );
				
					$parent = $parent		
						.closest( '.mm-panel' )
						.data( 'mm-parent' );
				}
			}
		);

		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$menu.addClass( 'mm-menu_selected-parent' );
			}
		);
	}
};


//	Default options
Mmenu.options.setSelected = {
	current : true,
	hover	: false,
	parent	: false
};
