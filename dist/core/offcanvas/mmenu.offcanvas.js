import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import { extend, transitionend, uniqueId, originalId, } from '../../_modules/helpers';
//  Add the options and configs.
Mmenu.options.offCanvas = options;
Mmenu.configs.offCanvas = configs;
export default function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = extendShorthandOptions(this.opts.offCanvas);
    this.opts.offCanvas = extend(options, Mmenu.options.offCanvas);
    var configs = this.conf.offCanvas;
    //	Add methods to the API.
    this._api.push('open', 'close', 'setPage');
    //	Setup the menu.
    this.vars.opened = false;
    //	Add off-canvas behavior.
    this.bind('initMenu:before', function () {
        //	Clone if needed.
        if (configs.clone) {
            //	Clone the original menu and store it.
            _this.node.menu = _this.node.menu.cloneNode(true);
            //	Prefix all ID's in the cloned menu.
            if (_this.node.menu.id) {
                _this.node.menu.id = 'mm-' + _this.node.menu.id;
            }
            DOM.find(_this.node.menu, '[id]').forEach(function (elem) {
                elem.id = 'mm-' + elem.id;
            });
        }
        _this.node.wrpr = document.body;
        //	Prepend to the <body>
        document
            .querySelector(configs.menu.insertSelector)[configs.menu.insertMethod](_this.node.menu);
    });
    this.bind('initMenu:after', function () {
        //	Setup the UI blocker.
        initBlocker.call(_this);
        //	Setup the page.
        _this.setPage(Mmenu.node.page);
        //	Setup window events.
        initWindow.call(_this);
        //	Setup the menu.
        _this.node.menu.classList.add('mm-menu--offcanvas');
        //	Open if url hash equals menu id (usefull when user clicks the hamburger icon before the menu is created)
        var hash = window.location.hash;
        if (hash) {
            var id = originalId(_this.node.menu.id);
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
            DOM.children(Mmenu.node.blck, 'a').forEach(function (anchor) {
                anchor.setAttribute('href', '#' + page.id);
            });
        }
    });
    //	Add screenreader / aria support
    this.bind('open:after:sr-aria', function () {
        sr.aria(_this.node.menu, 'hidden', false);
    });
    this.bind('close:after:sr-aria', function () {
        sr.aria(_this.node.menu, 'hidden', true);
    });
    this.bind('initMenu:after:sr-aria', function () {
        sr.aria(_this.node.menu, 'hidden', true);
    });
    //	Add screenreader / text support
    this.bind('initBlocker:after:sr-text', function () {
        DOM.children(Mmenu.node.blck, 'a').forEach(function (anchor) {
            anchor.innerHTML = sr.text(_this.i18n(_this.conf.screenReader.text.closeMenu));
        });
    });
    document.addEventListener('click', function (event) {
        var _a;
        /** THe href attribute for the clicked anchor. */
        var href = (_a = event.target.closest('a')) === null || _a === void 0 ? void 0 : _a.getAttribute('href');
        switch (href) {
            //	Open menu if the clicked anchor links to the menu.
            case "#" + originalId(_this.node.menu.id):
                event.preventDefault();
                _this.open();
                break;
            //	Close menu if the clicked anchor links to the page.
            case "#" + originalId(Mmenu.node.page.id):
                event.preventDefault();
                _this.close();
                break;
        }
    });
}
/**
 * Open the menu.
 */
Mmenu.prototype.open = function () {
    //	Invoke "before" hook.
    this.trigger('open:before');
    if (this.vars.opened) {
        return;
    }
    this.vars.opened = true;
    this._openSetup();
    this._openStart();
    //	Invoke "after" hook.
    this.trigger('open:after');
};
Mmenu.prototype._openSetup = function () {
    var _a;
    /** The off-canvas options. */
    var options = this.opts.offCanvas;
    var clsn = ['mm-wrapper--opened'];
    //	Add options
    if (options.blockUI) {
        clsn.push('mm-wrapper--blocking');
    }
    if (options.blockUI == 'modal') {
        clsn.push('mm-wrapper--modal');
    }
    (_a = this.node.wrpr.classList).add.apply(_a, clsn);
    //	Open
    this.node.menu.classList.add('mm-menu--opened');
};
/**
 * Finish opening the menu.
 */
