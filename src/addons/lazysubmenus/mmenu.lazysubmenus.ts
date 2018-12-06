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
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$pnls
					.find( 'li' )
					.children( this.conf.panelNodetype )
					.not( '.mm-listview_inset' )
					.not( '.mm-nolistview' )
					.not( '.mm-nopanel' )
					.addClass( 'mm-panel_lazysubmenu mm-nolistview mm-nopanel' );
			}
		);

		//	prepare current and one level sub panels for initPanels
		this.bind( 'initPanels:before',
			function( 
				this	 : Mmenu,
				$panels	?: JQuery
			) {
				$panels = $panels || this.node.$pnls.children( this.conf.panelNodetype );

				Mmenu.findAddSelf( $panels, '.mm-panel_lazysubmenu' )
					.not( '.mm-panel_lazysubmenu .mm-panel_lazysubmenu' )
					.removeClass( 'mm-panel_lazysubmenu mm-nolistview  mm-nopanel' );
			}
		);

		//	initPanels for the default opened panel
		this.bind( 'initOpened:before',
			function(
				this : Mmenu
			) {
				var $selected = this.node.$pnls
					.find( '.' + this.conf.classNames.selected )
					.parents( '.mm-panel_lazysubmenu' );

				if ( $selected.length )
				{
					$selected.removeClass( 'mm-panel_lazysubmenu mm-nolistview mm-nopanel' );
					this.initPanels( $selected.last() );
				}
			}
		);

		//	initPanels for current- and sub panels before openPanel
		this.bind( 'openPanel:before',
			function( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				var $panels = Mmenu.findAddSelf( $panel, '.mm-panel_lazysubmenu' )
					.not( '.mm-panel_lazysubmenu .mm-panel_lazysubmenu' );

				if ( $panels.length )
				{
					this.initPanels( $panels );
				}
			}
		);
	}
};


//	Default options and configuration.
Mmenu.options.lazySubmenus = {
	load: false
};
