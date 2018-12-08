Mmenu.addons.navbars = function(
	this : Mmenu
) {
	var navs = this.opts.navbars;


	if ( typeof navs == 'undefined' )
	{
		return;
	}

	if ( !( navs instanceof Array ) )
	{
		navs = [ navs ];
	}

	var _pos = {},
		$pos = {};

	if ( !navs.length )
	{
		return;
	}

	navs.forEach(
		( opts ) => {

			//	Extend shorthand options
			if ( typeof opts == 'boolean' && opts )
			{
				(opts as mmLooseObject) = {};
			}
			if ( typeof opts != 'object' )
			{
				(opts as mmLooseObject) = {};
			}
			if ( typeof opts.content == 'undefined' )
			{
				opts.content = [ 'prev', 'title' ];
			}
			if ( !( opts.content instanceof Array ) )
			{
				opts.content = [ opts.content ];
			}
			//	/Extend shorthand options


			//	Create node
			var $navbar = Mmenu.$( '<div class="mm-navbar" />' );
				

			//	Get height
			var hght = opts.height;

			if ( typeof hght != 'number' )
			{
				hght = 1;
			}
			else
			{
				hght = Math.min( 4, Math.max( 1, hght ) );
				if ( hght > 1 )
				{
					$navbar.addClass( 'mm-navbar_size-' + hght );
				}
			}

			//	Get position
			var poss = opts.position;

			switch( poss )
			{
				case 'bottom':
					break;

				default:
					poss = 'top';
					break;
			}

			if ( !_pos[ poss ] )
			{
				_pos[ poss ] = 0;
			}
			_pos[ poss ] += hght;

			if ( !$pos[ poss ] )
			{
				$pos[ poss ] = Mmenu.$( '<div class="mm-navbars_' + poss + '" />' );
			}
			$pos[ poss ].append( $navbar );


			//	Add content
			for ( var c = 0, l = opts.content.length; c < l; c++ )
			{
				//	Content from
				var ctnt = ( typeof opts.content[ c ] == 'string' && Mmenu.addons.navbars[ (opts.content[ c ] as string) ] ) || null;
				if ( ctnt )
				{
					ctnt.call( this, $navbar );
				}
				else
				{
					ctnt = opts.content[ c ];
					if ( !( ctnt instanceof Mmenu.$ ) )
					{
						ctnt = Mmenu.$( (opts.content[ c ] as string) );
					}
					$navbar.append( ctnt );
				}
			}

			//	Added buttons
			if ( $navbar.children( '.mm-btn' ).length )
			{
				$navbar.addClass( 'mm-navbar_has-btns' );
			}

			//	Call type
			var type = ( typeof opts.type == 'string' && Mmenu.addons.navbars[ opts.type ] ) || null;
			if ( type )
			{
				type.call( this, $navbar );
			}
		}
	);

	//	Add to menu
	this.bind( 'initMenu:after',
		function(
			this : Mmenu
		) {
			for ( var poss in _pos )
			{
				this.node.$menu.addClass( 'mm-menu_navbar_' + poss + '-' + _pos[ poss ] );
				this.node.$menu[ poss == 'bottom' ? 'append' : 'prepend' ]( $pos[ poss ] );
			}
		}
	);
};


//	Default options and configuration.
Mmenu.options.navbars = [];

Mmenu.configs.navbars = {
	breadcrumbs: {
		separator 	: '/',
		removeFirst : false
	}
};

Mmenu.configs.classNames.navbars = {};
