import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import { extend, uniqueId, originalId, } from '../../_modules/helpers';
//  Add the options and configs.
Mmenu.options.offCanvas = options;
Mmenu.configs.offCanvas = configs;
export default function () {
    var _this = this;
    var options = this.opts.offCanvas;
    var configs = this.conf.offCanvas;
    this.opts.searchfield = extend(options, Mmenu.options.searchfield);
    if (!options.use) {
        return;
    }
    //	Add methods to the API.
    this._api.push('open', 'close', 'setPage');
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
        document.querySelector(configs.menu.insertSelector)[configs.menu.insertMethod](_this.node.menu);
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
    //	Add screenreader / aria support
    this.bind('initMenu:after', function () {
        sr.aria(_this.node.menu, 'hidden', true);
        sr.aria(Mmenu.node.blck, 'hidden', true);
    });
    this.bind('open:after', function () {
        sr.aria(_this.node.menu, 'hidden', false);
        sr.aria(Mmenu.node.blck, 'hidden', false);
    });
    this.bind('close:after', function () {
        sr.aria(_this.node.menu, 'hidden', true);
        sr.aria(Mmenu.node.blck, 'hidden', true);
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
    var _a;
    if (this.node.menu.matches('.mm-menu--opened')) {
        return;
    }
    //	Invoke "before" hook.
    this.trigger('open:before');
    var clsn = ['mm-wrapper--opened'];
    (_a = this.node.wrpr.classList).add.apply(_a, clsn);
    //	Open
    this.node.menu.classList.add('mm-menu--opened');
    this.node.wrpr.classList.add('mm-wrapper--opened');
    //	Invoke "after" hook.
    this.trigger('open:after');
};
Mmenu.prototype.close = function () {
    if (!this.node.menu.matches('.mm-menu--opened')) {
        return;
    }
    //	Invoke "before" hook.
    this.trigger('close:before');
    this.node.menu.classList.remove('mm-menu--opened');
    this.node.wrpr.classList.remove('mm-wrapper--opened');
    //	Invoke "after" hook.
    this.trigger('close:after');
};
/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function (page) {
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
    //	Invoke "before" hook.
    this.trigger('setPage:before', [page]);
    page.classList.add('mm-page', 'mm-slideout');
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
    var configs = this.conf.offCanvas;
    //	Invoke "before" hook.
    this.trigger('initBlocker:before');
    //	Create the blocker node.
    if (!Mmenu.node.blck) {
        var blck = DOM.create('div.mm-wrapper__blocker.mm-slideout');
        blck.innerHTML = "<a>" + sr.text(this.i18n(this.conf.screenReader.text.closeMenu)) + "</a>";
        //	Append the blocker node to the body.
        document.querySelector(configs.menu.insertSelector).append(blck);
        //	Store the blocker node.
        Mmenu.node.blck = blck;
    }
    //	Sync the blocker to target the page.
    this.bind('setPage:after', function (page) {
        DOM.children(Mmenu.node.blck, 'a').forEach(function (anchor) {
            anchor.setAttribute('href', '#' + page.id);
        });
    });
    //	Invoke "after" hook.
    this.trigger('initBlocker:after');
};