Mmenu.prototype._openStart = function () {
    //	Opening
    this.node.wrpr.classList.add('mm-wrapper--opening');
};
Mmenu.prototype.close = function () {
    var _this = this;
    //	Invoke "before" hook.
    this.trigger('close:before');
    if (!this.vars.opened) {
        return;
    }
    //  TODO: transitionend er uit
    //	Callback when the page finishes closing.
    transitionend(Mmenu.node.page, function () {
        _this.node.menu.classList.remove('mm-menu--opened');
        _this.node.wrpr.classList.remove('mm-wrapper--opened', 'mm-wrapper--blocking', 'mm-wrapper--modal', 'mm-wrapper--background');
        _this.vars.opened = false;
    });
    this.node.wrpr.classList.remove('mm-wrapper--opening');
    //	Invoke "after" hook.
    this.trigger('close:after');
};
/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function (page) {
    //	Invoke "before" hook.
    this.trigger('setPage:before', [page]);
    var configs = this.conf.offCanvas;
    //	If no page was specified, find it.
    if (!page) {
        /** Array of elements that are / could be "the page". */
        var pages = typeof configs.page.selector == 'string'
            ? DOM.find(document.body, configs.page.selector)
            : DOM.children(document.body, configs.page.nodetype);
        //	Filter out elements that are absolutely not "the page".
        pages = pages.filter(function (page) { return !page.matches('.mm-menu, .mm-wrapper__blocker'); });
        //	Filter out elements that are configured to not be "the page".
        if (configs.page.noSelector.length) {
            pages = pages.filter(function (page) { return !page.matches(configs.page.noSelector.join(', ')); });
        }
        //	Wrap multiple pages in a single element.
        if (pages.length > 1) {
            var wrapper_1 = DOM.create('div');
            pages[0].before(wrapper_1);
            pages.forEach(function (page) {
                wrapper_1.append(page);
            });
            pages = [wrapper_1];
        }
        page = pages[0];
    }
    page.classList.add('mm-page');
    page.classList.add('mm-slideout');
    page.id = page.id || uniqueId();
    Mmenu.node.page = page;
    //	Invoke "after" hook.
    this.trigger('setPage:after', [page]);
};
/**
 * Initialize the window.
 */
var initWindow = function () {
    //	Prevent tabbing
    //	Because when tabbing outside the menu, the element that gains focus will be centered on the screen.
    //	In other words: The menu would move out of view.
    // events.off(document.body, 'keydown.tabguard');
    // events.on(document.body, 'keydown.tabguard', (evnt: KeyboardEvent) => {
    //     if (evnt.keyCode == 9) {
    //         if (this.node.wrpr.matches('.mm-wrapper--opened')) {
    //             evnt.preventDefault();
    //         }
    //     }
    // });
};
/**
 * Initialize "blocker" node
 */
var initBlocker = function () {
    var _this = this;
    //	Invoke "before" hook.
    this.trigger('initBlocker:before');
    var options = this.opts.offCanvas, configs = this.conf.offCanvas;
    if (!options.blockUI) {
        return;
    }
    //	Create the blocker node.
    if (!Mmenu.node.blck) {
        var blck = DOM.create('div.mm-wrapper__blocker.mm-slideout');
        blck.innerHTML = '<a></a>';
        //	Append the blocker node to the body.
        document.querySelector(configs.menu.insertSelector).append(blck);
        //	Store the blocker node.
        Mmenu.node.blck = blck;
    }
    //	Close the menu when
    //		1) clicking,
    //		2) touching or
    //		3) dragging the blocker node.
    var closeMenu = function (evnt) {
        evnt.preventDefault();
        evnt.stopPropagation();
        if (!_this.node.wrpr.matches('.mm-wrapper--modal')) {
            _this.close();
        }
    };
    Mmenu.node.blck.addEventListener('mousedown', closeMenu); // 1
    Mmenu.node.blck.addEventListener('touchstart', closeMenu); // 2
    Mmenu.node.blck.addEventListener('touchmove', closeMenu); // 3
    //	Invoke "after" hook.
    this.trigger('initBlocker:after');
};
