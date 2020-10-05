import * as pack from '../../../package.json';
import options from './_options';
import configs from './_configs';
import translate from './translations/translate';
import * as DOM from '../../_modules/dom';
import * as i18n from '../../_modules/i18n';
import * as media from '../../_modules/matchmedia';
import { type, extend, transitionend, uniqueId, valueOrFn, } from '../../_modules/helpers';
//  Add the translations.
translate();
/**
 * Class for a mobile menu.
 */
var Mmenu = /** @class */ (function () {
    /**
     * Create a mobile menu.
     * @param {HTMLElement|string} 	menu						The menu node.
     * @param {object} 				[options=Mmenu.options]		Options for the menu.
     * @param {object} 				[configs=Mmenu.configs]		Configuration options for the menu.
     */
    function Mmenu(menu, options, configs) {
        //	Extend options and configuration from defaults.
        this.opts = extend(options, Mmenu.options);
        this.conf = extend(configs, Mmenu.configs);
        //	Methods to expose in the API.
        this._api = [
            'bind',
            'openPanel',
            'closePanel',
            'closeAllPanels',
            'setSelected',
        ];
        //	Storage objects for nodes, variables, hooks and click handlers.
        this.node = {};
        this.vars = {};
        this.hook = {};
        this.clck = [];
        //	Get menu node from string or element.
        this.node.menu =
            typeof menu == 'string' ? document.querySelector(menu) : menu;
        if (typeof this._deprecatedWarnings == 'function') {
            this._deprecatedWarnings();
        }
        this._initObservers();
        this._initWrappers();
        this._initAddons();
        this._initExtensions();
        this._initHooks();
        this._initAPI();
        this._initMenu();
        this._initPanels();
        this._initOpened();
        this._initAnchors();
        media.watch();
        return this;
    }
    /**
     * Open a panel.
     * @param {HTMLElement} panel               Panel to open.
     * @param {boolean}     [animation=true]    Whether or not to use an animation.
     */
    Mmenu.prototype.openPanel = function (panel, animation) {
        if (animation === void 0) { animation = true; }
        //	Find panel.
        if (!panel) {
            return;
        }
        if (!panel.matches('.mm-panel')) {
            panel = panel.closest('.mm-panel');
        }
        //	Invoke "before" hook.
        this.trigger('openPanel:before', [panel]);
        //	Open a "vertical" panel.
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            panel.parentElement.classList.add('mm-listitem_opened');
            //	Open a "horizontal" panel.
        }
        else {
            var closeCurrent = panel.matches('.mm-panel_opened-parent');
            var current_1 = DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            panel.classList.add('mm-panel_opened');
            if (!animation) {
                panel.classList.add('mm-panel_noanimation');
            }
            if (closeCurrent) {
                panel.classList.remove('mm-panel_opened-parent');
            }
            else {
                panel.classList.add('mm-panel_highest');
            }
            transitionend(panel, function () {
                panel.classList.remove('mm-panel_noanimation', 'mm-panel_highest');
            });
            if (current_1) {
                if (!animation) {
                    current_1.classList.add('mm-panel_noanimation');
                }
                current_1.classList.remove('mm-panel_opened');
                if (closeCurrent) {
                    current_1.classList.add('mm-panel_highest');
                }
                else {
                    current_1.classList.add('mm-panel_opened-parent');
                }
                transitionend(current_1, function () {
                    current_1.classList.remove('mm-panel_noanimation', 'mm-panel_highest');
                });
            }
        }
        //	Invoke "after" hook.
        this.trigger('openPanel:after', [panel]);
    };
    /**
     * Close a panel.
     * @param {HTMLElement} panel Panel to close.
     */
    Mmenu.prototype.closePanel = function (panel) {
        //	Invoke "before" hook.
        this.trigger('closePanel:before', [panel]);
        //	Close a "vertical" panel.
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            panel.parentElement.classList.remove('mm-listitem_opened');
            //  Close a "horizontal" panel.
        }
        else {
            if (panel.dataset.mmParent) {
                var parent_1 = DOM.find(this.node.pnls, '#' + panel.dataset.mmParent)[0];
                this.openPanel(parent_1);
            }
        }
        //	Invoke "after" hook.
        this.trigger('closePanel:after', [panel]);
    };
    /**
     * Toggle a panel opened/closed.
     * @param {HTMLElement} panel Panel to open or close.
     */
    Mmenu.prototype.togglePanel = function (panel) {
        var listitem = panel.parentElement;
        //	Only works for "vertical" panels.
        if (listitem.matches('.mm-listitem_vertical')) {
            this[listitem.matches('.mm-listitem_opened')
                ? 'closePanel'
                : 'openPanel'](panel);
        }
    };
    /**
     * Display a listitem as being "selected".
     * @param {HTMLElement} listitem Listitem to mark.
     */
    Mmenu.prototype.setSelected = function (listitem) {
        //	Invoke "before" hook.
        this.trigger('setSelected:before', [listitem]);
        //	First, remove the selected class from all listitems.
        DOM.find(this.node.menu, '.mm-listitem_selected').forEach(function (li) {
            li.classList.remove('mm-listitem_selected');
        });
        //	Next, add the selected class to the provided listitem.
        listitem.classList.add('mm-listitem_selected');
        //	Invoke "after" hook.
        this.trigger('setSelected:after', [listitem]);
    };
    /**
     * Bind functions to a hook (subscriber).
     * @param {string} 		hook The hook.
     * @param {function} 	func The function.
     */
    Mmenu.prototype.bind = function (hook, func) {
        //	Create an array for the hook if it does not yet excist.
        this.hook[hook] = this.hook[hook] || [];
        //	Push the function to the array.
        this.hook[hook].push(func);
    };
    /**
     * Invoke the functions bound to a hook (publisher).
     * @param {string} 	hook  	The hook.
     * @param {array}	[args] 	Arguments for the function.
     */
    Mmenu.prototype.trigger = function (hook, args) {
        if (this.hook[hook]) {
            for (var h = 0, l = this.hook[hook].length; h < l; h++) {
                this.hook[hook][h].apply(this, args);
            }
        }
    };
    Mmenu.prototype._initObservers = function () {
        var _this = this;
        this.panelObserver = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (listview) {
                    if (listview.matches(_this.conf.panelNodetype.join(', '))) {
                        _this._initListview(listview);
                    }
                });
            });
        });
        this.listviewObserver = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (listitem) {
                    _this._initListitem(listitem);
                });
            });
        });
        this.listitemObserver = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (listview) {
                    if (listview.matches(_this.conf.panelNodetype.join(', '))) {
                        _this._initSubPanel(listview);
                    }
                });
            });
        });
    };
    /**
     * Create the API.
     */
    Mmenu.prototype._initAPI = function () {
        var _this = this;
        //	We need this=that because:
        //	1) the "arguments" object can not be referenced in an arrow function in ES3 and ES5.
        var that = this;
        this.API = {};
        this._api.forEach(function (fn) {
            _this.API[fn] = function () {
                var re = that[fn].apply(that, arguments); // 1)
                return typeof re == 'undefined' ? that.API : re;
            };
        });
        //	Store the API in the HTML node for external usage.
        this.node.menu['mmApi'] = this.API;
    };
    /**
     * Bind the hooks specified in the options (publisher).
     */
    Mmenu.prototype._initHooks = function () {
        for (var hook in this.opts.hooks) {
            this.bind(hook, this.opts.hooks[hook]);
        }
    };
    /**
     * Initialize the wrappers specified in the options.
     */
    Mmenu.prototype._initWrappers = function () {
        //	Invoke "before" hook.
        this.trigger('initWrappers:before');
        for (var w = 0; w < this.opts.wrappers.length; w++) {
            var wrpr = Mmenu.wrappers[this.opts.wrappers[w]];
            if (typeof wrpr == 'function') {
                wrpr.call(this);
            }
        }
        //	Invoke "after" hook.
        this.trigger('initWrappers:after');
    };
    /**
     * Initialize all available add-ons.
     */
    Mmenu.prototype._initAddons = function () {
        //	Invoke "before" hook.
        this.trigger('initAddons:before');
        for (var addon in Mmenu.addons) {
            Mmenu.addons[addon].call(this);
        }
        //	Invoke "after" hook.
        this.trigger('initAddons:after');
    };
    /**
     * Initialize the extensions specified in the options.
     */
    Mmenu.prototype._initExtensions = function () {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initExtensions:before');
        //	Convert array to object with array.
        if (type(this.opts.extensions) == 'array') {
            this.opts.extensions = {
                all: this.opts.extensions,
            };
        }
        //	Loop over object.
        Object.keys(this.opts.extensions).forEach(function (query) {
            var classnames = _this.opts.extensions[query].map(function (extension) { return 'mm-menu_' + extension; });
            if (classnames.length) {
                media.add(query, function () {
                    var _a;
                    (_a = _this.node.menu.classList).add.apply(_a, classnames);
                }, function () {
                    var _a;
                    (_a = _this.node.menu.classList).remove.apply(_a, classnames);
                });
            }
        });
        //	Invoke "after" hook.
        this.trigger('initExtensions:after');
    };
    /**
     * Initialize the menu.
     */
    Mmenu.prototype._initMenu = function () {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initMenu:before');
        //	Add class to the wrapper.
        this.node.wrpr = this.node.wrpr || this.node.menu.parentElement;
        this.node.wrpr.classList.add('mm-wrapper');
        //	Add class to the menu.
        this.node.menu.classList.add('mm-menu');
        //	Add an ID to the menu if it does not yet have one.
        this.node.menu.id = this.node.menu.id || uniqueId();
        //  All nodes in the menu.
        var panels = DOM.children(this.node.menu).filter(function (panel) {
            return panel.matches(_this.conf.panelNodetype.join(', '));
        });
        //	Wrap the panels in a node.
        this.node.pnls = DOM.create('div.mm-panels');
        this.node.menu.append(this.node.pnls);
        //  Initiate all panel like nodes
        panels.forEach(function (panel) {
            _this._initPanel(panel);
        });
        //	Invoke "after" hook.
        this.trigger('initMenu:after');
    };
    /**
     * Initialize panels.
     */
    Mmenu.prototype._initPanels = function () {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initPanels:before');
        //	Open / close panels.
        this.clck.push(function (anchor, args) {
            if (args.inMenu) {
                var href = anchor.getAttribute('href');
                if (href && href.length > 1 && href.slice(0, 1) == '#') {
                    try {
                        var panel = DOM.find(_this.node.menu, href)[0];
                        if (panel && panel.matches('.mm-panel')) {
                            if (anchor.parentElement.matches('.mm-listitem_vertical')) {
                                _this.togglePanel(panel);
                            }
                            else {
                                _this.openPanel(panel);
                            }
                            return true;
                        }
                    }
                    catch (err) { }
                }
            }
        });
        //	Invoke "after" hook.
        this.trigger('initPanels:after');
    };
    /**
     * Initialize a single panel.
     * @param  {HTMLElement} 		panel 	Panel to initialize.
     * @return {HTMLElement|null} 			Initialized panel.
     */
    Mmenu.prototype._initPanel = function (panel) {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initPanel:before', [panel]);
        if (panel.matches('.mm-panel')) {
            return null;
        }
        //	Refactor panel classnames
        DOM.reClass(panel, this.conf.classNames.panel, 'mm-panel');
        DOM.reClass(panel, this.conf.classNames.nopanel, 'mm-nopanel');
        DOM.reClass(panel, this.conf.classNames.inset, 'mm-listview_inset');
        if (panel.matches('.mm-listview_inset')) {
            panel.classList.add('mm-nopanel');
        }
        //	Stop if not supposed to be a panel.
        if (panel.matches('.mm-nopanel')) {
            return null;
        }
        //  Must have an ID
        panel.id = panel.id || uniqueId();
        //	Wrap UL/OL in DIV
        if (panel.matches('ul, ol')) {
            /** The panel. */
            var wrapper_1 = DOM.create('div');
            //  Transport the ID
            wrapper_1.id = panel.id;
            panel.removeAttribute('id');
            //  Transport the "mm-" prefixed classnames
            Array.prototype.slice
                .call(panel.classList)
                .filter(function (classname) { return classname.slice(0, 3) == 'mm-'; })
                .forEach(function (classname) {
                panel.classList.remove(classname);
                wrapper_1.classList.add(classname);
            });
            //  Transport the parent relation
            if (panel.dataset.mmParent) {
                wrapper_1.dataset.mmParent = panel.dataset.mmParent;
                delete panel.dataset.mmParent;
            }
            //	Wrap the listview in the panel.
            panel.before(wrapper_1);
            wrapper_1.append(panel);
            panel = wrapper_1;
        }
        panel.classList.add('mm-panel');
        //  Append to the panels node if not vertically expanding
        if (!panel.parentElement.matches('.mm-listitem_vertical')) {
            this.node.pnls.append(panel);
        }
        //  Initialize tha navbar.
        this._initNavbar(panel);
        //  Initialize the listview(s).
        DOM.children(panel, 'ul, ol').forEach(function (listview) {
            _this._initListview(listview);
        });
        // Observe the panel for added listviews.
        this.panelObserver.observe(panel, {
            childList: true,
        });
        //	Invoke "after" hook.
        this.trigger('initPanel:after', [panel]);
        return panel;
    };
    /**
     * Initialize a navbar.
     * @param {HTMLElement} panel Panel for the navbar.
     */
    Mmenu.prototype._initNavbar = function (panel) {
        //	Invoke "before" hook.
        this.trigger('initNavbar:before', [panel]);
        //	Only one navbar per panel.
        if (DOM.children(panel, '.mm-navbar').length) {
            return;
        }
        /** The parent listitem. */
        var parentListitem = null;
        /** The parent panel. */
        var parentPanel = null;
        //  The parent listitem and parent panel
        if (panel.dataset.mmParent) {
            parentListitem = DOM.find(this.node.pnls, '#' + panel.dataset.mmParent)[0];
            parentPanel = parentListitem.closest('.mm-panel');
        }
        //  No navbar needed for vertical submenus.
        if (parentListitem && parentListitem.matches('.mm-listitem_vertical')) {
            return;
        }
        /** The navbar element. */
        var navbar = DOM.create('div.mm-navbar');
        //  Hide navbar if specified in options.
        if (!this.opts.navbar.add) {
            navbar.classList.add('mm-hidden');
        }
        //  Sticky navbars.
        else if (this.opts.navbar.sticky) {
            navbar.classList.add('mm-navbar_sticky');
        }
        //  Add the back button.
        if (parentPanel) {
            /** The back button. */
            var prev = DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
            prev.href = '#' + parentPanel.id;
            navbar.append(prev);
        }
        /** The anchor that opens the panel. */
        var opener = null;
        //  The anchor is in a listitem.
        if (parentListitem) {
            opener = DOM.children(parentListitem, '.mm-listitem__text')[0];
        }
        //  The anchor is in a panel.
        else if (parentPanel) {
            opener = DOM.find(parentPanel, 'a[href="#' + panel.id + '"]')[0];
        }
        //  Add the title.
        var title = DOM.create('a.mm-navbar__title');
        var titleText = DOM.create('span');
        title.append(titleText);
        titleText.innerHTML =
            panel.dataset.mmTitle ||
                (opener ? opener.textContent : '') ||
                this.i18n(this.opts.navbar.title) ||
                this.i18n('Menu');
        switch (this.opts.navbar.titleLink) {
            case 'anchor':
                if (opener) {
                    title.setAttribute('href', opener.getAttribute('href'));
                }
                break;
            case 'parent':
                if (parentPanel) {
                    title.setAttribute('href', '#' + parentPanel.id);
                }
                break;
        }
        navbar.append(title);
        panel.prepend(navbar);
        //	Invoke "after" hook.
        this.trigger('initNavbar:after', [panel]);
    };
    /**
     * Initialize a listview.
     * @param {HTMLElement} listview Listview to initialize.
     */
    Mmenu.prototype._initListview = function (listview) {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initListview:before', [listview]);
        DOM.reClass(listview, this.conf.classNames.nolistview, 'mm-nolistview');
        if (!listview.matches('.mm-nolistview')) {
            listview.classList.add('mm-listview');
            //  Initiate the listitem(s).
            DOM.children(listview).forEach(function (listitem) {
                _this._initListitem(listitem);
            });
            // Observe the listview for added listitems.
            this.listviewObserver.observe(listview, {
                childList: true,
            });
        }
        //	Invoke "after" hook.
        this.trigger('initListview:after', [listview]);
    };
    /**
     * Initialte a listitem.
     * @param {HTMLElement} listitem Listitem to initiate.
     */
    Mmenu.prototype._initListitem = function (listitem) {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initListitem:before', [listitem]);
        listitem.classList.add('mm-listitem');
        DOM.reClass(listitem, this.conf.classNames.selected, 'mm-listitem_selected');
        DOM.reClass(listitem, this.conf.classNames.divider, 'mm-divider');
        if (listitem.matches('.mm-divider')) {
            listitem.classList.remove('mm-listitem');
        }
        DOM.children(listitem, 'a, span').forEach(function (text) {
            text.classList.add('mm-listitem__text');
        });
        //  Initiate the subpanel.
        DOM.children(listitem, this.conf.panelNodetype.join(', ')).forEach(function (subpanel) {
            _this._initSubPanel(subpanel);
        });
        // Observe the listview for added listitems.
        this.listitemObserver.observe(listitem, {
            childList: true,
        });
        //	Invoke "after" hook.
        this.trigger('initListitem:after', [listitem]);
    };
    /**
     * Initiate a subpanel.
     * @param {HTMLElement} subpanel Subpanel to initiate.
     */
    Mmenu.prototype._initSubPanel = function (subpanel) {
        /** The parent element for the panel. */
        var listitem = subpanel.parentElement;
        /** Whether or not the listitem expands vertically */
        var vertical = subpanel.matches('.' + this.conf.classNames.vertical) ||
            !this.opts.slidingSubmenus;
        // Make it expand vertically
        if (vertical) {
            listitem.classList.add('mm-listitem_vertical');
        }
        //  Force an ID
        listitem.id = listitem.id || uniqueId();
        subpanel.id = subpanel.id || uniqueId();
        //  Store parent/child relation
        listitem.dataset.mmChild = subpanel.id;
        subpanel.dataset.mmParent = listitem.id;
        /** The open link. */
        var button = DOM.children(listitem, '.mm-btn')[0];
        //  Init item text
        if (!button) {
            button = DOM.create('a.mm-btn.mm-btn_next.mm-listitem__btn');
            DOM.children(listitem, 'a, span').forEach(function (text) {
                //  If the item has no link,
                //      Replace the item with the open link.
                if (text.matches('span')) {
                    button.classList.add('mm-listitem__text');
                    button.innerHTML = text.innerHTML;
                    listitem.insertBefore(button, text.nextElementSibling);
                    text.remove();
                }
                //  Otherwise, insert the button after the text.
                else {
                    listitem.insertBefore(button, text.nextElementSibling);
                }
            });
        }
        button.href = '#' + subpanel.id;
        this._initPanel(subpanel);
    };
    /**
     * Find and open the correct panel after creating the menu.
     */
    Mmenu.prototype._initOpened = function () {
        //	Invoke "before" hook.
        this.trigger('initOpened:before');
        /** The selected listitem(s). */
        var listitems = this.node.pnls.querySelectorAll('.mm-listitem_selected');
        /** The last selected listitem. */
        var lastitem = null;
        //	Deselect the listitems.
        listitems.forEach(function (listitem) {
            lastitem = listitem;
            listitem.classList.remove('mm-listitem_selected');
        });
        //	Re-select the last listitem.
        if (lastitem) {
            lastitem.classList.add('mm-listitem_selected');
        }
        /**	The current opened panel. */
        var current = lastitem
            ? lastitem.closest('.mm-panel')
            : DOM.children(this.node.pnls, '.mm-panel')[0];
        //	Open the current opened panel.
        this.openPanel(current, false);
        //	Invoke "after" hook.
        this.trigger('initOpened:after');
    };
    /**
     * Initialize anchors in / for the menu.
     */
    Mmenu.prototype._initAnchors = function () {
        var _this = this;
        //	Invoke "before" hook.
        this.trigger('initAnchors:before');
        document.addEventListener('click', function (evnt) {
            /** The clicked element. */
            var target = evnt.target.closest('a[href]');
            if (!target) {
                return;
            }
            /** Arguments passed to the bound methods. */
            var args = {
                inMenu: target.closest('.mm-menu') === _this.node.menu,
                inListview: target.matches('.mm-listitem > a'),
                toExternal: target.matches('[rel="external"]') ||
                    target.matches('[target="_blank"]'),
            };
            var onClick = {
                close: null,
                setSelected: null,
                preventDefault: target.getAttribute('href').slice(0, 1) == '#',
            };
            //	Find hooked behavior.
            for (var c = 0; c < _this.clck.length; c++) {
                var click = _this.clck[c].call(_this, target, args);
                if (click) {
                    if (typeof click == 'boolean') {
                        evnt.preventDefault();
                        return;
                    }
                    if (type(click) == 'object') {
                        onClick = extend(click, onClick);
                    }
                }
            }
            //	Default behavior for anchors in lists.
            if (args.inMenu && args.inListview && !args.toExternal) {
                //	Set selected item, Default: true
                if (valueOrFn(target, _this.opts.onClick.setSelected, onClick.setSelected)) {
                    _this.setSelected(target.parentElement);
                }
                //	Prevent default / don't follow link. Default: false.
                if (valueOrFn(target, _this.opts.onClick.preventDefault, onClick.preventDefault)) {
                    evnt.preventDefault();
                }
                //	Close menu. Default: false
                if (valueOrFn(target, _this.opts.onClick.close, onClick.close)) {
                    if (_this.opts.offCanvas &&
                        typeof _this.close == 'function') {
                        _this.close();
                    }
                }
            }
        }, true);
        //	Invoke "after" hook.
        this.trigger('initAnchors:after');
    };
    /**
     * Get the translation for a text.
     * @param  {string} text 	Text to translate.
     * @return {string}			The translated text.
     */
    Mmenu.prototype.i18n = function (text) {
        return i18n.get(text, this.conf.language);
    };
    /**	Plugin version. */
    Mmenu.version = pack.version;
    /**	Default options for menus. */
    Mmenu.options = options;
    /**	Default configuration for menus. */
    Mmenu.configs = configs;
    /**	Available add-ons for the plugin. */
    Mmenu.addons = {};
    /** Available wrappers for the plugin. */
    Mmenu.wrappers = {};
    /**	Globally used HTML elements. */
    Mmenu.node = {};
    /** Globally used variables. */
    Mmenu.vars = {};
    return Mmenu;
}());
export default Mmenu;
