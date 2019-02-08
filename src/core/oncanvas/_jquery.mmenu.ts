(function( $ ) {

	if ( $ )
	{
		/**
		 * jQuery plugin mmenu.
		 */
	 	$.fn[ 'mmenu' ] = function( options, configs )
		{
			var $result = $();

			this.each(( e, element ) => {

				//	Don't proceed if the element already is a mmenu.
				if ( element[ 'mmenu' ] )
				{
					return;
				}

				let  menu = new Mmenu( element, options, configs ),
					$menu = $( menu.node.menu );

				//	Store the API.
				$menu.data( 'mmenu', menu.API );

				$result = $result.add( $menu );
			});

			return $result;
		};
	}

 })( jQuery || Zepto || null );