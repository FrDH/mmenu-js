Mmenu.addons.iconPanels = function(
	this : Mmenu
) {
	var opts : mmOptionsIconpanels = this.opts.iconPanels;

	var keepFirst = false;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add : opts
		};
	}
	if ( typeof opts == 'number' ||
		 typeof opts == 'string'
	) {
		(opts as mmLooseObject) = {
			add 	: true,
			visible : opts
		};
	}

	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}

	if ( opts.visible == 'first' )
	{
		keepFirst = true;
		opts.visible = 1;
	}

	opts = this.opts.iconPanels = jQuery.extend( true, {}, Mmenu.options.iconPanels, opts );

	opts.visible = Math.min( 3, Math.max( 1, (opts.visible as number) ) );
	opts.visible++;


	//	Add the iconpanels
	if ( opts.add )
	{
		this.bind( 'initMenu:after',
			function()
			{
				var cls = [ 'mm-menu_iconpanel' ];

				if ( opts.hideNavbar )
				{
					cls.push( 'mm-menu_hidenavbar' );
				}
				if ( opts.hideDivider )
				{
					cls.push( 'mm-menu_hidedivider' );
				}

				this.$menu.addClass( cls.join( ' ' ) );
			}
		);

		var cls = '';
		if ( !keepFirst )
		{
			for ( var i = 0; i <= opts.visible; i++ )
			{
				cls += ' mm-panel_iconpanel-' + i;
			}
			if ( cls.length )
			{
				cls = cls.slice( 1 );
			}
		}
		function setPanels(
			this	: Mmenu,
			$panel	: JQuery
		) {
			if ( $panel.parent( '.mm-listitem_vertical' ).length )
			{
				return;
			}

			var $panels : JQuery = this.node.$pnls.children( '.mm-panel' );

			if ( keepFirst )
			{
				$panels
					.removeClass( 'mm-panel_iconpanel-first' )
					.first()
					.addClass( 'mm-panel_iconpanel-first' );
			}
			else
			{
				$panels
					.removeClass( cls )
					.filter( '.mm-panel_opened-parent' )
					.add( $panel )
					.removeClass( 'mm-hidden' )
					.not(
						function()
						{
							return jQuery(this).parent( '.mm-listitem_vertical' ).length ? true : false
						}
					)
					.slice( -opts.visible )
					.each(
						( i, elem ) => {
							jQuery(elem).addClass( 'mm-panel_iconpanel-' + i );
						}
					);
			}
		};

		this.bind( 'openPanel:start', setPanels );
		this.bind( 'initPanels:after',
			function( 
				this 	: Mmenu,
				$panels	: JQuery
			) {
				setPanels.call( this, this.node.$pnls.children( '.mm-panel_opened' ) );
			}
		);

		this.bind( 'initListview:after',
			function( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				if ( opts.blockPanel &&
					!$panel.parent( '.mm-listitem_vertical' ).length &&
					!$panel.children( '.mm-panel__blocker' ).length
				) {
					$panel.prepend( '<a href="#' + $panel.closest( '.mm-panel' ).attr( 'id' ) + '" class="mm-panel__blocker" />' );
				}	
			}
		);
	}
};


//	Default options and configuration.
(Mmenu.options.iconPanels as mmOptionsIconpanels) = {
	add 		: false,
	blockPanel	: true,
	hideDivider	: false,
	hideNavbar	: true,
	visible		: 3
};
