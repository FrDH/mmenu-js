import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.counters = options;
Mmenu.configs.classNames.counters = {
    counter: 'Counter'
};
export default function () {
    var options = this.opts.counters;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options,
            count: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.addTo == 'panels') {
        options.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.counters = Mmenu.extend(options, Mmenu.options.counters);
    //	Refactor counter class
    this.bind('initListview:after', (panel) => {
        var cntrclss = this.conf.classNames.counters.counter, counters = panel.querySelectorAll('.' + cntrclss);
        counters.forEach((counter) => {
            Mmenu.refactorClass(counter, cntrclss, 'mm-counter');
        });
    });
    //	Add the counters after a listview is initiated.
    if (options.add) {
        this.bind('initListview:after', (panel) => {
            if (!panel.matches(options.addTo)) {
                return;
            }
            var parent = panel['mmParent'];
            if (parent) {
                //	Check if no counter already excists.
                if (!parent.querySelector('.mm-counter')) {
                    let counter = Mmenu.DOM.create('span.mm-counter');
                    let btn = Mmenu.DOM.children(parent, '.mm-btn')[0];
                    if (btn) {
                        btn.prepend(counter);
                    }
                }
            }
        });
    }
    if (options.count) {
        function count(panel) {
            var panels = panel ? [panel] : Mmenu.DOM.children(this.node.pnls, '.mm-panel');
            panels.forEach((panel) => {
                var parent = panel['mmParent'];
                if (!parent) {
                    return;
                }
                var counter = parent.querySelector('.mm-counter');
                if (!counter) {
                    return;
                }
                var listitems = [];
                Mmenu.DOM.children(panel, '.mm-listview')
                    .forEach((listview) => {
                    listitems.push(...Mmenu.DOM.children(listview));
                });
                counter.innerHTML = Mmenu.filterListItems(listitems).length.toString();
            });
        }
        ;
        this.bind('initListview:after', count);
        this.bind('updateListview', count);
    }
}
;
