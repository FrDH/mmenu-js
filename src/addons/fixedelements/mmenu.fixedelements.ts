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
		fixed	: NodeListOf<Element>,
		stick 	: NodeListOf<Element>;


	this.bind( 'setPage:after', ( 
		page : HTMLElement
	) => {
		//	Fixed elements
		_fixd = this.conf.classNames.fixedElements.fixed;
		fixed = page.querySelectorAll( '.' + _fixd );

		fixed.forEach(( fxd, f ) => {
			Mmenu.refactorClass( (fxd as HTMLElement), _fixd, 'mm-slideout' );
		});
		

		Mmenu.$(fixed)[ conf.fixed.insertMethod ]( conf.fixed.insertSelector );

		//	Sticky elements
		_stck = this.conf.classNames.fixedElements.sticky;
		stick = page.querySelectorAll( '.' + _stck );

		stick.forEach(( stck, s ) => {
			Mmenu.refactorClass( (stck as HTMLElement), _stck, 'mm-sticky' );
		});

		stick = page.querySelectorAll( '.mm-sticky' );
	});
	
	this.bind( 'open:start', () => {
		if ( stick.length )
		{
			if ( Mmenu.$('html').css( 'overflow' ) == 'hidden' )
			{
				var scrolltop = Mmenu.$(window).scrollTop() + conf.sticky.offset;
				stick.forEach(
					( stck, s ) => {
						Mmenu.$(stck).css( 'top', parseInt( Mmenu.$(stck).css( 'top' ), 10 ) + scrolltop );
					}
				);
			}
		}
	});
	this.bind( 'close:finish', () => {
		if ( stick.length )
		{
			Mmenu.$(stick).css( 'top', '' );
		}
	});
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