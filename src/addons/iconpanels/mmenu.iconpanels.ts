Mmenu.addons.iconPanels = function(
	this : Mmenu
) {
	var opts = this.opts.iconPanels;

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
	//	/Extend shorthand options


	//opts = this.opts.iconPanels = jQuery.extend( true, {}, Mmenu.options.iconPanels, opts );
	this.opts.iconPanels = Mmenu.extend( opts, Mmenu.options.iconPanels );


	opts.visible = Math.min( 3, Math.max( 1, (opts.visible as number) ) );
	opts.visible++;


	//	Add the iconpanels
	if ( opts.add )
	{
		this.bind( 'initMenu:after', () => {
			var cls = [ 'mm-menu_iconpanel' ];

			if ( opts.hideNavbar )
			{
				cls.push( 'mm-menu_hidenavbar' );
			}
			if ( opts.hideDivider )
			{
				cls.push( 'mm-menu_hidedivider' );
			}

			this.node.menu.classList.add( ...cls );
		});

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
			panel	: HTMLElement
		) {
			if ( panel.parentElement.matches( '.mm-listitem_vertical' ) )
			{
				return;
			}

			var $panels : JQuery = Mmenu.$(this.node.pnls).children( '.mm-panel' );
			var panels = Mmenu.DOM.children( this.node.pnls, '.mm-panels' );

			if ( keepFirst )
			{
				panels.forEach(( panel, p ) => {
					panel.classList[ p == 0 ? 'add' : 'remove' ]( 'mm-panel_iconpanel-first' );
				});
			}
			else
			{
				var opened : HTMLElement[] = [];
				panels.forEach(( panel, p ) => {
					panel.classList.remove( cls );

					if ( panel.matches( '.mm-panel_opened-parent' ) &&
						!panel.parentElement.matches( '.mm-listitem_vertical' )
					) {
						opened.push( panel );
					}
				});
				opened.push( panel );
				opened.forEach(( panel ) => {
					panel.classList.remove( 'mm-hidden' );
				});
				opened = opened.slice( -opts.visible );
				opened.forEach(( panel, p ) => {
					panel.classList.add( 'mm-panel_iconpanel-' + p );
				});
			}
		};

		this.bind( 'openPanel:start', setPanels );
		this.bind( 'initPanels:after', () => {
			setPanels.call( this, Mmenu.DOM.child( this.node.pnls, '.mm-panel_opened' ) );
		});

		this.bind( 'initListview:after', (
			panel : HTMLElement
		) => {
			if ( opts.blockPanel &&
				!panel.parentElement.matches( '.mm-listitem_vertical' ) &&
				!Mmenu.DOM.child( panel, '.mm-panel__blocker' )
			) {
				var anchor = document.createElement( 'a' );
				anchor.classList.add( 'mm-panel__blocker' );
				anchor.setAttribute( 'href', panel.closest( '.mm-panel' ).id );
				panel.prepend( anchor );
			}	
		});
	}
};


//	Default options and configuration.
Mmenu.options.iconPanels = {
	add 		: false,
	blockPanel	: true,
	hideDivider	: false,
	hideNavbar	: true,
	visible		: 3
};
