Mmenu.addons.iconbar = function () {
    var _this = this;
    var opts = this.opts.iconbar;
    //	Extend shorthand options
    if (Mmenu.typeof(opts) == 'array') {
        opts = {
            add: true,
            top: opts
        };
    }
    //	/Extend shorthand options
    if (!opts.add) {
        return;
    }
    var iconbar;
    ['top', 'bottom'].forEach(function (position, n) {
        var ctnt = opts[position];
        //	Extend shorthand options
        if (Mmenu.typeof(ctnt) != 'array') {
            ctnt = [ctnt];
        }
        //	Create node
        var ibar = Mmenu.DOM.create('div.mm-iconbar__' + position);
        //	Add content
        for (var c = 0, l = ctnt.length; c < l; c++) {
            if (typeof ctnt[c] == 'string') {
                ibar.innerHTML += ctnt[c];
            }
            else {
                ibar.append(ctnt[c]);
            }
        }
        if (ibar.children.length) {
            if (!iconbar) {
                iconbar = Mmenu.DOM.create('div.mm-iconbar');
            }
            iconbar.append(ibar);
        }
    });
    //	Add to menu
    if (iconbar) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_iconbar');
            _this.node.menu.prepend(iconbar);
        });
        //	Tabs
        if (opts.type == 'tabs') {
            iconbar.classList.add('mm-iconbar_tabs');
            iconbar.addEventListener('click', function (evnt) {
                var anchor = evnt.target;
                if (!anchor.matches('a')) {
                    return;
                }
                if (anchor.matches('.mm-iconbar__tab_selected')) {
                    evnt.stopImmediatePropagation();
                    return;
                }
                try {
                    var panel = _this.node.menu.querySelector(anchor.getAttribute('href'))[0];
                    if (panel && panel.matches('.mm-panel')) {
                        evnt.preventDefault();
                        evnt.stopImmediatePropagation();
                        _this.openPanel(panel, false);
                    }
                }
                catch (err) { }
            });
            function selectTab(panel) {
                Mmenu.DOM.find(iconbar, 'a')
                    .forEach(function (anchor) {
                    anchor.classList.remove('mm-iconbar__tab_selected');
                });
                var anchor = Mmenu.DOM.find(iconbar, '[href="#' + panel.id + '"]')[0];
                if (anchor) {
                    anchor.classList.add('mm-iconbar__tab_selected');
                }
                else {
                    var parent_1 = panel['mmParent'];
                    if (parent_1) {
                        selectTab.call(this, parent_1.closest('.mm-panel'));
                    }
                }
            }
            this.bind('openPanel:start', selectTab);
        }
    }
};
//	Default options and configuration.
Mmenu.options.iconbar = {
    add: false,
    top: [],
    bottom: [],
    type: 'default'
};
