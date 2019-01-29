Mmenu.addons.columns = function(
	this : Mmenu
) {
	var opts = this.opts.columns;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add 	: opts
		};
	}
	if ( typeof opts == 'number' )
	{
		opts = {
			add 	: true,
			visible : opts
		};
	}

	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	if ( typeof opts.visible == 'number' )
	{
		opts.visible = {
			min 	: opts.visible,
			max 	: opts.visible
		};
	}
	//	/Extend shorthand options


	this.opts.columns = Mmenu.extend( opts, Mmenu.options.columns );


	//	Add the columns
	if ( opts.add )
	{
		opts.visible.min = Math.max( 1, Math.min( 6, opts.visible.min ) );
		opts.visible.max = Math.max( opts.visible.min, Math.min( 6, opts.visible.max ) );


		var colm = '',
			colp = '';

		for ( var i = 0; i <= opts.visible.max; i++ )
		{
			colm += ' mm-menu_columns-' + i;
			colp += ' mm-panel_columns-' + i;
		}
		if ( colm.length )
		{
			colm = colm.slice( 1 );
			colp = colp.slice( 1 );
		}

		var rmvc = colp + ' mm-panel_opened mm-panel_opened-parent mm-panel_highest';


		//	Close all later opened panels
		this.bind( 'openPanel:before', (
			panel : HTMLElement
		) => {
			var parent : HTMLElement;

			if ( panel )
			{
				parent = panel[ 'mmParent' ];
			}

			if ( !parent )
			{
				return;
			}

			parent = (parent.closest( '.mm-panel' ) as HTMLElement);
			if ( !parent )
			{
				return;
			}

			var classname = parent.className;
			if ( !classname.length )
			{
				return;
			}

			classname = classname.split( 'mm-panel_columns-' )[ 1 ];
			if ( !classname )
			{
				return;
			}

			var colnr = parseInt( classname.split( ' ' )[ 0 ], 10 ) + 1;
			while( colnr > 0 )
			{
				panel = Mmenu.DOM.children( this.node.pnls, '.mm-panel_columns-' + colnr )[ 0 ];
				if ( panel )
				{
					colnr++;
					panel.classList.remove( rmvc );
					panel.classList.add( 'mm-hidden' );
				}
				else
				{
					colnr = -1;
					break;
				}
			}
		});

		this.bind( 'openPanel:start', (
			panel : HTMLElement
		) => {
			var _num = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened-parent' ).length;
			if ( !panel.matches( '.mm-panel_opened-parent' ) )
			{
				_num++;
			}
			_num = Math.min( opts.visible.max, Math.max( opts.visible.min, _num ) );

			this.node.menu.classList.remove( ...colm.split( ' ' ) );
			this.node.menu.classList.add( 'mm-menu_columns-' + _num );

			var panels : HTMLElement[] = [];
			Mmenu.DOM.children( this.node.pnls, '.mm-panel' )
				.forEach(( panel ) => {
					panel.classList.remove( ...colp.split( ' ' ) );
					if ( panel.matches( '.mm-panel_opened-parent' ) )
					{
						panels.push( panel );
					}
				});

//	TODO: check if not in array?
			panels.push( panel );
			panels.slice( -opts.visible.max )
				.forEach(( panel, p ) => {
					panel.classList.add( 'mm-panel_columns-' + p );
				});
		});
	}
};


//	Default options and configuration.
Mmenu.options.columns = {
	add 		: false,
	visible		: {
		min			: 1,
		max			: 3
	}
};
