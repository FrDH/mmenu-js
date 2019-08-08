import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import dragMenu from './_drag.menu';
import { extend } from '../../_modules/helpers';
//	Add the options and configs.
Mmenu.options.drag = options;
export default function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = extendShorthandOptions(this.opts.drag);
    this.opts.drag = extend(options, Mmenu.options.drag);
    //	Drag open the menu
    if (options.menu.open) {
        this.bind('setPage:after', function (page) {
            dragMenu.call(_this, options.menu.node || page);
        });
    }
}
