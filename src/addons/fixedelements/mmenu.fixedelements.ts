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
		fixed	: HTMLElement[],
		stick 	: HTMLElement[];


	this.bind( 'setPage:after', ( 
		page : HTMLElement
	) => {

		//	Fixed elements
		_fixd = this.conf.classNames.fixedElements.fixed;

		fixed = Mmenu.DOM.find( page, '.' + _fixd );
		fixed.forEach(( fxd ) => {
			Mmenu.refactorClass( fxd, _fixd, 'mm-slideout' );
		});

		document.querySelector( conf.fixed.insertSelector )[ conf.fixed.insertMethod ]( fixed );

		//	Sticky elements
		_stck = this.conf.classNames.fixedElements.sticky;

		Mmenu.DOM.find( page, '.' + _stck )
			.forEach(( stick ) => {
				Mmenu.refactorClass( (stick as HTMLElement), _stck, 'mm-sticky' );
			});

		stick = Mmenu.DOM.find( page, '.mm-sticky' );
	});
	
	this.bind( 'open:start', () => {
		if ( stick.length )
		{
			if ( window.getComputedStyle( document.documentElement ).overflow == 'hidden' )
			{
				var scrolltop = Mmenu.$(window).scrollTop() + conf.sticky.offset;
				stick.forEach(( element ) => {
					element.style.top = ( parseInt( Mmenu.$(element).css( 'top' ), 10 ) + scrolltop ) + 'px';
				});
			}
		}
	});
	this.bind( 'close:finish', () => {
		stick.forEach(( element ) => {
			element.style.top = '';
		});
	});
};


//	Default options and configuration.
Mmenu.configs.fixedElements = {
	fixed	: {
		insertMethod	: 'append',
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