import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
import { type, uniqueId } from '../../_modules/helpers';

export default function (this: Mmenu, navbar: HTMLElement) {
    
    navbar.id = navbar.id || uniqueId()
    
    if (type(this.opts.searchfield) != 'object') {
        this.opts.searchfield = {};
    }

    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = `#${navbar.id}`;
}
