import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

export default function( 
	this	: Mmenu,
	navbar	: HTMLElement
) {
	if ( Mmenu.typeof( this.opts.searchfield ) != 'object' ) {
		(this.opts.searchfield as mmLooseObject) = {};
	}

	this.opts.searchfield.add 	= true;
	this.opts.searchfield.addTo = [ navbar ];
};