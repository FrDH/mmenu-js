Mmenu.addons.backButton = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var opts = this.opts.backButton;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            close: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    //opts = this.opts.backButton = jQuery.extend( true, {}, Mmenu.options.backButton, opts );
    this.opts.backButton = Mmenu.extend(opts, Mmenu.options.backButton);
    var _menu = '#' + this.node.menu.id;
    //	Close menu
    if (opts.close) {
        var states = [];
        function setStates() {
            states = [_menu];
            Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened, .mm-panel_opened-parent')
                .forEach(function (panel) {
                states.push('#' + panel.id);
            });
        }
        this.bind('open:finish', function () {
            history.pushState(null, document.title, _menu);
        });
        this.bind('open:finish', setStates);
        this.bind('openPanel:finish', setStates);
        this.bind('close:finish', function () {
            states = [];
            history.back();
            history.pushState(null, document.title, location.pathname + location.search);
        });
        window.addEventListener('popstate', function (evnt) {
            if (_this.vars.opened) {
                if (states.length) {
                    states = states.slice(0, -1);
                    var hash = states[states.length - 1];
                    if (hash == _menu) {
                        _this.close();
                    }
                    else {
                        _this.openPanel(_this.node.menu.querySelector(hash));
                        history.pushState(null, document.title, _menu);
                    }
                }
            }
        });
    }
    if (opts.open) {
        window.addEventListener('popstate', function (evnt) {
            if (!_this.vars.opened && location.hash == _menu) {
                _this.open();
            }
        });
    }
};
//	Default options and configuration.
Mmenu.options.backButton = {
    close: false,
    open: false
};
