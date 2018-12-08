Mmenu.addons.fixedElements = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}


	var conf = this.conf.fixedElements;

	var _fixd 	: string,
		_stck 	: string, 
		$fixd	: JQuery,
		$stck 	: JQuery;


	this.bind( 'setPage:after',
		function( 
			this	: Mmenu,
			$page	: JQuery
		) {
			//	Fixed elements
			_fixd = this.conf.classNames.fixedElements.fixed;
			$fixd = $page.find( '.' + _fixd );

			Mmenu.refactorClass( $fixd, _fixd, 'mm-slideout' );

			$fixd[ conf.fixed.insertMethod ]( conf.fixed.insertSelector );

			//	Sticky elements
			_stck = this.conf.classNames.fixedElements.sticky;
			$stck = $page.find( '.' + _stck );

			Mmenu.refactorClass( $stck, _stck, 'mm-sticky' );

			$stck = $page.find( '.mm-sticky' );
		}
	);
	
	this.bind( 'open:start',
		function(
			this : Mmenu
		) {
			if ( $stck.length )
			{
				if ( Mmenu.$('html').css( 'overflow' ) == 'hidden' )
				{
					var scrolltop = Mmenu.$(window).scrollTop() + conf.sticky.offset;
					$stck.each(
						( i, elem ) => {
							Mmenu.$(elem).css( 'top', parseInt( Mmenu.$(elem).css( 'top' ), 10 ) + scrolltop );
						}
					);
				}
			}
		}
	);
	this.bind( 'close:finish',
		function(
			this : Mmenu
		) {
			if ( $stck.length )
			{
				$stck.css( 'top', '' );
			}
		}
	);
};


//	Default options and configuration.
Mmenu.configs.fixedElements = {
	fixed	: {
		insertMethod	: 'appendTo',
		insertSelector	: 'body'
	},
	sticky 	: {
		offset : 0
	}
};

Mmenu.configs.classNames.fixedElements = {
	fixed 	: 'Fixed',
	sticky	: 'Sticky'
};