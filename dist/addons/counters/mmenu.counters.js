import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
//	Add the options.
Mmenu.options.counters = options;
//	Add the classnames.
Mmenu.configs.classNames.counters = {
    counter: 'Counter',
};
export default function () {
    var options = extendShorthandOptions(this.opts.counters);
    this.opts.counters = extend(options, Mmenu.options.counters);
    //	Refactor counter class
    this.bind('initListview:after', (listview) => {
        var cntrclss = this.conf.classNames.counters.counter, counters = DOM.find(listview, '.' + cntrclss);
        counters.forEach((counter) => {
            DOM.reClass(counter, cntrclss, 'mm-counter');
        });
    });
    //	Add the counters after a listview is initiated.
    if (options.add) {
        this.bind('initListview:after', (listview) => {
            if (!listview.matches(options.addTo)) {
                return;
            }
            var panel = listview.closest('.mm-panel');
            var parent = DOM.find(this.node.pnls, `#${panel.dataset.mmParent}`)[0];
            if (parent) {
                //	Check if no counter already excists.
                if (!DOM.find(parent, '.mm-counter').length) {
                    let btn = DOM.children(parent, '.mm-btn')[0];
                    if (btn) {
                        btn.prepend(DOM.create('span.mm-counter'));
                    }
                }
            }
        });
    }
    if (options.count) {
        const count = (listview) => {
            var panels = listview
                ? [listview.closest('.mm-panel')]
                : DOM.children(this.node.pnls, '.mm-panel');
            panels.forEach(panel => {
                const parent = DOM.find(this.node.pnls, `#${panel.dataset.mmParent}`)[0];
                if (!parent) {
                    return;
                }
                const counter = DOM.find(parent, '.mm-counter')[0];
                if (!counter) {
                    return;
                }
                const listitems = [];
                DOM.children(panel, '.mm-listview').forEach((listview) => {
                    listitems.push(...DOM.children(listview));
                });
                counter.innerHTML = DOM.filterLI(listitems).length.toString();
            });
        };
        this.bind('initListview:after', count);
        this.bind('updateListview', count);
    }
}
