Mmenu.addons.autoHeight = function(
	this : Mmenu
) {

	var opts : mmOptionsAutoheight = this.opts.autoHeight;


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
	opts = this.opts.autoHeight = jQuery.extend( true, {}, Mmenu.options.autoHeight, opts );
	//	/Extend shorthand options


	if ( opts.height != 'auto' && opts.height != 'highest' )
	{
		return;
	}


	this.bind( 'initMenu:after',
		function(
			this : Mmenu
		) {
			this.node.$menu.addClass( 'mm-menu_autoheight' );
		}
	);


	//	Set the height
	function setHeight(
		 this	: Mmenu,
		 $panel	: JQuery
	) {
		if ( this.opts.offCanvas && !this.vars.opened )
		{
			return;
		}

		var _top = Math.max( parseInt( this.node.$pnls.css( 'top' )		, 10 ), 0 ) || 0,
			_bot = Math.max( parseInt( this.node.$pnls.css( 'bottom' )	, 10 ), 0 ) || 0,
			_hgh = 0;

		this.node.$menu.addClass( 'mm-menu_autoheight-measuring' );

		if ( opts.height == 'auto' )
		{
			$panel = $panel || this.node.$pnls.children( '.mm-panel_opened' );
			if ( $panel.parent( '.mm-listitem_vertical' ).length )
			{
				$panel = $panel
					.parents( '.mm-panel' )
					.not(
						function()
						{
							return jQuery(this).parent( '.mm-listitem_vertical' ).length ? true : false;
						}
					);
			}
			if ( !$panel.length )
			{
				$panel = this.node.$pnls.children( '.mm-panel' );
			}

			_hgh = $panel.first().outerHeight();
		}
		else if ( opts.height == 'highest' )
		{
			this.node.$pnls
				.children('.mm-panel' )
				.each(
					function()
					{
						var $panel = jQuery(this);
						if ( $panel.parent( '.mm-listitem_vertical' ).length )
						{
							$panel = $panel
								.parents( '.mm-panel' )
								.not(
									function()
									{
										return jQuery(this).parent( '.mm-listitem_vertical' ).length ? true : false
									}
								);
						}
						_hgh = Math.max( _hgh, $panel.first().outerHeight() );
					}
				);
		}

		this.node.$menu
			.height( _hgh + _top + _bot )
			.removeClass( 'mm-menu_autoheight-measuring' );
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
(Mmenu.options.autoHeight as mmOptionsAutoheight) = {
	height: 'default' // 'default/highest/auto'
};
