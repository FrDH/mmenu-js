Mmenu.addons.screenReader = function () {
    var _this = this;
    var opts = this.opts.screenReader, conf = this.conf.screenReader;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            aria: opts,
            text: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    //opts = this.opts.screenReader = jQuery.extend( true, {}, Mmenu.options.screenReader, opts );
    this.opts.screenReader = Mmenu.extend(opts, Mmenu.options.screenReader);
    //	Add Aria-* attributes
    if (opts.aria) {
        //	Add screenreader / aria hooks for add-ons
        //	In orde to keep this list short, only extend hooks that are actually used by other add-ons
        //	TODO: move to the specific add-on
        //	TODO arguments[ 0 ]?
        this.bind('initAddons:after', function () {
            _this.bind('initMenu:after', function () { this.trigger('initMenu:after:sr-aria', [].slice.call(arguments)); });
            _this.bind('initNavbar:after', function () { this.trigger('initNavbar:after:sr-aria', [].slice.call(arguments)); });
            _this.bind('openPanel:start', function () { this.trigger('openPanel:start:sr-aria', [].slice.call(arguments)); });
            _this.bind('close:start', function () { this.trigger('close:start:sr-aria', [].slice.call(arguments)); });
            _this.bind('close:finish', function () { this.trigger('close:finish:sr-aria', [].slice.call(arguments)); });
            _this.bind('open:start', function () { this.trigger('open:start:sr-aria', [].slice.call(arguments)); });
            _this.bind('initOpened:after', function () { this.trigger('initOpened:after:sr-aria', [].slice.call(arguments)); });
        });
        //	Update aria-hidden for hidden / visible listitems
        this.bind('updateListview', function () {
            _this.node.pnls.querySelectorAll('.mm-listitem')
                .forEach(function (listitem) {
                Mmenu.sr_aria(listitem, 'hidden', listitem.matches('.mm-hidden'));
            });
        });
        //	Update aria-hidden for the panels when opening and closing a panel.
        this.bind('openPanel:start', function (panel) {
            /** Panels that should be considered "hidden". */
            var hidden = Mmenu.DOM.find(_this.node.pnls, '.mm-panel')
                .filter(function (hide) { return hide !== panel; })
                .filter(function (hide) { return !hide.parentElement.matches('.mm-panel'); });
            /** Panels that should be considered "visible". */
            var visible = [panel];
            Mmenu.DOM.find(panel, '.mm-listitem_vertical .mm-listitem_opened')
                .forEach(function (listitem) {
                visible.push.apply(visible, Mmenu.DOM.children(listitem, '.mm-panel'));
            });
            //	Set the panels to be considered "hidden" or "visible".
            hidden.forEach(function (panel) {
                Mmenu.sr_aria(panel, 'hidden', true);
            });
            visible.forEach(function (panel) {
                Mmenu.sr_aria(panel, 'hidden', false);
            });
        });
        this.bind('closePanel', function (panel) {
            Mmenu.sr_aria(panel, 'hidden', true);
        });
        //	Add aria-haspopup and aria-owns to prev- and next buttons.
        this.bind('initPanels:after', function (panels) {
            panels.forEach(function (panel) {
                Mmenu.DOM.find(panel, '.mm-btn')
                    .forEach(function (button) {
                    Mmenu.sr_aria(button, 'owns', button.getAttribute('href').replace('#', ''));
                    Mmenu.sr_aria(button, 'haspopup', true);
                });
            });
        });
        //	Add aria-hidden for navbars in panels.
        this.bind('initNavbar:after', function (panel) {
            /** The navbar in the panel. */
            var navbar = Mmenu.DOM.children(panel, '.mm-navbar')[0];
            /** Whether or not the navbar should be considered "hidden". */
            var hidden = !panel.matches('.mm-panel_has-navbar');
            //	Set the navbar to be considered "hidden" or "visible".
            Mmenu.sr_aria(navbar, 'hidden', hidden);
        });
        //	Text
        if (opts.text) {
            //	Add aria-hidden to titles in navbars
            if (this.opts.navbar.titleLink == 'parent') {
                this.bind('initNavbar:after', function (panel) {
                    /** The navbar in the panel. */
                    var navbar = Mmenu.DOM.children(panel, '.mm-navbar')[0];
                    /** Whether or not the navbar should be considered "hidden". */
                    var hidden = navbar.querySelector('.mm-btn_prev') ? true : false;
                    //	Set the navbar-title to be considered "hidden" or "visible".
                    Mmenu.sr_aria(Mmenu.DOM.find(navbar, '.mm-navbar__title')[0], 'hidden', hidden);
                });
            }
        }
    }
    //	Add screenreader text
    if (opts.text) {
        //	Add screenreader / text hooks for add-ons
        //	In orde to keep this list short, only extend hooks that are actually used by other add-ons
        //	TODO: move to specific add-on
        this.bind('initAddons:after', function () {
            _this.bind('setPage:after', function () { this.trigger('setPage:after:sr-text', arguments[0]); });
            _this.bind('initBlocker:after', function () { this.trigger('initBlocker:after:sr-text'); });
        });
        //	Add text to the prev-buttons.
        this.bind('initNavbar:after', function (panel) {
            var navbar = Mmenu.DOM.children(panel, '.mm-navbar')[0];
            if (navbar) {
                var button = Mmenu.DOM.children(navbar, '.mm-btn_prev')[0];
                if (button) {
                    button.innerHTML = Mmenu.sr_text(_this.i18n(conf.text.closeSubmenu));
                }
            }
        });
        //	Add text to the next-buttons.
        this.bind('initListview:after', function (panel) {
            var parent = panel.mmParent;
            if (parent) {
                var next = Mmenu.DOM.children(parent, '.mm-btn_next')[0];
                if (next) {
                    var text = _this.i18n(conf.text[next.parentElement.matches('.mm-listitem_vertical') ? 'toggleSubmenu' : 'openSubmenu']);
                    next.innerHTML += Mmenu.sr_text(text);
                }
            }
        });
    }
};
//	Default options and configuration.
Mmenu.options.screenReader = {
    aria: true,
    text: true
};
Mmenu.configs.screenReader = {
    text: {
        closeMenu: 'Close menu',
        closeSubmenu: 'Close submenu',
        openSubmenu: 'Open submenu',
        toggleSubmenu: 'Toggle submenu'
    }
};
//	Methods
(function () {
    var attr = function (element, attr, value) {
        element[attr] = value;
        if (value) {
            element.setAttribute(attr, value.toString());
        }
        else {
            element.removeAttribute(attr);
        }
    };
    /**
     * Add aria (property and) attribute to a HTML element.
     *
     * @param {HTMLElement} 	element	The node to add the attribute to.
     * @param {string}			name	The (non-aria-prefixed) attribute name.
     * @param {string|boolean}	value	The attribute value.
     */
    Mmenu.sr_aria = function (element, name, value) {
        attr(element, 'aria-' + name, value);
    };
    /**
     * Add role attribute to a HTML element.
     *
     * @param {HTMLElement}		element	The node to add the attribute to.
     * @param {string|boolean}	value	The attribute value.
     */
    Mmenu.sr_role = function (element, value) {
        attr(element, 'role', value);
    };
    /**
     * Wrap a text in a screen-reader-only node.
     *
     * @param 	{string} text	The text to wrap.
     * @return	{string}		The wrapped text.
     */
    Mmenu.sr_text = function (text) {
        return '<span class="mm-sronly">' + text + '</span>';
    };
})();
