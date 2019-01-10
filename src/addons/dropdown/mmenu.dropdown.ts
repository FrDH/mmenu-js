Mmenu.addons.dropdown = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts = this.opts.dropdown,
		conf = this.conf.dropdown;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' && opts )
	{
		(opts as mmLooseObject) = {
			drop: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	if ( typeof opts.position == 'string' )
	{
		opts.position = {
			of: opts.position
		};
	}
	//	/Extend shorthand options


	this.opts.dropdown = Mmenu.extend( opts, Mmenu.options.dropdown );


	if ( !opts.drop )
	{
		return;
	}


	var $button : JQuery;

	this.bind( 'initMenu:after', () => {
		this.node.menu.classList.add( 'mm-menu_dropdown' );

		if ( typeof opts.position.of != 'string' )
		{
			let id = this.vars.orgMenuId;
			if ( id && id.length )
			{
				opts.position.of = '[href="#' + id + '"]';
			}
		}
		if ( typeof opts.position.of != 'string' )
		{
			return;
		}


		//	Get the button to put the menu next to
		$button = Mmenu.$(opts.position.of);

		//	Emulate hover effect
		var events = opts.event.split( ' ' );
		if ( events.length == 1 )
		{
			events[ 1 ] = events[ 0 ];
		}
		if ( events[ 0 ] == 'hover' )
		{
			$button.on( 'mouseenter.mm-dropdown',
				() => {
					this.open();
				}
			);
		}
		if ( events[ 1 ] == 'hover' )
		{
			Mmenu.$(this.node.menu).on( 'mouseleave.mm-dropdown',
				() => {
					this.close();
				}
			);
		}
	});


	//	Add/remove classname and style when opening/closing the menu
	this.bind( 'open:start', () => {
		(this.node.menu as any).mmStyle = this.node.menu.getAttribute( 'style' ) || '';
		Mmenu.$('html').addClass( 'mm-wrapper_dropdown' );
	});

	this.bind( 'close:finish', () => {
		this.node.menu.setAttribute( 'style', (this.node.menu as any).mmStyle );
		Mmenu.$('html').removeClass( 'mm-wrapper_dropdown' );
	});


	//	Update the position and sizes
	var getPosition = function( 
		this	: Mmenu,
		dir		: string,
		obj		: mmLooseObject
	) {
		var css = obj[ 0 ],
			cls = obj[ 1 ];

		var _scr = dir == 'x' ? 'scrollLeft' 	: 'scrollTop',
			_out = dir == 'x' ? 'outerWidth' 	: 'outerHeight',
			_str = dir == 'x' ? 'left' 			: 'top',
			_stp = dir == 'x' ? 'right' 		: 'bottom',
			_siz = dir == 'x' ? 'width' 		: 'height',
			_max = dir == 'x' ? 'maxWidth' 		: 'maxHeight',
			_pos = null;

		var scrl = Mmenu.$(window)[ _scr ](),
			strt = $button.offset()[ _str ] -= scrl,
			stop = strt + $button[ _out ](),
			wndw = Mmenu.$(window)[ _siz ]();

		var offs = conf.offset.button[ dir ] + conf.offset.viewport[ dir ];

		//	Position set in option
		if ( opts.position[ dir ] )
		{
			switch ( opts.position[ dir ] )
			{
				case 'left':
				case 'bottom':
					_pos = 'after';
					break;

				case 'right':
				case 'top':
					_pos = 'before';
					break;
			}
		}

		//	Position not set in option, find most space
		if ( _pos === null )
		{
			_pos = ( strt + ( ( stop - strt ) / 2 ) < wndw / 2 ) ? 'after' : 'before';
		}

		//	Set position and max
		var val, max;
		if ( _pos == 'after' )
		{
			val = ( dir == 'x' ) ? strt : stop;
			max = wndw - ( val + offs );

			css[ _str ] = val + conf.offset.button[ dir ];
			css[ _stp ] = 'auto';

			if ( opts.tip )
			{
				cls.push( 'mm-menu_tip-' + ( dir == 'x' ? 'left' : 'top' ) );
			}
		}
		else
		{
			val = ( dir == 'x' ) ? stop : strt;
			max = val - offs;

			css[ _stp ] = 'calc( 100% - ' + ( val - conf.offset.button[ dir ] ) + 'px )';
			css[ _str ] = 'auto';

			if ( opts.tip )
			{
				cls.push( 'mm-menu_tip-' + ( dir == 'x' ? 'right' : 'bottom' ) );
			}
		}

		if ( opts.fitViewport )
		{
			css[ _max ] = Math.min( conf[ _siz ].max, max );
		}

		return [ css, cls ];
	};
	function position( 
		this : Mmenu
	) {
		if ( !this.vars.opened )
		{
			return;
		}

		this.node.menu.setAttribute( 'style', (this.node.menu as any).mmStyle );

		var obj : [ mmLooseObject, string[] ] = [{}, []];
			obj = getPosition.call( this, 'y', obj );
			obj = getPosition.call( this, 'x', obj );

		Mmenu.$(this.node.menu).css( obj[ 0 ] );

		if ( opts.tip )
		{
			this.node.menu.classList.remove( 'mm-menu_tip-left', 'mm-menu_tip-right', 'mm-menu_tip-top', 'mm-menu_tip-bottom' );
			this.node.menu.classList.add( ...obj[ 1 ] );
		}
	};

	this.bind( 'open:start', position );

	Mmenu.$(window)
		.on( 'resize.mm-dropdown', ( evnt ) => {
			position.call( this );
		});

	if ( !this.opts.offCanvas.blockUI )
	{
		Mmenu.$(window)
			.on( 'scroll.mm-dropdown', ( evnt ) => {
				position.call( this );
			});
	}

};


//	Default options and configuration.
Mmenu.options.dropdown = {
	drop 		: false,
	fitViewport	: true,
	event		: 'click',
	position	: {},
	tip			: true
};

Mmenu.configs.dropdown = {
	offset: {
		button	: {
			x 		: -5,
			y		: 5
		},
		viewport: {
			x 		: 20,
			y 		: 20
		}
	},
	height	: {
		max		: 880
	},
	width	: {
		max		: 440
	}
};
