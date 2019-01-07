Mmenu.addons.sidebar = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts = this.opts.sidebar;


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


	//opts = this.opts.sidebar = jQuery.extend( true, {}, Mmenu.options.sidebar, opts );
	this.opts.sidebar = Mmenu.extend( opts, Mmenu.options.sidebar );


	var clsclpsd = 'mm-wrapper_sidebar-collapsed',
		clsxpndd = 'mm-wrapper_sidebar-expanded';


	//	Collapsed
	if ( opts.collapsed.use )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_sidebar-collapsed' );

			if ( opts.collapsed.blockMenu &&
				 this.opts.offCanvas &&
				!Mmenu.$(this.node.menu).children( '.mm-menu__blocker' ).length
			) {
				Mmenu.$(this.node.menu).prepend( '<a class="mm-menu__blocker" href="#' + this.node.$menu[ 0 ].id + '" />' );
			}
			if ( opts.collapsed.hideNavbar )
			{
				this.node.menu.classList.add( 'mm-menu_hidenavbar' );
			}
			if ( opts.collapsed.hideDivider )
			{
				this.node.menu.classList.add( 'mm-menu_hidedivider' );
			}
		});

		if ( typeof opts.collapsed.use == 'boolean' )
		{
			this.bind( 'initMenu:after', () => {
				Mmenu.$('html').addClass( clsclpsd );
			});
		}
		else
		{
			this.matchMedia( opts.collapsed.use,
				() => {
					Mmenu.$('html').addClass( clsclpsd );
				},
				() => {
					Mmenu.$('html').removeClass( clsclpsd );
				}
			);
		}
	}


	//	Expanded
	if ( opts.expanded.use )
	{
		this.bind( 'initMenu:after', () => {
			this.node.menu.classList.add( 'mm-menu_sidebar-expanded' );
		});

		if ( typeof opts.expanded.use == 'boolean' )
		{
			this.bind( 'initMenu:after', () => {
				Mmenu.$('html').addClass( clsxpndd );
				this.open();
			});
		}
		else
		{
			this.matchMedia( opts.expanded.use,
				() => {
					Mmenu.$('html').addClass( clsxpndd );
					if ( !Mmenu.$('html').hasClass( 'mm-wrapper_sidebar-closed' ) )
					{
						this.open();
					}
				},
				() => {
					Mmenu.$('html').removeClass( clsxpndd );
					this.close();
				}
			);
		}

		this.bind( 'close:start', () => {
			if ( Mmenu.$('html').hasClass( clsxpndd ) )
			{
				Mmenu.$('html').addClass( 'mm-wrapper_sidebar-closed' );
			}
		});

		this.bind( 'open:start', () => {
			Mmenu.$('html').removeClass( 'mm-wrapper_sidebar-closed' );
		});


		//	Add click behavior.
		//	Prevents default behavior when clicking an anchor
		this.clck.push((
			anchor	: HTMLElement,
			args 	: mmClickArguments
		) => {

			if ( args.inMenu && args.inListview )
			{
				if ( Mmenu.$('html').hasClass( 'mm-wrapper_sidebar-expanded' ) )
				{
					return {
						close: false
					};
				}
			}
		});

	}
};


//	Default options and configuration.
Mmenu.options.sidebar = {
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
