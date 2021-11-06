import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
import { uniqueId } from '../../_modules/helpers';

export default function (this: Mmenu, navbar: HTMLElement) {
    
    /** Empty wrapper for the searchfield. */
    let wrapper = DOM.create('div.mm-navbar__searchfield') as HTMLAnchorElement;
    wrapper.id = uniqueId();

    //	Add button to navbar.
    navbar.append(wrapper);

    this.opts.searchfield = this.opts.searchfield || {};
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = `#${wrapper.id}`;
}
