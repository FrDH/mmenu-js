Mmenu.addons.sidebar = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts : mmOptionsSidebar = this.opts.sidebar;


	//	Extend shorthand options
	if ( typeof opts == 'string' ||
	   ( typeof opts == 'boolean' && opts ) ||
		 typeof opts == 'number'
	) {
		(opts as mmLooseObject) = {
			expanded: opts
		};
	}

	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}

	//	Extend collapsed shorthand options.
	if ( typeof opts.collapsed == 'boolean' && opts.collapsed )
	{
		(opts.collapsed as mmLooseObject) = {
			use: 'all'
		};
	}
	if ( typeof opts.collapsed == 'string' ||
		 typeof opts.collapsed == 'number'
	) {
		(opts.collapsed as mmLooseObject) = {
			use: opts.collapsed
		};
	}
	if ( typeof opts.collapsed != 'object' )
	{
		(opts.collapsed as mmLooseObject) = {};
	}
	if ( typeof opts.collapsed.use == 'number' )
	{
		opts.collapsed.use = '(min-width: ' + opts.collapsed.use + 'px)';
	}

	//	Extend expanded shorthand options.
	if ( typeof opts.expanded == 'boolean' && opts.expanded )
	{
		opts.expanded = {
			use: 'all'
		};
	}
	if ( typeof opts.expanded == 'string' ||
		 typeof opts.expanded == 'number'
	) {
		opts.expanded = {
			use: opts.expanded
		};
	}
	if ( typeof opts.expanded != 'object' )
	{
		(opts.expanded as mmLooseObject) = {};
	}
	if ( typeof opts.expanded.use == 'number' )
	{
		opts.expanded.use = '(min-width: ' + opts.expanded.use + 'px)';
	}
	//	/Extend shorthand options


	opts = this.opts.sidebar = jQuery.extend( true, {}, Mmenu.options.sidebar, opts );


	var clsclpsd = 'mm-wrapper_sidebar-collapsed',
		clsxpndd = 'mm-wrapper_sidebar-expanded';


	//	Collapsed
	if ( opts.collapsed.use )
	{
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$menu.addClass( 'mm-menu_sidebar-collapsed' );

				if ( opts.collapsed.blockMenu &&
					 this.opts.offCanvas &&
					!this.node.$menu.children( '.mm-menu__blocker' ).length
				) {
					this.node.$menu.prepend( '<a class="mm-menu__blocker" href="#' + this.node.$menu.attr( 'id' ) + '" />' );
				}
				if ( opts.collapsed.hideNavbar )
				{
					this.node.$menu.addClass( 'mm-menu_hidenavbar' );
				}
				if ( opts.collapsed.hideDivider )
				{
					this.node.$menu.addClass( 'mm-menu_hidedivider' );
				}
			}
		);

		if ( typeof opts.collapsed.use == 'boolean' )
		{
			this.bind( 'initMenu:after',
				function(
					this : Mmenu
				) {
					jQuery('html').addClass( clsclpsd );
				}
			);
		}
		else
		{
			this.matchMedia( opts.collapsed.use,
				function(
					this : Mmenu
				) {
					jQuery('html').addClass( clsclpsd );
				},
				function(
					this : Mmenu
				) {
					jQuery('html').removeClass( clsclpsd );
				}
			);
		}
	}


	//	Expanded
	if ( opts.expanded.use )
	{
		this.bind( 'initMenu:after',
			function(
				this : Mmenu
			) {
				this.node.$menu.addClass( 'mm-menu_sidebar-expanded' );
			}
		);

		if ( typeof opts.expanded.use == 'boolean' )
		{
			this.bind( 'initMenu:after',
				function(
					this : Mmenu
				) {
					jQuery('html').addClass( clsxpndd );
					this.open();
				}
			);
		}
		else
		{
			this.matchMedia( opts.expanded.use,
				function(
					this : Mmenu
				) {
					jQuery('html').addClass( clsxpndd );
					if ( !jQuery('html').hasClass( 'mm-wrapper_sidebar-closed' ) )
					{
						this.open();
					}
				},
				function(
					this : Mmenu
				) {
					jQuery('html').removeClass( clsxpndd );
					this.close();
				}
			);
		}

		this.bind( 'close:start',
			function(
				this : Mmenu
			) {
				if ( jQuery('html').hasClass( clsxpndd ) )
				{
					jQuery('html').addClass( 'mm-wrapper_sidebar-closed' );
				}
			}
		);

		this.bind( 'open:start',
			function(
				this : Mmenu
			) {
				jQuery('html').removeClass( 'mm-wrapper_sidebar-closed' );
			}
		);


		//	Add click behavior.
		//	Prevents default behavior when clicking an anchor
		this.clck.push(
			function(
				this : Mmenu,
				$a	 : JQuery,
				args : mmClickArguments
			) {

				if ( args.inMenu && args.inListview )
				{
					if ( jQuery('html').hasClass( 'mm-wrapper_sidebar-expanded' ) )
					{
						return {
							close: false
						};
					}
				}
			}
		);

	}
};


//	Default options and configuration.
(Mmenu.options.sidebar as mmOptionsSidebar) = {
	collapsed 	: {
		use 		: false,
		blockMenu	: true,
		hideDivider	: false,
		hideNavbar	: true
	},
	expanded 	: {
		use			: false
	}
};
