import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import { type, uniqueId } from '../../_modules/helpers';

export default function (this: Mmenu, navbar: HTMLElement) {
    
    navbar.id = navbar.id || uniqueId();
    
    this.opts.searchfield = this.opts.searchfield || {};
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = `#${navbar.id}`;
}
