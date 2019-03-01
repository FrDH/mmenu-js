import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import configs from './_configs';

Mmenu.configs.fixedElements = configs;

Mmenu.configs.classNames.fixedElements = {
	fixed 	: 'Fixed',
	sticky	: 'Sticky'
};


export default function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas ) {
		return;
	}


	var configs = this.conf.fixedElements;

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

		document.querySelector( configs.fixed.insertSelector )[ configs.fixed.insertMethod ]( fixed );

		//	Sticky elements
		_stck = this.conf.classNames.fixedElements.sticky;

		Mmenu.DOM.find( page, '.' + _stck )
			.forEach(( stick ) => {
				Mmenu.refactorClass( (stick as HTMLElement), _stck, 'mm-sticky' );
			});

		stick = Mmenu.DOM.find( page, '.mm-sticky' );
	});
	
	this.bind( 'open:start', () => {
		if ( stick.length ) {
			if ( window.getComputedStyle( document.documentElement ).overflow == 'hidden' ) {
				let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop) + configs.sticky.offset;
				stick.forEach(( element ) => {
					element.style.top = ( parseInt( window.getComputedStyle( element ).top, 10 ) + scrollTop ) + 'px';
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
