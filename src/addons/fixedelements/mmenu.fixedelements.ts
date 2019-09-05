import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import configs from './_configs';
import * as DOM from '../../_modules/dom';

//	Add the configs.
Mmenu.configs.fixedElements = configs;

//	Add the classnames.
Mmenu.configs.classNames.fixedElements = {
    fixed: 'Fixed'
};

export default function(this: Mmenu) {
    if (!this.opts.offCanvas) {
        return;
    }

    var configs = this.conf.fixedElements;

    var _fixd: string, fixed: HTMLElement[], wrppr: HTMLElement;

    this.bind('setPage:after', (page: HTMLElement) => {
        _fixd = this.conf.classNames.fixedElements.fixed;
        wrppr = DOM.find(document, configs.insertSelector)[0];
        fixed = DOM.find(page, '.' + _fixd);
        fixed.forEach(fxd => {
            DOM.reClass(fxd, _fixd, 'mm-slideout');
            wrppr[configs.insertMethod](fxd);
        });
    });
}
