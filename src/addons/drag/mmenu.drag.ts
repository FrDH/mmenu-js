import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import dragOpen from './_drag.open';
import { extend } from '../../_modules/helpers';

//	Add the options and configs.
Mmenu.options.drag = options;

export default function(this: Mmenu) {
    if (!this.opts.offCanvas) {
        return;
    }

    var options = extendShorthandOptions(this.opts.drag);
    this.opts.drag = extend(options, Mmenu.options.drag);

    //	Drag open the menu
    if (options.open) {
        this.bind('setPage:after', page => {
            dragOpen.call(this, options.node || page);
        });
    }
}
