Mmenu.addons.lazySubmenus = function(
	this : Mmenu
) {
	var opts = this.opts.lazySubmenus;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		opts = {
			load : opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	// opts = this.opts.lazySubmenus = jQuery.extend( true, {}, Mmenu.options.lazySubmenus, opts );
	this.opts.lazySubmenus = Mmenu.extend( opts, Mmenu.options.lazySubmenus );


	//	Sliding submenus
	if ( opts.load )
	{

		//	prevent all sub panels from initPanels
		this.bind( 'initMenu:after', () => {
			var panels : HTMLElement[] = [];

			//	Find all potential subpanels
			Mmenu.DOM.find( this.node.pnls, 'li' )
				.forEach(( listitem ) => {
					panels.push( ...Mmenu.DOM.children( listitem, this.conf.panelNodetype.join( ', ' ) ) )
				});

			//	Filter out all non-panels and add the lazyload classes
			panels.filter( panel => !panel.matches( '.mm-listview_inset' ) )
				.filter( panel => !panel.matches( '.mm-nolistview' ) )
				.filter( panel => !panel.matches( '.mm-nopanel' ) )
				.forEach(( panel ) => {
					panel.classList.add( 'mm-panel_lazysubmenu', 'mm-nolistview', 'mm-nopanel' );
				});
		});

		//	prepare current and one level sub panels for initPanels
		this.bind( 'initPanels:before', ( 
			panels	?: HTMLElement[]
		) => {
			panels = panels || Mmenu.DOM.children( this.node.pnls, this.conf.panelNodetype.join( ', ' ) );

			panels.forEach(( panel ) => {
				var filter = '.mm-panel_lazysubmenu',
					panels = Mmenu.DOM.find( panel, filter );

				if ( panel.matches( filter ) )
				{
					panels.unshift( panel );
				}
				panels.filter( panel => !panel.matches( '.mm-panel_lazysubmenu .mm-panel_lazysubmenu' ) )
					.forEach(( panel ) => {
						panel.classList.remove( 'mm-panel_lazysubmenu', 'mm-nolistview', 'mm-nopanel' );
					});
			});				
		});

		//	initPanels for the default opened panel
		this.bind( 'initOpened:before', () => {

			var panels : HTMLElement[] = [];
			Mmenu.DOM.find( this.node.pnls, '.' + this.conf.classNames.selected )
				.forEach(( listitem ) => {
					panels.push( ...Mmenu.DOM.parents( listitem, '.mm-panel_lazysubmenu' ) );
				});

			if ( panels.length )
			{
				panels.forEach(( panel ) => {
					panel.classList.remove( 'mm-panel_lazysubmenu', 'mm-nolistview mm-nopanel' );
				});
				this.initPanels( [ panels[ panels.length - 1 ] ] );
			}
		});

		//	initPanels for current- and sub panels before openPanel
		this.bind( 'openPanel:before', ( 
			panel : HTMLElement
		) => {
			var filter = '.mm-panel_lazysubmenu',
				panels = Mmenu.DOM.find( panel, filter );
			if ( panel.matches( filter ) )
			{
				panels.unshift( panel );
			}
			panels = panels.filter( panel => !panel.matches( '.mm-panel_lazysubmenu .mm-panel_lazysubmenu' ) );

			if ( panels.length )
			{
				this.initPanels( panels );
			}
		});
	}
};


//	Default options and configuration.
Mmenu.options.lazySubmenus = {
	load: false
};
