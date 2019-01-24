;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.Mmenu = factory(root.jQuery);
  }
}(this, function(jQuery) {
/*!
 * mmenu v8.0.0
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */
/**
 * Class for a mobile menu.
 */
var Mmenu = /** @class */ (function () {
    /**
     * Create a mobile menu.
     *
     * @param {HTMLElement|string} 	menu						The menu node.
     * @param {object} 				[options=Mmenu.options]		Options for the menu.
     * @param {object} 				[configs=Mmenu.configs]		Configuration options for the menu.
     */
    function Mmenu(menu, options, configs) {
        //	Extend options and configuration from defaults.
        this.opts = Mmenu.extend(options, Mmenu.options);
        this.conf = Mmenu.extend(configs, Mmenu.configs);
        //	Methods to expose in the API.
        this._api = ['bind', 'initPanels', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected'];
        //	Storage objects for nodes, variables, hooks, matchmedia and click handlers.
        this.node = {};
        this.vars = {};
        this.hook = {};
        this.mtch = {};
        this.clck = [];
        //	Get menu node from string or HTML element.
        this.node.menu = (typeof menu == 'string')
            ? document.querySelector(menu)
            : menu;
        if (typeof this._deprecated == 'function') {
            this._deprecated();
        }
        this._initWrappers();
        this._initAddons();
        this._initExtensions();
        this._initHooks();
        this._initAPI();
        this._initMenu();
        this._initPanels();
        this._initOpened();
        this._initAnchors();
        this._initMatchMedia();
        if (typeof this._debug == 'function') {
            this._debug();
        }
        return this;
    }
    /**
     * Open a panel.
     *
     * @param {HTMLElement} panel				Panel to open.
     * @param {boolean}		[animation=true]	Whether or not to open the panel with an animation.
     */
    Mmenu.prototype.openPanel = function (panel, animation) {
        var _this = this;
        this.trigger('openPanel:before', [panel]);
        if (!panel) {
            return;
        }
        if (!panel.matches('.mm-panel')) {
            panel = panel.closest('.mm-panel');
        }
        if (!panel) {
            return;
        }
        if (typeof animation != 'boolean') {
            animation = true;
        }
        //	Open a "vertical" panel
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            //	Open current and all vertical parent panels
            Mmenu.DOM.parents(panel, '.mm-listitem_vertical')
                .forEach(function (listitem) {
                panel.classList.add('mm-listitem_opened');
                Mmenu.DOM.children(listitem, '.mm-panel')
                    .forEach(function (panel) {
                    panel.classList.remove('mm-hidden');
                });
            });
            //	Open first non-vertical parent panel
            var parents = Mmenu.DOM.parents(panel, '.mm-panel')
                .filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); });
            this.trigger('openPanel:start', [panel]);
            if (parents.length) {
                this.openPanel(parents[0]);
            }
            this.trigger('openPanel:finish', [panel]);
        }
        //	Open a "horizontal" panel
        else {
            if (panel.matches('.mm-panel_opened')) {
                return;
            }
            var panels = Mmenu.DOM.children(this.node.pnls, '.mm-panel'), current_1 = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            //	Close all child panels
            panels.filter(function (parent) { return parent !== panel; })
                .forEach(function (parent) {
                parent.classList.remove('mm-panel_opened-parent');
            });
            //	Open all parent panels
            var parent = panel.mmParent;
            while (parent) {
                parent = parent.closest('.mm-panel');
                if (parent) {
                    if (!parent.parentElement.matches('.mm-listitem_vertical')) {
                        parent.classList.add('mm-panel_opened-parent');
                    }
                    parent = parent.mmParent;
                }
            }
            //	Add classes for animation
            panels.forEach(function (panel) {
                panel.classList.remove('mm-panel_highest');
            });
            panels.filter(function (hidden) { return hidden !== current_1; })
                .filter(function (hidden) { return hidden !== panel; })
                .forEach(function (hidden) {
                hidden.classList.add('mm-hidden');
            });
            panel.classList.remove('mm-hidden');
            //	Start opening the panel
            var openPanelStart = function () {
                if (current_1) {
                    current_1.classList.remove('mm-panel_opened');
                }
                panel.classList.add('mm-panel_opened');
                if (panel.matches('.mm-panel_opened-parent')) {
                    if (current_1) {
                        current_1.classList.add('mm-panel_highest');
                    }
                    panel.classList.remove('mm-panel_opened-parent');
                }
                else {
                    if (current_1) {
                        current_1.classList.add('mm-panel_opened-parent');
                    }
                    panel.classList.add('mm-panel_highest');
                }
                _this.trigger('openPanel:start', [panel]);
            };
            //	Finish opening the panel
            var openPanelFinish = function () {
                if (current_1) {
                    current_1.classList.remove('mm-panel_highest');
                    current_1.classList.add('mm-hidden');
                }
                panel.classList.remove('mm-panel_highest');
                _this.trigger('openPanel:finish', [panel]);
            };
            if (animation && !panel.matches('.mm-panel_noanimation')) {
                //	Without the timeout the animation will not work because the element had display: none;
                //	RequestAnimationFrame would be nice here.
                setTimeout(function () {
                    //	Callback
                    Mmenu.transitionend(panel, function () {
                        openPanelFinish();
                    }, _this.conf.transitionDuration);
                    openPanelStart();
                }, this.conf.openingInterval);
            }
            else {
                openPanelStart();
                openPanelFinish();
            }
        }
        this.trigger('openPanel:after', [panel]);
    };
    /**
     * Close a panel.
     *
     * @param {HTMLElement} panel Panel to close.
     */
    Mmenu.prototype.closePanel = function (panel) {
        this.trigger('closePanel:before', [panel]);
        var li = panel.parentElement;
        //	Only works for "vertical" panels
        if (li.matches('.mm-listitem_vertical')) {
            li.classList.remove('mm-listitem_opened');
            panel.classList.add('mm-hidden');
            this.trigger('closePanel', [panel]);
        }
        this.trigger('closePanel:after', [panel]);
    };
    /**
     * Close all opened panels.
     *
     * @param {HTMLElement} panel Panel to open after closing all other panels.
     */
    Mmenu.prototype.closeAllPanels = function (panel) {
        this.trigger('closeAllPanels:before');
        //	Close all "vertical" panels.
        var listitems = this.node.pnls.querySelectorAll('.mm-listitem');
        listitems.forEach(function (listitem) {
            listitem.classList.remove('mm-listitem_selected', 'mm-listitem_opened');
        });
        //	Close all "horizontal" panels.
        var panels = Mmenu.DOM.children(this.node.pnls, '.mm-panel'), opened = (panel) ? panel : panels[0];
        Mmenu.DOM.children(this.node.pnls, '.mm-panel')
            .forEach(function (panel) {
            if (panel !== opened) {
                panel.classList.remove('mm-panel_opened');
                panel.classList.remove('mm-panel_opened-parent');
                panel.classList.remove('mm-panel_highest');
                panel.classList.add('mm-hidden');
            }
        });
        //	Open first panel.
        this.openPanel(opened, false);
        this.trigger('closeAllPanels:after');
    };
    /**
     * Toggle a panel opened/closed.
     *
     * @param {HTMLElement} panel Panel to open or close.
     */
    Mmenu.prototype.togglePanel = function (panel) {
        var listitem = panel.parentElement;
        //	Only works for "vertical" panels.
        if (listitem.matches('.mm-listitem_vertical')) {
            this[listitem.matches('.mm-listitem_opened') ? 'closePanel' : 'openPanel'](panel);
        }
    };
    /**
     * Display a listitem as being "selected".
     *
     * @param {HTMLElement} listitem Listitem to mark.
     */
    Mmenu.prototype.setSelected = function (listitem) {
        this.trigger('setSelected:before', [listitem]);
        //	First, remove the selected class from all listitems.
        Mmenu.DOM.find(this.node.menu, '.mm-listitem_selected')
            .forEach(function (li) {
            li.classList.remove('mm-listitem_selected');
        });
        //	Next, add the selected class to the provided listitem.
        listitem.classList.add('mm-listitem_selected');
        this.trigger('setSelected:after', [listitem]);
    };
    /**
     * Bind a function to a hook.
     *
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
     * Invoke the functions bound to a hook.
     *
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
    /**
     * Bind functions to a matchMedia listener.
     *
     * @param {string} 		mediaquery 	Media query to match.
     * @param {function} 	yes 		Function to invoke when the media query matches.
     * @param {function} 	no 			Function to invoke when the media query doesn't match.
     */
    Mmenu.prototype.matchMedia = function (mediaquery, yes, no) {
        this.mtch[mediaquery] = this.mtch[mediaquery] || [];
        this.mtch[mediaquery].push({
            'yes': yes,
            'no': no
        });
    };
    /**
     * Initialize the matchMedia listener.
     */
    Mmenu.prototype._initMatchMedia = function () {
        var _this = this;
        for (var mediaquery in this.mtch) {
            (function () {
                var mqstring = mediaquery, mqlist = window.matchMedia(mqstring);
                _this._fireMatchMedia(mqstring, mqlist);
                mqlist.addListener(function (mqlist) {
                    _this._fireMatchMedia(mqstring, mqlist);
                });
            })();
        }
    };
    /**
     * Fire the "yes" or "no" function for a matchMedia listener.
     *
     * @param {string} 			mqstring 	Media query to check for.
     * @param {MediaQueryList} 	mqlist 		Media query list to check with.
     */
    Mmenu.prototype._fireMatchMedia = function (mqstring, mqlist // Typescript "Cannot find name 'MediaQueryListEvent'."
    ) {
        var fn = mqlist.matches ? 'yes' : 'no';
        for (var m = 0; m < this.mtch[mqstring].length; m++) {
            this.mtch[mqstring][m][fn].call(this);
        }
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
                return (typeof re == 'undefined') ? that.API : re;
            };
        });
        //	Store the API in the HTML node for external usage.
        this.node.menu.mmenu = this.API;
    };
    /**
     * Bind the hooks specified in the options.
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
        this.trigger('initWrappers:before');
        for (var w = 0; w < this.opts.wrappers.length; w++) {
            Mmenu.wrappers[this.opts.wrappers[w]].call(this);
        }
        this.trigger('initWrappers:after');
    };
    /**
     * Initialize all available add-ons.
     */
    Mmenu.prototype._initAddons = function () {
        this.trigger('initAddons:before');
        for (var addon in Mmenu.addons) {
            Mmenu.addons[addon].call(this);
        }
        this.trigger('initAddons:after');
    };
    /**
     * Initialize the extensions specified in the options.
     */
    Mmenu.prototype._initExtensions = function () {
        var _this = this;
        this.trigger('initExtensions:before');
        //	Convert array to object with array
        if (Mmenu.typeof(this.opts.extensions) == 'array') {
            this.opts.extensions = {
                'all': this.opts.extensions
            };
        }
        var _loop_1 = function (mediaquery) {
            this_1.opts['extensions'][mediaquery] = this_1.opts['extensions'][mediaquery].length ? 'mm-menu_' + this_1.opts['extensions'][mediaquery].join(' mm-menu_') : '';
            if (this_1.opts.extensions[mediaquery]) {
                //	TODO: is the closure still needed as it now is a let?
                //	(( mediaquery ) => {
                this_1.matchMedia(mediaquery, function () {
                    _this.node.menu.classList.add(_this.opts.extensions[mediaquery]);
                }, function () {
                    _this.node.menu.classList.remove(_this.opts.extensions[mediaquery]);
                });
                //	})( mediaquery );
            }
        };
        var this_1 = this;
        //	Loop over object
        for (var mediaquery in this.opts.extensions) {
            _loop_1(mediaquery);
        }
        this.trigger('initExtensions:after');
    };
    /**
     * Initialize the menu.
     */
    Mmenu.prototype._initMenu = function () {
        var _this = this;
        this.trigger('initMenu:before');
        //	Add an ID to the menu if it does not yet have one.
        this.node.menu.id = this.node.menu.id || Mmenu.getUniqueId();
        //	Store the original menu ID.
        this.vars.orgMenuId = this.node.menu.id;
        //	Clone if needed.
        if (this.conf.clone) {
            //	Store the original menu.
            this.node.orig = this.node.menu;
            //	Clone the original menu and store it.
            this.node.menu = this.node.orig.cloneNode(true);
            //	Prefix all ID's in the cloned menu.
            this.node.menu.id = 'mm-' + this.node.menu.id;
            Mmenu.DOM.find(this.node.menu, '[id]')
                .forEach(function (elem) {
                elem.id = 'mm-' + elem.id;
            });
        }
        //	Wrap the panels in a node.
        var panels = Mmenu.DOM.create('div.mm-panels');
        Array.from(this.node.menu.children)
            .forEach(function (panel) {
            if (_this.conf.panelNodetype.indexOf(panel.nodeName.toLowerCase()) > -1) {
                panels.append(panel);
            }
        });
        this.node.menu.append(panels);
        this.node.pnls = panels;
        //	Add class to the menu.
        this.node.menu.classList.add('mm-menu');
        //	Add class to the wrapper.
        this.node.menu.parentElement.classList.add('mm-wrapper');
        this.trigger('initMenu:after');
    };
    /**
     * Initialize panels.
     *
     * @param {array} [panels] Panels to initialize.
     */
    Mmenu.prototype._initPanels = function (panels) {
        var _this = this;
        //	Open / close panels.
        this.clck.push(function (anchor, args) {
            if (args.inMenu) {
                var href = anchor.getAttribute('href');
                if (href.length > 1 && href.slice(0, 1) == '#') {
                    try {
                        var panel = _this.node.menu.querySelector(href);
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
        //	Actually initialise the panels
        this.initPanels(panels);
    };
    /**
     * Initialize panels.
     *
     * @param {array} [panels] The panels to initialize.
     */
    Mmenu.prototype.initPanels = function (panels) {
        var _this = this;
        this.trigger('initPanels:before', [panels]);
        var panelNodetype = this.conf.panelNodetype.join(', ');
        //	If no panels provided, use all panels.
        panels = panels || Mmenu.DOM.children(this.node.pnls, panelNodetype);
        var newpanels = [];
        var init = function (panels) {
            panels.filter(function (panel) { return panel.matches(panelNodetype); })
                .forEach(function (panel) {
                var panel = _this._initPanel(panel);
                if (panel) {
                    _this._initNavbar(panel);
                    _this._initListview(panel);
                    newpanels.push(panel);
                    //	Init subpanels.
                    var children = [];
                    //	Find panel > panel
                    children.push.apply(children, Mmenu.DOM.children(panel, '.' + _this.conf.classNames.panel));
                    //	Find panel listitem > panel
                    Mmenu.DOM.find(panel, '.mm-listitem')
                        .forEach(function (listitem) {
                        children.push.apply(children, Mmenu.DOM.children(listitem, panelNodetype));
                    });
                    //	TODO: the above is less code but might be buggy??
                    //			The below is stricter
                    // Mmenu.DOM.children( panel, '.mm-listview' )
                    // 	.forEach(( listview ) => {
                    // 		Mmenu.DOM.children( listview, '.mm-listitem' )
                    // 			.forEach(( listitem ) => {
                    // 				children.push( ...Mmenu.DOM.children( listitem, panelNodetype ) );
                    // 			});
                    // 	});
                    if (children.length) {
                        init(children);
                    }
                }
            });
        };
        init(panels);
        this.trigger('initPanels:after', [newpanels]);
    };
    /**
     * Initialize a single panel.
     *
     * @param  {HTMLElement} 		panel 	Panel to initialize.
     * @return {HTMLElement|null} 			Initialized panel.
     */
    Mmenu.prototype._initPanel = function (panel) {
        this.trigger('initPanel:before', [panel]);
        //	Stop if already a panel
        if (panel.matches('.mm-panel')) {
            return panel;
        }
        //	Refactor panel classnames
        Mmenu.refactorClass(panel, this.conf.classNames.panel, 'mm-panel');
        Mmenu.refactorClass(panel, this.conf.classNames.nopanel, 'mm-nopanel');
        Mmenu.refactorClass(panel, this.conf.classNames.inset, 'mm-listview_inset');
        if (panel.matches('.mm-listview_inset')) {
            panel.classList.add('mm-nopanel');
        }
        //	Stop if not supposed to be a panel
        if (panel.matches('.mm-nopanel')) {
            return null;
        }
        //	Wrap UL/OL in DIV
        var vertical = (panel.matches('.' + this.conf.classNames.vertical) || !this.opts.slidingSubmenus);
        panel.classList.remove(this.conf.classNames.vertical);
        var id = panel.id || Mmenu.getUniqueId();
        if (panel.matches('ul, ol')) {
            panel.removeAttribute('id');
            Mmenu.$(panel).wrap('<div />');
            panel = panel.parentElement;
        }
        panel.id = id;
        panel.classList.add('mm-panel', 'mm-hidden');
        var parent = [panel.parentElement].filter(function (listitem) { return listitem.matches('li'); })[0];
        if (vertical) {
            if (parent) {
                parent.classList.add('mm-listitem_vertical');
            }
        }
        else {
            this.node.pnls.append(panel);
        }
        //	Store parent/child relation
        if (parent) {
            parent.mmChild = panel;
            panel.mmParent = parent;
        }
        this.trigger('initPanel:after', [panel]);
        return panel;
    };
    /**
     * Initialize a navbar.
     *
     * @param {HTMLElement} panel Panel for the navbar.
     */
    Mmenu.prototype._initNavbar = function (panel) {
        this.trigger('initNavbar:before', [panel]);
        if (Mmenu.DOM.children(panel, '.mm-navbar').length) {
            return;
        }
        var parent = panel.mmParent, navbar = Mmenu.DOM.create('div.mm-navbar');
        var title = this._getPanelTitle(panel, this.opts.navbar.title), href = '';
        if (parent) {
            if (parent.matches('.mm-listitem_vertical')) {
                return;
            }
            var opener_1;
            //	Listview, the panel wrapping this panel
            if (parent.matches('.mm-listitem')) {
                opener_1 = Mmenu.DOM.children(parent, '.mm-listitem__text')[0];
            }
            //	Non-listview, the first anchor in the parent panel that links to this panel
            else {
                opener_1 = panel.closest('.mm-panel');
                opener_1 = Mmenu.DOM.find(opener_1, 'a[href="#' + panel.id + '"]')[0];
            }
            var id = opener_1.closest('.mm-panel').id;
            title = this._getPanelTitle(panel, opener_1.innerText);
            switch (this.opts.navbar.titleLink) {
                case 'anchor':
                    href = opener_1.getAttribute('href');
                    break;
                case 'parent':
                    href = '#' + id;
                    break;
            }
            var anchor_1 = Mmenu.DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
            anchor_1.setAttribute('href', '#' + id);
            navbar.append(anchor_1);
        }
        else if (!this.opts.navbar.title) {
            return;
        }
        if (this.opts.navbar.add) {
            panel.classList.add('mm-panel_has-navbar');
        }
        var anchor = Mmenu.DOM.create('a.mm-navbar__title');
        anchor.innerHTML = title;
        if (href) {
            anchor.setAttribute('href', href);
        }
        navbar.append(anchor);
        panel.prepend(navbar);
        this.trigger('initNavbar:after', [panel]);
    };
    /**
     * Initialize a listview.
     *
     * @param {HTMLElement} panel Panel for the listview(s).
     */
    Mmenu.prototype._initListview = function (panel) {
        var _this = this;
        this.trigger('initListview:before', [panel]);
        //	Refactor listviews classnames
        var filter = 'ul, ol', listviews = Mmenu.DOM.children(panel, filter);
        if (panel.matches(filter)) {
            listviews.unshift(panel);
        }
        listviews.forEach(function (listview) {
            Mmenu.refactorClass(listview, _this.conf.classNames.nolistview, 'mm-nolistview');
        });
        var listitems = [];
        //	Refactor listitems classnames
        listviews.forEach(function (listview) {
            if (!listview.matches('.mm-nolistview')) {
                listview.classList.add('mm-listview');
                Mmenu.DOM.children(listview)
                    .forEach(function (listitem) {
                    listitem.classList.add('mm-listitem');
                    Mmenu.refactorClass(listitem, _this.conf.classNames.selected, 'mm-listitem_selected');
                    Mmenu.refactorClass(listitem, _this.conf.classNames.divider, 'mm-listitem_divider');
                    Mmenu.refactorClass(listitem, _this.conf.classNames.spacer, 'mm-listitem_spacer');
                    Mmenu.DOM.children(listitem, 'a, span')
                        .forEach(function (item) {
                        if (!item.matches('.mm-btn')) {
                            item.classList.add('mm-listitem__text');
                        }
                    });
                });
            }
        });
        //	Add open link to parent listitem
        var parent = panel.mmParent;
        if (parent && parent.matches('.mm-listitem')) {
            if (!Mmenu.DOM.children(parent, '.mm-btn').length) {
                var item = Mmenu.DOM.children(parent, 'a, span')[0];
                if (item) {
                    var button = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-listitem__btn');
                    button.setAttribute('href', '#' + panel.id);
                    Mmenu.$(button).insertAfter(item);
                    if (item.matches('span')) {
                        button.classList.add('mm-listitem__text');
                        button.innerHTML = item.innerHTML;
                        item.remove();
                    }
                }
            }
        }
        this.trigger('initListview:after', [panel]);
    };
    /**
     * Find and open the correct panel after creating the menu.
     */
    Mmenu.prototype._initOpened = function () {
        this.trigger('initOpened:before');
        //	Find all selected listitems.
        var listitems = this.node.pnls.querySelectorAll('.mm-listitem_selected');
        //	Deselect the listitems
        var lastitem = null;
        listitems.forEach(function (listitem) {
            lastitem = listitem;
            listitem.classList.remove('mm-listitem_selected');
        });
        if (lastitem) {
            lastitem.classList.add('mm-listitem_selected');
        }
        //	Find the current opened panel
        var current = (lastitem)
            ? lastitem.closest('.mm-panel')
            : Mmenu.DOM.children(this.node.pnls, '.mm-panel')[0];
        //	Open the current opened panel
        this.openPanel(current, false);
        this.trigger('initOpened:after');
    };
    /**
     * Initialize anchors in / for the menu.
     */
    Mmenu.prototype._initAnchors = function () {
        var _this = this;
        this.trigger('initAnchors:before');
        Mmenu.$('body')
            .on('click.mm', 'a[href]', function (evnt) {
            var target = evnt.currentTarget;
            var href = target.getAttribute('href');
            var args = {
                inMenu: target.closest('.mm-menu') === _this.node.menu,
                inListview: target.matches('.mm-listitem > a'),
                toExternal: target.matches('[rel="external"]') || target.matches('[target="_blank"]')
            };
            var onClick = {
                close: null,
                setSelected: null,
                preventDefault: href.slice(0, 1) == '#'
            };
            //	Find hooked behavior.
            for (var c = 0; c < _this.clck.length; c++) {
                var click = _this.clck[c].call(_this, target, args);
                if (click) {
                    if (Mmenu.typeof(click) == 'boolean') {
                        evnt.preventDefault();
                        return;
                    }
                    if (Mmenu.typeof(click) == 'object') {
                        onClick = Mmenu.extend(click, onClick);
                    }
                }
            }
            //	Default behavior for anchors in lists.
            if (args.inMenu && args.inListview && !args.toExternal) {
                //	Set selected item, Default: true
                if (Mmenu.valueOrFn(target, _this.opts.onClick.setSelected, onClick.setSelected)) {
                    _this.setSelected(target.parentElement);
                }
                //	Prevent default / don't follow link. Default: false.
                if (Mmenu.valueOrFn(target, _this.opts.onClick.preventDefault, onClick.preventDefault)) {
                    evnt.preventDefault();
                }
                //	Close menu. Default: false
                //		TODO: option + code should be in offcanvas add-on
                if (Mmenu.valueOrFn(target, _this.opts.onClick.close, onClick.close)) {
                    if (_this.opts.offCanvas && typeof _this.close == 'function') {
                        _this.close();
                    }
                }
            }
        });
        this.trigger('initAnchors:after');
    };
    //	TODO: interface that tells what will be returned based on input
    /**
     * Get the translation for a text.
     *
     * @param  {string} text 	Text to translate.
     * @return {string}			The translated text.
     */
    Mmenu.prototype.i18n = function (text) {
        return Mmenu.i18n(text, this.conf.language);
    };
    /**
     * Find the title for a panel.
     *
     * @param 	{HTMLElement}		panel 		Panel to search in.
     * @param 	{string|Function} 	[dfault] 	Fallback/default title.
     * @return	{string}						The title for the panel.
     */
    Mmenu.prototype._getPanelTitle = function (panel, dfault) {
        var title;
        //	Function
        if (typeof this.opts.navbar.title == 'function') {
            title = this.opts.navbar.title.call(panel);
        }
        //	Data attr
        if (typeof title == 'undefined') {
            title = panel.getAttribute('mm-data-title');
        }
        if (typeof title == 'string' && title.length) {
            return title;
        }
        //	Fallback
        if (typeof dfault == 'string') {
            return this.i18n(dfault);
        }
        else if (typeof dfault == 'function') {
            return this.i18n(dfault.call(panel));
        }
        //	Default
        if (typeof Mmenu.options.navbar.title == 'string') {
            return this.i18n(Mmenu.options.navbar.title);
        }
        return this.i18n('Menu');
    };
    /**
     * Find the value from an option or function.
     *
     * @param 	{HTMLElement} 	element 	Scope for the function.
     * @param 	{any} 			[option] 	Value or function.
     * @param 	{any} 			[dfault] 	Default fallback value.
     * @return	{any}						The given evaluation of the given option, or the default fallback value.
     */
    Mmenu.valueOrFn = function (element, option, dfault) {
        if (typeof option == 'function') {
            var value = option.call(element);
            if (typeof value != 'undefined') {
                return value;
            }
        }
        if ((typeof option == 'function' || typeof option == 'undefined')
            && typeof dfault != 'undefined') {
            return dfault;
        }
        return option;
    };
    /**
     * Refactor a classname on multiple elements.
     *
     * @param {HTMLElement} element 	Element to refactor.
     * @param {string}		oldClass 	Classname to remove.
     * @param {string}		newClass 	Classname to add.
     */
    Mmenu.refactorClass = function (element, oldClass, newClass) {
        if (element.matches('.' + oldClass)) {
            element.classList.remove(oldClass);
            element.classList.add(newClass);
        }
    };
    /**
     * Find and filter direct child elements including the node itself.
     *
     * @param  {HTMLElement} 	element Elements to search in.
     * @param  {string}			filter 	Selector to filter the elements against.
     * @return {array}					The expanded and filtered set of elements.
     */
    Mmenu.childAddSelf = function (element, filter) {
        var elements = Mmenu.DOM.children(element, filter);
        if (element.matches(filter)) {
            elements.unshift(element);
        }
        return elements;
    };
    /**
     * Filter out non-listitem listitems.
     *
     * @param  {array} listitems 	Elements to filter.
     * @return {array}				The filtered set of listitems.
     */
    Mmenu.filterListItems = function (listitems) {
        return listitems
            .filter(function (listitem) { return !listitem.matches('.mm-listitem_divider'); })
            .filter(function (listitem) { return !listitem.matches('.mm-hidden'); });
    };
    /**
     * Find anchors in listitems (excluding anchor that open a sub-panel).
     *
     * @param  {array} 	listitems 	Elements to filter.
     * @return {array}				The found set of anchors.
     */
    Mmenu.filterListItemAnchors = function (listitems) {
        var anchors = [];
        Mmenu.filterListItems(listitems)
            .forEach(function (listitem) {
            anchors.push.apply(anchors, Mmenu.DOM.children(listitem, 'a.mm-listitem__text'));
        });
        return anchors.filter(function (anchor) { return !anchor.matches('.mm-btn_next'); });
    };
    /**
     * Set and invoke a (single) transition-end function with fallback.
     *
     * @param {JQuery} 		$element 	Scope for the function.
     * @param {function}	func		Function to invoke.
     * @param {number}		duration	The duration of the animation (for the fallback).
     */
    Mmenu.transitionend = function (element, func, duration) {
        var guid = Mmenu.getUniqueId();
        var _ended = false, _fn = function (evnt) {
            if (typeof evnt !== 'undefined') {
                if (evnt.target !== element) {
                    return;
                }
            }
            if (!_ended) {
                element.removeEventListener('transitionend', _fn);
                element.removeEventListener('webkitTransitionEnd', _fn);
                func.call(element);
            }
            _ended = true;
        };
        element.addEventListener('transitionend', _fn);
        element.addEventListener('webkitTransitionEnd', _fn);
        setTimeout(_fn, duration * 1.1);
    };
    /**
     * Get the type of any given variable. Improvement of "typeof".
     *
     * @param 	{any}		variable	The variable.
     * @return	{string}				The type of the variable in lowercase.
     */
    Mmenu.typeof = function (variable) {
        return ({}).toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };
    /**
     * Deep extend an object with the given defaults.
     * Note that the extended object is not a clone, meaning the original object will also be updated.
     *
     * @param 	{object}	orignl	The object to extend to.
     * @param 	{object}	dfault	The object to extend from.
     * @return	{object}			The extended "orignl" object.
     */
    Mmenu.extend = function (orignl, //	Unfortunately, Typescript doesn't allow "object", "mmLooseObject" or anything other than "any".
    dfault) {
        if (Mmenu.typeof(orignl) != 'object') {
            orignl = {};
        }
        if (Mmenu.typeof(dfault) != 'object') {
            dfault = {};
        }
        for (var k in dfault) {
            if (!dfault.hasOwnProperty(k)) {
                continue;
            }
            if (typeof orignl[k] == 'undefined') {
                orignl[k] = dfault[k];
            }
            else if (Mmenu.typeof(orignl[k]) == 'object') {
                Mmenu.extend(orignl[k], dfault[k]);
            }
        }
        return orignl;
    };
    /**	Plugin version. */
    Mmenu.version = '8.0.0';
    /**	Default options for menus. */
    Mmenu.options = {
        hooks: {},
        extensions: [],
        wrappers: [],
        navbar: {
            add: true,
            title: 'Menu',
            titleLink: 'parent'
        },
        onClick: {
            close: null,
            preventDefault: null,
            setSelected: true
        },
        slidingSubmenus: true
    };
    /**	Default configuration for menus. */
    Mmenu.configs = {
        classNames: {
            divider: 'Divider',
            inset: 'Inset',
            nolistview: 'NoListview',
            nopanel: 'NoPanel',
            panel: 'Panel',
            selected: 'Selected',
            spacer: 'Spacer',
            vertical: 'Vertical'
        },
        clone: false,
        language: null,
        openingInterval: 25,
        panelNodetype: ['ul', 'ol', 'div'],
        transitionDuration: 400
    };
    /**	Available add-ons for the plugin. */
    Mmenu.addons = {};
    /** Available wrappers for the plugin. */
    Mmenu.wrappers = {};
    /**	Globally used HTML nodes. */
    Mmenu.node = {};
    /**	Features supported by the browser. */
    Mmenu.support = {
        touch: 'ontouchstart' in window || (navigator.msMaxTouchPoints ? true : false) || false
    };
    /** Library for DOM traversal and DOM manipulations. */
    Mmenu.$ = jQuery || Zepto || cash;
    //	TODO: interface that tells what will be returned based on input
    /**
     * get or set a translated / translatable text.
     *
     * @param  {string|object} 	[text] 		The translated text to add or get.
     * @param  {string} 		[language] 	The language for the translated text.
     * @return {string|object}				The translated text.
     */
    Mmenu.i18n = (function () {
        var translations = {};
        return function (text, language) {
            switch (Mmenu.typeof(text)) {
                case 'object':
                    if (typeof language == 'string') {
                        if (typeof translations[language] == 'undefined') {
                            translations[language] = {};
                        }
                        //jQuery.extend( translations[ language ], text );
                        Mmenu.extend(translations[language], text);
                    }
                    return translations;
                case 'string':
                    if (typeof language == 'string' &&
                        Mmenu.typeof(translations[language]) == 'object') {
                        return translations[language][text] || text;
                    }
                    return text;
                case 'undefined':
                default:
                    return translations;
            }
        };
    })();
    Mmenu.DOM = {
        /**
         * Create an element with classname.
         */
        create: function (selector) {
            var elem;
            selector.split('.').forEach(function (arg, a) {
                if (a == 0) {
                    elem = document.createElement(arg);
                }
                else {
                    elem.classList.add(arg);
                }
            });
            return elem;
        },
        /**
         * Find all elements matching the selector.
         * Basically the same as element.querySelectorAll() but it returns an actuall array.
         *
         * @param 	{HTMLElement} 	element Element to search in.
         * @param 	{string}		filter	The filter to match.
         * @return	{array}					Array of elements that match the filter.
         */
        find: function (element, filter) {
            return Array.prototype.slice.call(element.querySelectorAll(filter));
        },
        /**
         * Find all child elements matching the (optional) selector.
         *
         * @param 	{HTMLElement} 	element Element to search in.
         * @param 	{string}		filter	The filter to match.
         * @return	{array}					Array of child elements that match the filter.
         */
        children: function (element, filter) {
            var children = Array.prototype.slice.call(element.children);
            return filter
                ? children.filter(function (child) { return child.matches(filter); })
                : children;
        },
        /**
         * Find all preceding elements matching the selector.
         *
         * @param 	{HTMLElement} 	element Element to start searching from.
         * @param 	{string}		filter	The filter to match.
         * @return	{array}					Array of preceding elements that match the filter.
         */
        parents: function (element, filter) {
            /** Array of preceding elements that match the selector. */
            var parents = [];
            /** Array of preceding elements that match the selector. */
            var parent = element.parentElement;
            while (parent) {
                parents.push(parent);
                parent = parent.parentElement;
            }
            return filter
                ? parents.filter(function (parent) { return parent.matches(filter); })
                : parents;
        },
        /**
         * Get an element offset relative to the document.
         *
         * @param 	{HTMLElement}	 element 			Element to start measuring from.
         * @param 	{string}	 	[direction=top] 	Offset top or left.
         * @return	{number}							The element offset relative to the document.
         */
        offset: function (element, direction) {
            direction = (direction === 'left') ? 'offsetLeft' : 'offsetTop';
            var offset = 0;
            while (element) {
                offset += element[direction];
                element = element.offsetParent;
            }
            return offset;
        }
    };
    /**
     * Get an unique ID.
     *
     * @return {string} An unique ID.
     */
    Mmenu.getUniqueId = (function () {
        var id = 0;
        //	Using a factory for the "id" local var.
        return function () {
            return 'mm-guid-' + id++;
        };
    })();
    return Mmenu;
}());
(function ($) {
    /**
     * jQuery plugin mmenu.
     */
    $.fn['mmenu'] = function (opts, conf) {
        var $result = $();
        this.each(function (e, element) {
            //	Don't proceed if the element already is a mmenu.
            if (element.mmenu) {
                return;
            }
            var menu = new Mmenu(element, opts, conf), $menu = $(menu.node.menu);
            //	Store the API.
            $menu.data('mmenu', menu.API);
            $result = $result.add($menu);
        });
        return $result;
    };
})(jQuery || Zepto || cash);

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

Mmenu.addons.scrollBugFix = function () {
    var _this = this;
    //	The scrollBugFix add-on fixes a scrolling bug
    //		1) on touch devices
    //		2) in an off-canvas menu 
    //		3) that -when opened- blocks the UI from interaction 
    if (!Mmenu.support.touch || // 1
        !this.opts.offCanvas || // 2
        !this.opts.offCanvas.blockUI // 3
    ) {
        return;
    }
    var opts = this.opts.scrollBugFix;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            fix: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	Extend shorthand options
    this.opts.scrollBugFix = Mmenu.extend(opts, Mmenu.options.scrollBugFix);
    if (!opts.fix) {
        return;
    }
    //	When opening the menu, scroll to the top of the current opened panel.
    this.bind('open:start', function () {
        Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0].scrollTop = 0;
    });
    this.bind('initMenu:after', function () {
        //	Prevent the body from scrolling
        Mmenu.$(document)
            .off('touchmove.mm-scrollBugFix')
            .on('touchmove.mm-scrollBugFix', function (evnt) {
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                evnt.preventDefault();
            }
        });
        var scrolling = false;
        Mmenu.$('body')
            .off('touchstart.mm-scrollBugFix')
            .on('touchstart.mm-scrollBugFix', '.mm-panels > .mm-panel', function (evnt) {
            var panel = evnt.currentTarget;
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                if (!scrolling) {
                    //	Since we're potentially scrolling the panel in the onScroll event, 
                    //	this little hack prevents an infinite loop.
                    scrolling = true;
                    if (panel.scrollTop === 0) {
                        panel.scrollTop = 1;
                    }
                    else if (panel.scrollHeight === panel.scrollTop + panel.offsetHeight) {
                        panel.scrollTop -= 1;
                    }
                    //	End of infinite loop preventing hack.
                    scrolling = false;
                }
            }
        })
            .off('touchmove.mm-scrollBugFix')
            .on('touchmove.mm-scrollBugFix', '.mm-panels > .mm-panel', function (evnt) {
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                var panel = evnt.currentTarget;
                console.log(panel);
                if (panel.scrollHeight > panel.clientHeight) {
                    evnt.stopPropagation();
                }
            }
        });
        //	Fix issue after device rotation change
        Mmenu.$('window')
            .on('orientationchange.mm-scrollBugFix', function (evnt) {
            var panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
            panel.scrollTop = 0;
            //	Apparently, changing the overflow-scrolling property triggers some event :)
            panel.style['-webkit-overflow-scrolling'] = 'auto';
            panel.style['-webkit-overflow-scrolling'] = 'touch';
        });
    });
};
//	Default options and configuration.
Mmenu.options.scrollBugFix = {
    fix: true
};

return Mmenu;
}));
