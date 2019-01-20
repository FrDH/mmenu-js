Mmenu.addons.autoHeight = function () {
    var _this = this;
    var opts = this.opts.autoHeight;
    //	Extend shorthand options
    if (typeof opts == 'boolean' && opts) {
        opts = {
            height: 'auto'
        };
    }
    if (typeof opts == 'string') {
        opts = {
            height: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.autoHeight = Mmenu.extend(opts, Mmenu.options.autoHeight);
    if (opts.height != 'auto' && opts.height != 'highest') {
        return;
    }
    //	Add the autoheight class to the menu.
    this.bind('initMenu:after', function () {
        _this.node.menu.classList.add('mm-menu_autoheight');
    });
    //	Set the height.
    function setHeight(panel) {
        if (this.opts.offCanvas && !this.vars.opened) {
            return;
        }
        var style = window.getComputedStyle(this.node.pnls);
        var _top = Math.max(parseInt(style.top, 10), 0) || 0, _bot = Math.max(parseInt(style.bottom, 10), 0) || 0, _hgh = 0;
        this.node.menu.classList.add('mm-menu_autoheight-measuring');
        if (opts.height == 'auto') {
            if (!panel) {
                panel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            }
            if (panel) {
                var parent_1 = panel.parentElement;
                if (parent_1.matches('.mm-listitem_vertical')) {
                    panel = Mmenu.DOM.parents(panel, '.mm-panel')
                        .filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); })[0];
                }
            }
            if (!panel) {
                panel = Mmenu.DOM.children(this.node.pnls, '.mm-panel')[0];
            }
            _hgh = panel.offsetHeight;
        }
        else if (opts.height == 'highest') {
            Mmenu.DOM.children(this.node.pnls, '.mm-panel')
                .forEach(function (panel) {
                var parent = panel.parentElement;
                if (parent.matches('.mm-listitem_vertical')) {
                    panel = Mmenu.DOM.parents(panel, '.mm-panel')
                        .filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); })[0];
                }
                _hgh = Math.max(_hgh, panel.offsetHeight);
            });
        }
        this.node.menu.style.height = (_hgh + _top + _bot) + 'px';
        this.node.menu.classList.remove('mm-menu_autoheight-measuring');
    }
    ;
    if (this.opts.offCanvas) {
        this.bind('open:start', setHeight);
    }
    if (opts.height == 'highest') {
        this.bind('initPanels:after', setHeight); //	TODO: passes array for "panel" argument
    }
    if (opts.height == 'auto') {
        this.bind('updateListview', setHeight); //	TODO? does not pass "panel" argument
        this.bind('openPanel:start', setHeight);
        this.bind('closePanel', setHeight);
    }
};
//	Default options and configuration.
Mmenu.options.autoHeight = {
    height: 'default' // 'default/highest/auto'
};
