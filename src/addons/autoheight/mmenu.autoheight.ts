Mmenu.addons.autoHeight = function(
	this : Mmenu
) {

	var opts = this.opts.autoHeight;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' && opts )
	{
		opts = {
			height: 'auto'
		};
	}
	if ( typeof opts == 'string' )
	{
		opts = {
			height: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	this.opts.autoHeight = Mmenu.extend( opts, Mmenu.options.autoHeight );


	if ( opts.height != 'auto' && opts.height != 'highest' )
	{
		return;
	}


	this.bind( 'initMenu:after', () => {
		this.node.menu.classList.add( 'mm-menu_autoheight' );
	});


	//	Set the height
	function setHeight(
		 this	: Mmenu,
		 panel ?: HTMLElement
	) {
		if ( this.opts.offCanvas && !this.vars.opened )
		{
			return;
		}

		var _top = Math.max( parseInt( Mmenu.$(this.node.pnls).css( 'top' )		, 10 ), 0 ) || 0,
			_bot = Math.max( parseInt( Mmenu.$(this.node.pnls).css( 'bottom' )	, 10 ), 0 ) || 0,
			_hgh = 0;

		this.node.menu.classList.add( 'mm-menu_autoheight-measuring' );

		if ( opts.height == 'auto' )
		{
			if ( !panel )
			{
				panel = Mmenu.DOM.child( this.node.pnls, '.mm-panel_opened' );
			}
			if ( panel && panel.parentElement.matches( '.mm-listitem_vertical' ) )
			{
				panel = Mmenu.$(panel)
					.parents( '.mm-panel' )
					.not(
						( i, elem ) => {
							return elem.parentElement.matches( '.mm-listitem_vertical' );
						}
					)[ 0 ];
			}
			if ( !panel )
			{
				panel = Mmenu.DOM.child( this.node.pnls, '.mm-panel' );
			}

			_hgh = Mmenu.$(panel).outerHeight();
		}
		else if ( opts.height == 'highest' )
		{
			Mmenu.DOM.children( this.node.pnls, '.mm-panel' )
				.forEach(( panel ) => {
					let $panel = Mmenu.$(panel);
					let parent = panel.parentElement;
					if ( parent.matches( '.mm-listitem_vertical' ) )
					{
						$panel = $panel
							.parents( '.mm-panel' )
							.not(
								( i, elem ) => {
									return elem.parentElement.matches( '.mm-listitem_vertical' );
								}
							);
					}
					_hgh = Math.max( _hgh, $panel.first().outerHeight() );
				});
		}

		Mmenu.$(this.node.menu).height( _hgh + _top + _bot );
		this.node.menu.classList.remove( 'mm-menu_autoheight-measuring' );
	};

	if ( this.opts.offCanvas )
	{
		this.bind( 'open:start'			, setHeight );
	}

	if ( opts.height == 'highest' )
	{
		this.bind( 'initPanels:after' 	, setHeight );
	}

	if ( opts.height == 'auto' )
	{
		this.bind( 'updateListview'		, setHeight );
		this.bind( 'openPanel:start'	, setHeight );
		this.bind( 'closePanel'			, setHeight );
	}
};


//	Default options and configuration.
Mmenu.options.autoHeight = {
	height: 'default' // 'default/highest/auto'
};
