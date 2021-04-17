import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
import { type } from '../../_modules/helpers';

export default function (this: Mmenu, navbar: HTMLElement) {

    const searchfield = DOM.create('div.mm-navbar__searchfield');
    navbar.append(searchfield);

    if (type(this.opts.searchfield) != 'object') {
        this.opts.searchfield = {};
    }

    this.opts.searchfield.add = true;
    // TODO
    // this.opts.searchfield.addTo = [searchfield];
}
