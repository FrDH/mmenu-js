Mmenu.addons.offCanvas = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var opts = this.opts.offCanvas, conf = this.conf.offCanvas;
    //	Add methods to the API
    this._api.push('open', 'close', 'setPage');
    //	Extend shorthand options
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.offCanvas = Mmenu.extend(opts, Mmenu.options.offCanvas);
    this.conf.offCanvas = Mmenu.extend(conf, Mmenu.configs.offCanvas);
    //	Setup the menu
    this.vars.opened = false;
    //	Add off-canvas behavior
    this.bind('initMenu:after', function () {
        //	Setup the UI blocker
        _this._initBlocker();
        //	Setup the page
        _this.setPage(Mmenu.node.page);
        //	Setup window events
        _this._initWindow_offCanvas();
        //	Setup the menu
        _this.node.menu.classList.add('mm-menu_offcanvas');
        _this.node.menu.parentElement.classList.remove('mm-wrapper');
        //	Append to the <body>
        document.querySelector(conf.menu.insertSelector)[conf.menu.insertMethod](_this.node.menu);
        //	Open if url hash equals menu id (usefull when user clicks the hamburger icon before the menu is created)
        var hash = window.location.hash;
        if (hash) {
            var id = _this.vars.orgMenuId;
            if (id && id == hash.slice(1)) {
                setTimeout(function () {
                    _this.open();
                }, 1000);
            }
        }
    });
    //	Sync the blocker to target the page.
    this.bind('setPage:after', function (page) {
        if (Mmenu.node.blck) {
            Mmenu.DOM.children(Mmenu.node.blck, 'a')
                .forEach(function (anchor) {
                anchor.setAttribute('href', '#' + page.id);
            });
        }
    });
    //	Add screenreader / aria support
    this.bind('open:start:sr-aria', function () {
        Mmenu.sr_aria(_this.node.menu, 'hidden', false);
    });
    this.bind('close:finish:sr-aria', function () {
        Mmenu.sr_aria(_this.node.menu, 'hidden', true);
    });
    this.bind('initMenu:after:sr-aria', function () {
        Mmenu.sr_aria(_this.node.menu, 'hidden', true);
    });
    //	Add screenreader / text support
    this.bind('initBlocker:after:sr-text', function () {
        Mmenu.DOM.children(Mmenu.node.blck, 'a')
            .forEach(function (anchor) {
            anchor.innerHTML = Mmenu.sr_text(_this.i18n(_this.conf.screenReader.text.closeMenu));
        });
    });
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor
    this.clck.push(function (anchor, args) {
        //	Open menu if the clicked anchor links to the menu
        var id = _this.vars.orgMenuId;
        if (id) {
            if (anchor.matches('[href="#' + id + '"]')) {
                //	Opening this menu from within this menu
                //		-> Open menu
                if (args.inMenu) {
                    _this.open();
                    return true;
                }
                //	Opening this menu from within a second menu
                //		-> Close the second menu before opening this menu
                var menu = anchor.closest('.mm-menu');
                if (menu) {
                    var api = menu.mmenu;
                    if (api && api.close) {
                        api.close();
                        Mmenu.transitionend(menu, function () {
                            _this.open();
                        }, _this.conf.transitionDuration);
                        return true;
                    }
                }
                //	Opening this menu
                _this.open();
                return true;
            }
        }
        //	Close menu
        id = Mmenu.node.page.id;
        if (id) {
            if (anchor.matches('[href="#' + id + '"]')) {
                _this.close();
                return true;
            }
        }
        return;
    });
};
//	Default options and configuration.
Mmenu.options.offCanvas = {
    blockUI: true,
    moveBackground: true
};
Mmenu.configs.offCanvas = {
    menu: {
        insertMethod: 'prepend',
        insertSelector: 'body'
    },
    page: {
        nodetype: 'div',
        selector: null,
        noSelector: []
    }
};
/**
 * Open the menu.
 */
Mmenu.prototype.open = function () {
    var _this = this;
    this.trigger('open:before');
    if (this.vars.opened) {
        return;
    }
    this._openSetup();
    //	Without the timeout, the animation won't work because the menu had display: none;
    setTimeout(function () {
        _this._openFinish();
    }, this.conf.openingInterval);
    this.trigger('open:after');
};
/**
 * Setup the menu so it can be opened.
 */
Mmenu.prototype._openSetup = function () {
    var _this = this;
    var _a;
    var opts = this.opts.offCanvas;
    //	Close other menus
    this.closeAllOthers();
    //	Store style and position
    Mmenu.node.page.mmStyle = Mmenu.node.page.getAttribute('style') || '';
    //	Trigger window-resize to measure height
    Mmenu.$(window).trigger('resize.mm-offCanvas', [true]);
    var clsn = ['mm-wrapper_opened'];
    //	Add options
    if (opts.blockUI) {
        clsn.push('mm-wrapper_blocking');
    }
    if (opts.blockUI == 'modal') {
        clsn.push('mm-wrapper_modal');
    }
    if (opts.moveBackground) {
        clsn.push('mm-wrapper_background');
    }
    (_a = document.querySelector('html').classList).add.apply(_a, clsn);
    //	Open
    //	Without the timeout, the animation won't work because the menu had display: none;
    setTimeout(function () {
        _this.vars.opened = true;
    }, this.conf.openingInterval);
    this.node.menu.classList.add('mm-menu_opened');
};
/**
 * Finish opening the menu.
 */
