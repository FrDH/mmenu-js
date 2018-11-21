Mmenu.addons.navbars = function(
	this : Mmenu
) {
	var navs = this.opts.navbars,
		conf = this.conf.navbars;


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

	jQuery.each(
		navs,
		( n ) => {
		
			var opts = navs[ n ];

			//	Extend shorthand options
			if ( typeof opts == 'boolean' && opts )
			{
				opts = {};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			if ( typeof opts.content == 'undefined' )
			{
				opts.content = [ 'prev', 'title' ];
			}
			if ( !( opts.content instanceof Array ) )
			{
				opts.content = [ opts.content ];
			}
			opts = jQuery.extend( true, {}, this.opts.navbar, opts );

			//	Create node
			var $navbar = jQuery( '<div class="mm-navbar" />' );
				

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
				$pos[ poss ] = jQuery( '<div class="mm-navbars_' + poss + '" />' );
			}
			$pos[ poss ].append( $navbar );


			//	Add content
			for ( var c = 0, l = opts.content.length; c < l; c++ )
			{
				var ctnt = Mmenu.addons.navbars[ opts.content[ c ] ] || null;
				if ( ctnt )
				{
					ctnt.call( this, $navbar, opts, conf );
				}
				else
				{
					ctnt = opts.content[ c ];
					if ( !( ctnt instanceof jQuery ) )
					{
						ctnt = jQuery( opts.content[ c ] );
					}
					$navbar.append( ctnt );
				}
			}

			//	Call type
			var type = Mmenu.addons.navbars[ opts.type ] || null;
			if ( type )
			{
				type.call( this, $navbar, opts, conf );
			}

			if ( $navbar.children( '.mm-btn' ).length )
			{
				$navbar.addClass( 'mm-navbar_has-btns' );
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


//	Default options and configuration
Mmenu.configs.navbars = {
	breadcrumbs: {
		separator 		: '/',
		removeFirst 	: false
	}
};
Mmenu.configs.classNames.navbars = {};