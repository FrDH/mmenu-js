Mmenu.addons.lazySubmenus = function () {
    var _this = this;
    var opts = this.opts.lazySubmenus;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            load: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    // opts = this.opts.lazySubmenus = jQuery.extend( true, {}, Mmenu.options.lazySubmenus, opts );
    this.opts.lazySubmenus = Mmenu.extend(opts, Mmenu.options.lazySubmenus);
    //	Sliding submenus
    if (opts.load) {
        //	prevent all sub panels from initPanels
        this.bind('initMenu:after', function () {
            var panels = [];
            //	Find all potential subpanels
            Mmenu.DOM.find(_this.node.pnls, 'li')
                .forEach(function (listitem) {
                panels.push.apply(panels, Mmenu.DOM.children(listitem, _this.conf.panelNodetype.join(', ')));
            });
            //	Filter out all non-panels and add the lazyload classes
            panels.filter(function (panel) { return !panel.matches('.mm-listview_inset'); })
                .filter(function (panel) { return !panel.matches('.mm-nolistview'); })
                .filter(function (panel) { return !panel.matches('.mm-nopanel'); })
                .forEach(function (panel) {
                panel.classList.add('mm-panel_lazysubmenu', 'mm-nolistview', 'mm-nopanel');
            });
        });
        //	prepare current and one level sub panels for initPanels
        this.bind('initPanels:before', function (panels) {
            panels = panels || Mmenu.DOM.children(_this.node.pnls, _this.conf.panelNodetype.join(', '));
            panels.forEach(function (panel) {
                var filter = '.mm-panel_lazysubmenu', panels = Mmenu.DOM.find(panel, filter);
                if (panel.matches(filter)) {
                    panels.unshift(panel);
                }
                panels.filter(function (panel) { return !panel.matches('.mm-panel_lazysubmenu .mm-panel_lazysubmenu'); })
                    .forEach(function (panel) {
                    panel.classList.remove('mm-panel_lazysubmenu', 'mm-nolistview', 'mm-nopanel');
                });
            });
        });
        //	initPanels for the default opened panel
        this.bind('initOpened:before', function () {
            var panels = [];
            Mmenu.DOM.find(_this.node.pnls, '.' + _this.conf.classNames.selected)
                .forEach(function (listitem) {
                panels.push.apply(panels, Mmenu.DOM.parents(listitem, '.mm-panel_lazysubmenu'));
            });
            if (panels.length) {
                panels.forEach(function (panel) {
                    panel.classList.remove('mm-panel_lazysubmenu', 'mm-nolistview mm-nopanel');
                });
                _this.initPanels([panels[panels.length - 1]]);
            }
        });
        //	initPanels for current- and sub panels before openPanel
        this.bind('openPanel:before', function (panel) {
            var filter = '.mm-panel_lazysubmenu', panels = Mmenu.DOM.find(panel, filter);
            if (panel.matches(filter)) {
                panels.unshift(panel);
            }
            panels = panels.filter(function (panel) { return !panel.matches('.mm-panel_lazysubmenu .mm-panel_lazysubmenu'); });
            if (panels.length) {
                _this.initPanels(panels);
            }
        });
    }
};
//	Default options and configuration.
Mmenu.options.lazySubmenus = {
    load: false
};
