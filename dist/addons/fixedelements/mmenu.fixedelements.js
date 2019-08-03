import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import configs from './_configs';
import * as DOM from '../../_modules/dom';
//	Add the configs.
Mmenu.configs.fixedElements = configs;
//	Add the classnames.
Mmenu.configs.classNames.fixedElements = {
    fixed: 'Fixed',
    sticky: 'Sticky'
};
export default function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var configs = this.conf.fixedElements;
    var _fixd, _stck, fixed, stick, wrppr;
    this.bind('setPage:after', function (page) {
        //	Fixed elements
        _fixd = _this.conf.classNames.fixedElements.fixed;
        wrppr = DOM.find(document, configs.fixed.insertSelector)[0];
        fixed = DOM.find(page, '.' + _fixd);
        fixed.forEach(function (fxd) {
            DOM.reClass(fxd, _fixd, 'mm-slideout');
            wrppr[configs.fixed.insertMethod](fxd);
        });
        //	Sticky elements
        _stck = _this.conf.classNames.fixedElements.sticky;
        DOM.find(page, '.' + _stck).forEach(function (stick) {
            DOM.reClass(stick, _stck, 'mm-sticky');
        });
        stick = DOM.find(page, '.mm-sticky');
    });
    this.bind('open:start', function () {
        if (stick.length) {
            if (window.getComputedStyle(_this.node.wrpr).overflow == 'hidden') {
                var scrollTop_1 = window.scrollY + configs.sticky.offset;
                stick.forEach(function (element) {
                    element.style.top =
                        parseInt(window.getComputedStyle(element).top, 10) +
                            scrollTop_1 +
                            'px';
                });
            }
        }
    });
    this.bind('close:finish', function () {
        stick.forEach(function (element) {
            element.style.top = '';
        });
    });
}
