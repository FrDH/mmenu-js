Mmenu.addons.iconbar = function(
	this : Mmenu
) {

	var opts = this.opts.iconbar;


	//	Extend shorthand options
	if ( opts instanceof Array )
	{
		(opts as mmLooseObject) = {
			add: true,
			top: opts
		};
	}
	//	/Extend shorthand options


	if ( !opts.add )
	{
		return;
	}


	var $iconbar : JQuery = null;

	//	Fill with content
	jQuery.each(
		[ 'top', 'bottom' ],
		function( n, poss )
		{

			var ctnt = opts[ poss ];

			//	Extend shorthand options
			if ( !( ctnt instanceof Array ) )
			{
				ctnt = [ ctnt ];
			}

			//	Create node
			var $ibar = jQuery( '<div class="mm-iconbar__' + poss + '" />' );


			//	Add content
			for ( var c = 0, l = ctnt.length; c < l; c++ )
			{
				$ibar.append( ctnt[ c ] );
			}

			if ( $ibar.children().length )
			{
				if ( !$iconbar )
				{
					$iconbar = jQuery('<div class="mm-iconbar" />');
				}
				$iconbar.append( $ibar );
			}
		}
	);


	//	Add to menu
	if ( $iconbar )
	{
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$menu
					.addClass( 'mm-menu_iconbar' )
					.prepend( $iconbar );
			}
		);

		//	Tabs
		if ( opts.type == 'tabs' )
		{

			$iconbar.addClass( 'mm-iconbar_tabs' );

			$iconbar.on( 'click.mm-iconbar',
				'a',
				( e ) => {
					var $tab = jQuery(e.currentTarget);
					if ( $tab.hasClass( 'mm-iconbar__tab_selected' ) )
					{
						e.stopImmediatePropagation();
						return;
					}

					try
					{
						var $target = jQuery( $tab.attr( 'href' ) );
						if ( $target.hasClass( 'mm-panel' ) )
						{
							e.preventDefault();
							e.stopImmediatePropagation();

							this.openPanel( $target, false );
						}
					}
					catch( err ) {}
				}
			);

			function selectTab( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				var $tabs = $iconbar.find( 'a' );
				$tabs.removeClass( 'mm-iconbar__tab_selected' );

				var $tab = $tabs.filter( '[href="#' + $panel.attr( 'id' ) + '"]' );
				if ( $tab.length )
				{
					$tab.addClass( 'mm-iconbar__tab_selected' );
				}
				else
				{
					var $parent = $panel.data( 'mm-parent' );
					if ( $parent && $parent.length )
					{
						selectTab.call( this, $parent.closest( '.mm-panel' ) );
					}
				}
			}
			this.bind( 'openPanel:start', selectTab );
		}
	}
};


//	Default options and configuration.
Mmenu.options.iconbar = {
	add 	: false,
	top 	: [],
	bottom 	: [],
	type	: 'default'
};