Mmenu.prototype._openFinish = function () {
    var _this = this;
    //	Callback when the page finishes opening.
    Mmenu.transitionend(Mmenu.node.page, function () {
        _this.trigger('open:finish');
    }, this.conf.transitionDuration);
    //	Opening
    this.trigger('open:start');
    document.querySelector('html').classList.add('mm-wrapper_opening');
};
/**
 * Close the menu.
 */
Mmenu.prototype.close = function () {
    var _this = this;
    this.trigger('close:before');
    if (!this.vars.opened) {
        return;
    }
    //	Callback when the page finishes closing.
    Mmenu.transitionend(Mmenu.node.page, function () {
        var _a;
        _this.node.menu.classList.remove('mm-menu_opened');
        var clsn = [
            'mm-wrapper_opened',
            'mm-wrapper_blocking',
            'mm-wrapper_modal',
            'mm-wrapper_background'
        ];
        (_a = document.querySelector('html').classList).remove.apply(_a, clsn);
        //	Restore style and position
        Mmenu.node.page.setAttribute('style', Mmenu.node.page.mmStyle);
        _this.vars.opened = false;
        _this.trigger('close:finish');
    }, this.conf.transitionDuration);
    //	Closing
    this.trigger('close:start');
    document.querySelector('html').classList.remove('mm-wrapper_opening');
    this.trigger('close:after');
};
/**
 * Close all other menus.
 */
Mmenu.prototype.closeAllOthers = function () {
    var _this = this;
    Mmenu.DOM.find(document.body, '.mm-menu_offcanvas')
        .forEach(function (menu) {
        if (menu !== _this.node.menu) {
            var api = menu.mmenu;
            if (api && api.close) {
                api.close();
            }
        }
    });
};
/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function (page) {
    this.trigger('setPage:before', [page]);
    var conf = this.conf.offCanvas;
    //	If no page was specified, find it.
    if (!page) {
        /** Array of elements that are / could be "the page". */
        var pages = (typeof conf.page.selector == 'string')
            ? Mmenu.DOM.find(document.body, conf.page.selector)
            : Mmenu.DOM.children(document.body, conf.page.nodetype);
        //	Filter out elements that are absolutely not "the page".
        pages = pages.filter(function (page) { return !page.matches('.mm-menu, .mm-wrapper__blocker'); });
        //	Filter out elements that are configured to not be "the page".
        if (conf.page.noSelector.length) {
            pages = pages.filter(function (page) { return !page.matches(conf.page.noSelector.join(', ')); });
        }
        //	Wrap multiple pages in a single element.
        if (pages.length > 1) {
            pages = [Mmenu.$(pages)
                    .wrapAll('<' + conf.page.nodetype + ' />')
                    .parent()[0]];
        }
        page = pages[0];
    }
    page.classList.add('mm-page', 'mm-slideout');
    page.id = page.id || Mmenu.getUniqueId();
    Mmenu.node.page = page;
    this.trigger('setPage:after', [page]);
};
/**
 * Initialize the <window>
 */
Mmenu.prototype._initWindow_offCanvas = function () {
    //	Prevent tabbing
    //	Because when tabbing outside the menu, the element that gains focus will be centered on the screen.
    //	In other words: The menu would move out of view.
    //	TODO event opslaan zodat het weer verwijderd kan worden met removeListener en direct aangeroepen ipv trigger()
    Mmenu.$(window)
        .off('keydown.mm-offCanvas')
        .on('keydown.mm--offCanvas', function (e) {
        if (document.documentElement.matches('.mm-wrapper_opened')) {
            if (e.keyCode == 9) {
                e.preventDefault();
                return false;
            }
        }
    });
    //	Set "page" node min-height to window height
    var oldHeight, newHeight;
    //	TODO event opslaan zodat het weer verwijderd kan worden met removeListener en direct aangeroepen ipv trigger()
    Mmenu.$(window)
        .off('resize.mm-offCanvas')
        .on('resize.mm-offCanvas', function (evnt, force) {
        //	if ( Mmenu.node.page.length == 1 )
        {
            if (force || document.documentElement.matches('.mm-wrapper_opened')) {
                newHeight = window.innerHeight;
                if (force || newHeight != oldHeight) {
                    oldHeight = newHeight;
                    Mmenu.node.page.style.minHeight = newHeight + 'px';
                }
            }
        }
    });
};
/**
 * Initialize "blocker" node
 */
Mmenu.prototype._initBlocker = function () {
    var _this = this;
    var opts = this.opts.offCanvas, conf = this.conf.offCanvas;
    this.trigger('initBlocker:before');
    if (!opts.blockUI) {
        return;
    }
    if (!Mmenu.node.blck) {
        var blck = Mmenu.DOM.create('div.mm-wrapper__blocker.mm-slideout');
        blck.innerHTML = '<a></a>';
        Mmenu.node.blck = blck;
    }
    document.querySelector(conf.menu.insertSelector)
        .append(Mmenu.node.blck);
    Mmenu.$(Mmenu.node.blck)
        .off('touchstart.mm-offCanvas touchmove.mm-offCanvas')
        .on('touchstart.mm-offCanvas touchmove.mm-offCanvas', function (evnt) {
        evnt.preventDefault();
        evnt.stopPropagation();
        Mmenu.node.blck.dispatchEvent(new Event('mousedown'));
    })
        .off('mousedown.mm-offCanvas')
        .on('mousedown.mm-offCanvas', function (evnt) {
        evnt.preventDefault();
        if (!document.documentElement.matches('.mm-wrapper_modal')) {
            _this.closeAllOthers();
            _this.close();
        }
    });
    this.trigger('initBlocker:after');
};
