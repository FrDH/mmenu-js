Mmenu.addons.sectionIndexer = function () {
    var _this = this;
    var opts = this.opts.sectionIndexer;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.sectionIndexer = Mmenu.extend(opts, Mmenu.options.sectionIndexer);
    if (!opts.add) {
        return;
    }
    this.bind('initPanels:after', function (panels) {
        //	Set the panel(s)
        if (opts.addTo != 'panels') {
            //	TODO addTo kan ook een HTML element zijn?
            panels = Mmenu.DOM.find(_this.node.menu, opts.addTo)
                .filter(function (panel) { return panel.matches('.mm-panel'); });
        }
        panels.forEach(function (panel) {
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach(function (listitem) {
                listitem.closest('.mm-panel').classList.add('mm-panel_has-sectionindexer');
            });
        });
        //	Add the indexer, only if it does not allready excists
        if (!_this.node.indx) {
            var buttons_1 = '';
            'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (letter) {
                buttons_1 += '<a href="#">' + letter + '</a>';
            });
            var indexer = Mmenu.DOM.create('div.mm-sectionindexer');
            indexer.innerHTML = buttons_1;
            _this.node.menu.prepend(indexer);
            _this.node.indx = indexer;
            //	Prevent default behavior when clicking an anchor
            _this.node.indx.addEventListener('click', function (evnt) {
                var anchor = evnt.target;
                if (anchor.matches('a')) {
                    evnt.preventDefault();
                }
            });
            //	Scroll onMouseOver / onTouchStart
            var mouseOverEvent = function (evnt) {
                if (!evnt.target.matches('a')) {
                    return;
                }
                var letter = evnt.target.innerText, panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
                var newTop = -1, oldTop = panel.scrollTop;
                panel.scrollTop = 0;
                Mmenu.DOM.find(panel, '.mm-listitem_divider')
                    .filter(function (divider) { return !divider.matches('.mm-hidden'); })
                    .forEach(function (divider) {
                    if (newTop < 0 &&
                        letter == divider.innerText.trim().slice(0, 1).toLowerCase()) {
                        newTop = divider.offsetTop;
                    }
                });
                panel.scrollTop = newTop > -1 ? newTop : oldTop;
            };
            _this.node.indx.addEventListener('mouseover', mouseOverEvent);
            if (Mmenu.support.touch) {
                _this.node.indx.addEventListener('touchstart', mouseOverEvent);
            }
        }
        //	Show or hide the indexer
        function update(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            this.node.menu.classList[panel.matches('.mm-panel_has-sectionindexer') ? 'add' : 'remove']('mm-menu_has-sectionindexer');
        }
        ;
        _this.bind('openPanel:start', update);
        _this.bind('initPanels:after', update); // TODO panel argument is an array
    });
};
//	Default options and configuration.
Mmenu.options.sectionIndexer = {
    add: false,
    addTo: 'panels'
};
