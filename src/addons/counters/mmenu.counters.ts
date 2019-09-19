import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options.
Mmenu.options.counters = options;

//	Add the classnames.
Mmenu.configs.classNames.counters = {
    counter: 'Counter'
};

export default function(this: Mmenu) {
    var options = extendShorthandOptions(this.opts.counters);
    this.opts.counters = extend(options, Mmenu.options.counters);

    //	Refactor counter class
    this.bind('initListview:after', (listview: HTMLElement) => {
        var cntrclss = this.conf.classNames.counters.counter,
            counters = DOM.find(listview, '.' + cntrclss);

        counters.forEach(counter => {
            DOM.reClass(counter as HTMLElement, cntrclss, 'mm-counter');
        });
    });

    //	Add the counters after a listview is initiated.
    if (options.add) {
        this.bind('initListview:after', (listview: HTMLElement) => {
            if (!listview.matches(options.addTo)) {
                return;
            }

            var parent: HTMLElement = listview.closest('.mm-panel')['mmParent'];
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
        const count = (listview?: HTMLElement) => {
            var panels: HTMLElement[] = listview
                ? [listview.closest('.mm-panel') as HTMLElement]
                : DOM.children(this.node.pnls, '.mm-panel');

            panels.forEach(panel => {
                var parent: HTMLElement = panel['mmParent'];

                if (!parent) {
                    return;
                }

                var counter = DOM.find(parent, '.mm-counter')[0];
                if (!counter) {
                    return;
                }

                var listitems: HTMLElement[] = [];
                DOM.children(panel, '.mm-listview').forEach(listview => {
                    listitems.push(...DOM.children(listview));
                });

                counter.innerHTML = DOM.filterLI(listitems).length.toString();
            });
        };

        this.bind('initListview:after', count);
        this.bind('updateListview', count);
    }
}
