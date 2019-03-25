import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

import { type } from '../../core/_helpers';

export default function( 
	this	: Mmenu,
	navbar	: HTMLElement
) {
	if ( type( this.opts.searchfield ) != 'object' ) {
		this.opts.searchfield = {};
	}

	this.opts.searchfield.add 	= true;
	this.opts.searchfield.addTo = [ navbar ];
};