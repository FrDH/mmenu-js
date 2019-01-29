Mmenu.addons.counters = function () {
    var _this = this;
    var opts = this.opts.counters;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts,
            count: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (opts.addTo == 'panels') {
        opts.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.counters = Mmenu.extend(opts, Mmenu.options.counters);
    //	Refactor counter class
    this.bind('initListview:after', function (panel) {
        var cntrclss = _this.conf.classNames.counters.counter, counters = panel.querySelectorAll('.' + cntrclss);
        counters.forEach(function (counter) {
            Mmenu.refactorClass(counter, cntrclss, 'mm-counter');
        });
    });
    //	Add the counters after a listview is initiated.
    if (opts.add) {
        this.bind('initListview:after', function (panel) {
            if (!panel.matches(opts.addTo)) {
                return;
            }
            var parent = panel['mmParent'];
            if (parent) {
                //	Check if no counter already excists.
                if (!parent.querySelector('.mm-counter')) {
                    var counter = Mmenu.DOM.create('span.mm-counter');
                    var btn = Mmenu.DOM.children(parent, '.mm-btn')[0];
                    if (btn) {
                        btn.prepend(counter);
                    }
                }
            }
        });
    }
    if (opts.count) {
        function count(panel) {
            var panels = panel ? [panel] : Mmenu.DOM.children(this.node.pnls, '.mm-panel');
            panels.forEach(function (panel) {
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
                    .forEach(function (listview) {
                    listitems.push.apply(listitems, Mmenu.DOM.children(listview));
                });
                counter.innerHTML = Mmenu.filterListItems(listitems).length.toString();
            });
        }
        ;
        this.bind('initListview:after', count);
        this.bind('updateListview', count);
    }
};
//	Default options and configuration.
Mmenu.options.counters = {
    add: false,
    addTo: 'panels',
    count: false
};
Mmenu.configs.classNames.counters = {
    counter: 'Counter'
};
