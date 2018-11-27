Mmenu.addons.fixedElements = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}


	var conf : mmConfigsFixedelements = this.conf.fixedElements;

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
				if ( jQuery('html').css( 'overflow' ) == 'hidden' )
				{
					var _s = jQuery(window).scrollTop() + conf.sticky.offset;
					$stck.each(
						function()
						{
							jQuery(this).css( 'top', parseInt( jQuery(this).css( 'top' ), 10 ) + _s );
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
(Mmenu.configs.fixedElements as mmConfigsFixedelements) = {
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