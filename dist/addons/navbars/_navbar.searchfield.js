import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
export default function (navbar) {
    if (Mmenu.typeof(this.opts.searchfield) != 'object') {
        this.opts.searchfield = {};
    }
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = [navbar];
}
;
