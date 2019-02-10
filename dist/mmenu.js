/*!
 * mmenu.js v8.0.0
 * mmenujs.com
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
        this.evnt = {};
        this.clck = [];
        //	Get menu node from string or element.
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
            var parent = panel['mmParent'];
            while (parent) {
                parent = parent.closest('.mm-panel');
                if (parent) {
                    if (!parent.parentElement.matches('.mm-listitem_vertical')) {
                        parent.classList.add('mm-panel_opened-parent');
                    }
                    parent = parent['mmParent'];
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
        this.node.menu['mmenu'] = this.API;
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
        Mmenu.DOM.children(this.node.menu)
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
                        var panel = Mmenu.DOM.find(_this.node.menu, href)[0];
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
            var wrapper = Mmenu.DOM.create('div');
            panel.before(wrapper);
            wrapper.append(panel);
            panel = wrapper;
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
            parent['mmChild'] = panel;
            panel['mmParent'] = parent;
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
        var parent = panel['mmParent'], navbar = Mmenu.DOM.create('div.mm-navbar');
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
            title = this._getPanelTitle(panel, opener_1.textContent);
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
        var parent = panel['mmParent'];
        if (parent && parent.matches('.mm-listitem')) {
            if (!Mmenu.DOM.children(parent, '.mm-btn').length) {
                var item = Mmenu.DOM.children(parent, 'a, span')[0];
                if (item) {
                    var button = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-listitem__btn');
                    button.setAttribute('href', '#' + panel.id);
                    item.parentElement.insertBefore(button, item.nextSibling);
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
        document.body.addEventListener('click', function (evnt) {
            var target = evnt.target;
            if (!target.matches('a[href]')) {
                target = target.closest('a[href]');
                if (!target) {
                    return;
                }
            }
            var args = {
                inMenu: target.closest('.mm-menu') === _this.node.menu,
                inListview: target.matches('.mm-listitem > a'),
                toExternal: target.matches('[rel="external"]') || target.matches('[target="_blank"]')
            };
            var onClick = {
                close: null,
                setSelected: null,
                preventDefault: target.getAttribute('href').slice(0, 1) == '#'
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
     * @param 	{HTMLElement}			panel 		Panel to search in.
     * @param 	{string|Function} 		[dfault] 	Fallback/default title.
     * @return	{string}							The title for the panel.
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
     * @param {HTMLElement} 	eelement 	Scope for the function.
     * @param {function}		func		Function to invoke.
     * @param {number}			duration	The duration of the animation (for the fallback).
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
    /**	Available add-ons for the plugin. */
    Mmenu.addons = {};
    /** Available wrappers for the plugin. */
    Mmenu.wrappers = {};
    /**	Globally used HTMLElements. */
    Mmenu.node = {};
    /** Globally used EventListeners. */
    Mmenu.evnt = {};
    /**	Features supported by the browser. */
    Mmenu.support = {
        touch: 'ontouchstart' in window || (navigator.msMaxTouchPoints ? true : false) || false
    };
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
    /** Set of DOM-traversing, -manupulation and -measuring methods. */
    Mmenu.DOM = {
        /**
         * Create an element with classname.
         *
         * @param 	{string}		selector	The nodeName and classnames for the element to create.
         * @return	{HTMLElement}				The created element.
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
         * @return	{array}					Array of preceding elements that match the selector.
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
         * Find all previous siblings matching the selecotr.
         *
         * @param 	{HTMLElement} 	element Element to start searching from.
         * @param 	{string}		filter	The filter to match.
         * @return	{array}					Array of previous siblings that match the selector.
         */
        prevAll: function (element, filter) {
            /** Array of previous siblings that match the selector. */
            var previous = [];
            /** Current element in the loop */
            var current = element.previousElementSibling;
            while (current) {
                if (!filter || current.matches(filter)) {
                    previous.push(current);
                }
                current = current.previousElementSibling;
            }
            return previous;
        },
        /**
         * Get an element offset relative to the document.
         *
         * @param 	{HTMLElement}	 element 			Element to start measuring from.
         * @param 	{string}		 [direction=top] 	Offset top or left.
         * @return	{number}							The element offset relative to the document.
         */
        offset: function (element, direction) {
            return element.getBoundingClientRect()[direction] + document.body[(direction === 'left') ? 'scrollLeft' : 'scrollTop'];
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
            return 'mm-' + id++;
        };
    })();
    return Mmenu;
}());

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

(function ($) {
    if ($) {
        /**
         * jQuery plugin mmenu.
         */
        $.fn['mmenu'] = function (options, configs) {
            var $result = $();
            this.each(function (e, element) {
                //	Don't proceed if the element already is a mmenu.
                if (element['mmenu']) {
                    return;
                }
                var menu = new Mmenu(element, options, configs), $menu = $(menu.node.menu);
                //	Store the API.
                $menu.data('mmenu', menu.API);
                $result = $result.add($menu);
            });
            return $result;
        };
    }
})(window['jQuery'] || window['Zepto'] || null);

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

Mmenu.addons.offCanvas = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = this.opts.offCanvas, configs = this.conf.offCanvas;
    //	Add methods to the API
    this._api.push('open', 'close', 'setPage');
    //	Extend shorthand options
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.offCanvas = Mmenu.extend(options, Mmenu.options.offCanvas);
    this.conf.offCanvas = Mmenu.extend(configs, Mmenu.configs.offCanvas);
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
        document.querySelector(configs.menu.insertSelector)[configs.menu.insertMethod](_this.node.menu);
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
                    var api = menu['mmenu'];
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
    var options = this.opts.offCanvas;
    //	Close other menus
    this.closeAllOthers();
    //	Store style and position
    Mmenu.node.page['mmStyle'] = Mmenu.node.page.getAttribute('style') || '';
    //	Trigger window-resize to measure height
    Mmenu.evnt.windowResizeOffCanvas.call({});
    var clsn = ['mm-wrapper_opened'];
    //	Add options
    if (options.blockUI) {
        clsn.push('mm-wrapper_blocking');
    }
    if (options.blockUI == 'modal') {
        clsn.push('mm-wrapper_modal');
    }
    if (options.moveBackground) {
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
        Mmenu.node.page.setAttribute('style', Mmenu.node.page['mmStyle']);
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
            var api = menu['mmenu'];
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
    var configs = this.conf.offCanvas;
    //	If no page was specified, find it.
    if (!page) {
        /** Array of elements that are / could be "the page". */
        var pages = (typeof configs.page.selector == 'string')
            ? Mmenu.DOM.find(document.body, configs.page.selector)
            : Mmenu.DOM.children(document.body, configs.page.nodetype);
        //	Filter out elements that are absolutely not "the page".
        pages = pages.filter(function (page) { return !page.matches('.mm-menu, .mm-wrapper__blocker'); });
        //	Filter out elements that are configured to not be "the page".
        if (configs.page.noSelector.length) {
            pages = pages.filter(function (page) { return !page.matches(configs.page.noSelector.join(', ')); });
        }
        //	Wrap multiple pages in a single element.
        if (pages.length > 1) {
            var wrapper_1 = Mmenu.DOM.create('div');
            pages[0].before(wrapper_1);
            pages.forEach(function (page) {
                wrapper_1.append(page);
            });
            pages = [wrapper_1];
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
    if (!Mmenu.evnt.windowKeydownOffCanvasTab) {
        Mmenu.evnt.windowKeydownOffCanvasTab = function (evnt) {
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                if (evnt.keyCode == 9) {
                    evnt.preventDefault();
                    return false;
                }
            }
        };
        window.addEventListener('keydown', Mmenu.evnt.windowKeydownOffCanvasTab);
    }
    //	Set "page" element min-height to window height
    var oldHeight, newHeight;
    if (!Mmenu.evnt.resizeOffCanvas) {
        Mmenu.evnt.windowResizeOffCanvas = function (evnt) {
            if (Mmenu.node.page) {
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    newHeight = window.innerHeight;
                    if (newHeight != oldHeight) {
                        oldHeight = newHeight;
                        Mmenu.node.page.style.minHeight = newHeight + 'px';
                    }
                }
            }
        };
        window.addEventListener('keydown', Mmenu.evnt.windowResizeOffCanvas);
    }
};
/**
 * Initialize "blocker" node
 */
Mmenu.prototype._initBlocker = function () {
    var _this = this;
    var options = this.opts.offCanvas, configs = this.conf.offCanvas;
    this.trigger('initBlocker:before');
    if (!options.blockUI) {
        return;
    }
    //	Create the blocker node.
    if (!Mmenu.node.blck) {
        var blck = Mmenu.DOM.create('div.mm-wrapper__blocker.mm-slideout');
        blck.innerHTML = '<a></a>';
        //	Append the blocker node to the body.
        document.querySelector(configs.menu.insertSelector)
            .append(blck);
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
        if (!document.documentElement.matches('.mm-wrapper_modal')) {
            _this.close();
        }
    };
    Mmenu.node.blck.addEventListener('mousedown', closeMenu); // 1
    Mmenu.node.blck.addEventListener('touchstart', closeMenu); // 2
    Mmenu.node.blck.addEventListener('touchmove', closeMenu); // 3
    this.trigger('initBlocker:after');
};

Mmenu.addons.screenReader = function () {
    var _this = this;
    var options = this.opts.screenReader, configs = this.conf.screenReader;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            aria: options,
            text: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    //opts = this.opts.screenReader = jQuery.extend( true, {}, Mmenu.options.screenReader, opts );
    this.opts.screenReader = Mmenu.extend(options, Mmenu.options.screenReader);
    //	Add Aria-* attributes
    if (options.aria) {
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
        if (options.text) {
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
    if (options.text) {
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
                    button.innerHTML = Mmenu.sr_text(_this.i18n(configs.text.closeSubmenu));
                }
            }
        });
        //	Add text to the next-buttons.
        this.bind('initListview:after', function (panel) {
            var parent = panel['mmParent'];
            if (parent) {
                var next = Mmenu.DOM.children(parent, '.mm-btn_next')[0];
                if (next) {
                    var text = _this.i18n(configs.text[next.parentElement.matches('.mm-listitem_vertical') ? 'toggleSubmenu' : 'openSubmenu']);
                    next.innerHTML += Mmenu.sr_text(text);
                }
            }
        });
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
    var options = this.opts.scrollBugFix;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            fix: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	Extend shorthand options
    this.opts.scrollBugFix = Mmenu.extend(options, Mmenu.options.scrollBugFix);
    if (!options.fix) {
        return;
    }
    //	When opening the menu, scroll to the top of the current opened panel.
    this.bind('open:start', function () {
        Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0].scrollTop = 0;
    });
    this.bind('initMenu:after', function () {
        //	Only needs to be done once per page.
        if (!_this.vars.scrollBugFixed) {
            var scrolling_1 = false;
            //	Prevent the body from scrolling.
            document.addEventListener('touchmove', function (evnt) {
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    evnt.preventDefault();
                }
            });
            document.body.addEventListener('touchstart', function (evnt) {
                var panel = evnt.target;
                if (!panel.matches('.mm-panels > .mm-panel')) {
                    return;
                }
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    if (!scrolling_1) {
                        //	Since we're potentially scrolling the panel in the onScroll event, 
                        //	this little hack prevents an infinite loop.
                        scrolling_1 = true;
                        if (panel.scrollTop === 0) {
                            panel.scrollTop = 1;
                        }
                        else if (panel.scrollHeight === panel.scrollTop + panel.offsetHeight) {
                            panel.scrollTop -= 1;
                        }
                        //	End of infinite loop preventing hack.
                        scrolling_1 = false;
                    }
                }
            });
            document.body.addEventListener('touchmove', function (evnt) {
                var panel = evnt.target;
                if (!panel.matches('.mm-panels > .mm-panel')) {
                    return;
                }
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    if (panel.scrollHeight > panel.clientHeight) {
                        evnt.stopPropagation();
                    }
                }
            });
        }
        _this.vars.scrollBugFixed = true;
        //	Fix issue after device rotation change.
        window.addEventListener('orientationchange', function (evnt) {
            var panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
            panel.scrollTop = 0;
            //	Apparently, changing the overflow-scrolling property triggers some event :)
            panel.style['-webkit-overflow-scrolling'] = 'auto';
            panel.style['-webkit-overflow-scrolling'] = 'touch';
        });
    });
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

Mmenu.options.offCanvas = {
    blockUI: true,
    moveBackground: true
};

Mmenu.configs.screenReader = {
    text: {
        closeMenu: 'Close menu',
        closeSubmenu: 'Close submenu',
        openSubmenu: 'Open submenu',
        toggleSubmenu: 'Toggle submenu'
    }
};

Mmenu.options.screenReader = {
    aria: true,
    text: true
};

Mmenu.options.scrollBugFix = {
    fix: true
};

Mmenu.i18n({
    'Menu': 'Menü'
}, 'de');

Mmenu.i18n({
    'Menu': 'منو'
}, 'fa');

Mmenu.i18n({
    'Menu': 'Menu'
}, 'nl');

Mmenu.i18n({
    'Menu': 'Меню'
}, 'ru');

Mmenu.i18n({
    'Close menu': 'Menü schließen',
    'Close submenu': 'Untermenü schließen',
    'Open submenu': 'Untermenü öffnen',
    'Toggle submenu': 'Untermenü wechseln'
}, 'de');

Mmenu.i18n({
    'Close menu': 'بستن منو',
    'Close submenu': 'بستن زیرمنو',
    'Open submenu': 'بازکردن زیرمنو',
    'Toggle submenu': 'سوییچ زیرمنو'
}, 'fa');

Mmenu.i18n({
    'Close menu': 'Menu sluiten',
    'Close submenu': 'Submenu sluiten',
    'Open submenu': 'Submenu openen',
    'Toggle submenu': 'Submenu wisselen'
}, 'nl');

Mmenu.i18n({
    'Close menu': 'Закрыть меню',
    'Close submenu': 'Закрыть подменю',
    'Open submenu': 'Открыть подменю',
    'Toggle submenu': 'Переключить подменю'
}, 'ru');

Mmenu.addons.autoHeight = function () {
    var _this = this;
    var options = this.opts.autoHeight;
    //	Extend shorthand options
    if (typeof options == 'boolean' && options) {
        options = {
            height: 'auto'
        };
    }
    if (typeof options == 'string') {
        options = {
            height: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.autoHeight = Mmenu.extend(options, Mmenu.options.autoHeight);
    if (options.height != 'auto' && options.height != 'highest') {
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
        if (options.height == 'auto') {
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
        else if (options.height == 'highest') {
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
    if (options.height == 'highest') {
        this.bind('initPanels:after', setHeight); //	TODO: passes array for "panel" argument
    }
    if (options.height == 'auto') {
        this.bind('updateListview', setHeight); //	TODO? does not pass "panel" argument
        this.bind('openPanel:start', setHeight);
        this.bind('closePanel', setHeight);
    }
};

Mmenu.addons.backButton = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = this.opts.backButton;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            close: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.backButton = Mmenu.extend(options, Mmenu.options.backButton);
    var _menu = '#' + this.node.menu.id;
    //	Close menu
    if (options.close) {
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
    if (options.open) {
        window.addEventListener('popstate', function (evnt) {
            if (!_this.vars.opened && location.hash == _menu) {
                _this.open();
            }
        });
    }
};

Mmenu.addons.counters = function () {
    var _this = this;
    var options = this.opts.counters;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options,
            count: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.addTo == 'panels') {
        options.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.counters = Mmenu.extend(options, Mmenu.options.counters);
    //	Refactor counter class
    this.bind('initListview:after', function (panel) {
        var cntrclss = _this.conf.classNames.counters.counter, counters = panel.querySelectorAll('.' + cntrclss);
        counters.forEach(function (counter) {
            Mmenu.refactorClass(counter, cntrclss, 'mm-counter');
        });
    });
    //	Add the counters after a listview is initiated.
    if (options.add) {
        this.bind('initListview:after', function (panel) {
            if (!panel.matches(options.addTo)) {
                return;
            }
            var parent = panel['mmParent'];
            if (parent) {
                //	Check if no counter already excists.
                if (!parent.querySelector('.mm-counter')) {
                    var counter = Mmenu.DOM.create('span.mm-counter');
                    var btn = Mmenu.DOM.children(parent, '.mm-btn')[0];
                    if (btn) {
                        btn.prepend(counter);
                    }
                }
            }
        });
    }
    if (options.count) {
        function count(panel) {
            var panels = panel ? [panel] : Mmenu.DOM.children(this.node.pnls, '.mm-panel');
            panels.forEach(function (panel) {
                var parent = panel['mmParent'];
                if (!parent) {
                    return;
                }
                var counter = parent.querySelector('.mm-counter');
                if (!counter) {
                    return;
                }
                var listitems = [];
                Mmenu.DOM.children(panel, '.mm-listview')
                    .forEach(function (listview) {
                    listitems.push.apply(listitems, Mmenu.DOM.children(listview));
                });
                counter.innerHTML = Mmenu.filterListItems(listitems).length.toString();
            });
        }
        ;
        this.bind('initListview:after', count);
        this.bind('updateListview', count);
    }
};

Mmenu.addons.columns = function () {
    var _this = this;
    var options = this.opts.columns;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options == 'number') {
        options = {
            add: true,
            visible: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (typeof options.visible == 'number') {
        options.visible = {
            min: options.visible,
            max: options.visible
        };
    }
    //	/Extend shorthand options
    this.opts.columns = Mmenu.extend(options, Mmenu.options.columns);
    //	Add the columns
    if (options.add) {
        options.visible.min = Math.max(1, Math.min(6, options.visible.min));
        options.visible.max = Math.max(options.visible.min, Math.min(6, options.visible.max));
        var colm = '', colp = '';
        for (var i = 0; i <= options.visible.max; i++) {
            colm += ' mm-menu_columns-' + i;
            colp += ' mm-panel_columns-' + i;
        }
        if (colm.length) {
            colm = colm.slice(1);
            colp = colp.slice(1);
        }
        var rmvc = colp + ' mm-panel_opened mm-panel_opened-parent mm-panel_highest';
        //	Close all later opened panels
        this.bind('openPanel:before', function (panel) {
            var parent;
            if (panel) {
                parent = panel['mmParent'];
            }
            if (!parent) {
                return;
            }
            parent = parent.closest('.mm-panel');
            if (!parent) {
                return;
            }
            var classname = parent.className;
            if (!classname.length) {
                return;
            }
            classname = classname.split('mm-panel_columns-')[1];
            if (!classname) {
                return;
            }
            var colnr = parseInt(classname.split(' ')[0], 10) + 1;
            while (colnr > 0) {
                panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_columns-' + colnr)[0];
                if (panel) {
                    colnr++;
                    panel.classList.remove(rmvc);
                    panel.classList.add('mm-hidden');
                }
                else {
                    colnr = -1;
                    break;
                }
            }
        });
        this.bind('openPanel:start', function (panel) {
            var _a;
            var _num = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened-parent').length;
            if (!panel.matches('.mm-panel_opened-parent')) {
                _num++;
            }
            _num = Math.min(options.visible.max, Math.max(options.visible.min, _num));
            (_a = _this.node.menu.classList).remove.apply(_a, colm.split(' '));
            _this.node.menu.classList.add('mm-menu_columns-' + _num);
            var panels = [];
            Mmenu.DOM.children(_this.node.pnls, '.mm-panel')
                .forEach(function (panel) {
                var _a;
                (_a = panel.classList).remove.apply(_a, colp.split(' '));
                if (panel.matches('.mm-panel_opened-parent')) {
                    panels.push(panel);
                }
            });
            //	TODO: check if not in array?
            panels.push(panel);
            panels.slice(-options.visible.max)
                .forEach(function (panel, p) {
                panel.classList.add('mm-panel_columns-' + p);
            });
        });
    }
};

Mmenu.addons.dividers = function () {
    var _this = this;
    var options = this.opts.dividers;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options,
            fixed: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.addTo == 'panels') {
        options.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.dividers = Mmenu.extend(options, Mmenu.options.dividers);
    //	Add classname to the menu to specify the type of the dividers
    if (options.type) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_dividers-' + options.type);
        });
    }
    //	Add dividers
    if (options.add) {
        this.bind('initListview:after', function (panel) {
            if (!panel.matches(options.addTo)) {
                return;
            }
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach(function (divider) {
                divider.remove();
            });
            Mmenu.DOM.find(panel, '.mm-listview')
                .forEach(function (listview) {
                var lastletter = '', listitems = Mmenu.DOM.children(listview);
                Mmenu.filterListItems(listitems)
                    .forEach(function (listitem) {
                    var letter = Mmenu.DOM.children(listitem, '.mm-listitem__text')[0]
                        .textContent.trim().toLowerCase()[0];
                    if (letter.length && letter != lastletter) {
                        lastletter = letter;
                        var divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.textContent = letter;
                        listview.insertBefore(divider, listitem);
                    }
                });
            });
        });
    }
    //	Fixed dividers
    if (options.fixed) {
        //	Add the fixed divider
        this.bind('initPanels:after', function (panels) {
            if (!_this.node.fixeddivider) {
                var listview = Mmenu.DOM.create('ul.mm-listview.mm-listview_fixeddivider'), listitem = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                listview.append(listitem);
                _this.node.pnls.append(listview);
                _this.node.fixeddivider = listitem;
            }
        });
        function setValue(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            if (!panel || window.getComputedStyle(panel).display == 'none') {
                return;
            }
            var scrl = panel.scrollTop, text = '';
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach(function (divider) {
                if (!divider.matches('.mm-hidden')) {
                    if (divider.offsetTop + scrl < scrl + 1) {
                        text = divider.innerHTML;
                    }
                }
            });
            this.node.fixeddivider.innerHTML = text;
            this.node.pnls.classList[text.length ? 'add' : 'remove']('mm-panels_dividers');
        }
        ;
        //	Set correct value when 
        //		1) opening the menu,
        //		2) opening a panel,
        //		3) after updating listviews and
        //		4) after scrolling a panel
        this.bind('open:start', setValue); // 1
        this.bind('openPanel:start', setValue); // 2
        this.bind('updateListview', setValue); // 3	//	TODO? does not pass "panel" argument.
        this.bind('initPanel:after', function (panel) {
            panel.addEventListener('scroll', function () {
                if (panel.matches('.mm-panel_opened')) {
                    setValue.call(_this, panel);
                }
            }, { passive: true });
        });
    }
};

Mmenu.addons.drag = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    if (typeof Hammer != 'function' || Hammer.VERSION < 2) {
        return;
    }
    var options = this.opts.drag, configs = this.conf.drag;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            menu: options,
            panels: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (typeof options.menu == 'boolean') {
        options = {
            open: options.menu
        };
    }
    if (typeof options.menu != 'object') {
        options.menu = {};
    }
    if (typeof options.panels == 'boolean') {
        options.panels = {
            close: options.panels
        };
    }
    if (typeof options.panels != 'object') {
        options.panels = {};
    }
    //	/Extend shorthand options
    this.opts.drag = Mmenu.extend(options, Mmenu.options.drag);
    function minMax(val, min, max) {
        if (val < min) {
            val = min;
        }
        if (val > max) {
            val = max;
        }
        return val;
    }
    //	Drag open the menu
    if (options.menu.open) {
        this.bind('setPage:after', function () {
            //	defaults for "left"
            var drag = {
                events: 'panleft panright',
                typeLower: 'x',
                typeUpper: 'X',
                open_dir: 'right',
                close_dir: 'left',
                negative: false
            };
            var _dimension = 'width', _winDimension = 'innerWidth', _direction = drag.open_dir;
            var doPanstart = function (pos) {
                if (pos <= options.menu.maxStartPos) {
                    _stage = 1;
                }
            };
            var getSlideNodes = function () {
                return Mmenu.DOM.find(document.body, '.mm-slideout');
            };
            var _stage = 0, _distance = 0, _maxDistance = 0;
            var new_distance, drag_distance;
            //	Find menu position from Positioning extension
            var x = _this.opts.extensions['all'];
            var position = (typeof x == 'undefined')
                ? 'left'
                : (x.indexOf('mm-menu_position-right') > -1)
                    ? 'right'
                    : (x.indexOf('mm-menu_position-top') > -1)
                        ? 'top'
                        : (x.indexOf('mm-menu_position-bottom') > -1)
                            ? 'bottom'
                            : 'left';
            var zposition = (typeof x == 'undefined')
                ? 'back'
                : (x.indexOf('mm-menu_position-top') > -1) ||
                    (x.indexOf('mm-menu_position-bottom') > -1) ||
                    (x.indexOf('mm-menu_position-front') > -1)
                    ? 'front'
                    : 'back';
            switch (position) {
                case 'top':
                case 'bottom':
                    drag.events = 'panup pandown';
                    drag.typeLower = 'y';
                    drag.typeUpper = 'Y';
                    _dimension = 'height';
                    _winDimension = 'innerHeight';
                    break;
            }
            switch (position) {
                case 'right':
                case 'bottom':
                    drag.negative = true;
                    doPanstart = function (pos) {
                        if (pos >= window[_winDimension] - options.menu.maxStartPos) {
                            _stage = 1;
                        }
                    };
                    break;
            }
            switch (position) {
                case 'right':
                    drag.open_dir = 'left';
                    drag.close_dir = 'right';
                    break;
                case 'top':
                    drag.open_dir = 'down';
                    drag.close_dir = 'up';
                    break;
                case 'bottom':
                    drag.open_dir = 'up';
                    drag.close_dir = 'down';
                    break;
            }
            switch (zposition) {
                case 'front':
                    getSlideNodes = function () {
                        return [this.node.menu];
                    };
                    break;
            }
            var slideOutNodes;
            var dragNode = Mmenu.valueOrFn(_this.node.menu, options.menu.node, Mmenu.node.page);
            if (typeof dragNode == 'string') {
                dragNode = document.querySelector(dragNode);
            }
            //	Bind events
            var _hammer = new Hammer(dragNode, _this.opts.drag.vendors.hammer);
            _hammer
                .on('panstart', function (evnt) {
                doPanstart.call(_this, evnt.center[drag.typeLower]);
                slideOutNodes = getSlideNodes.call(_this);
                _direction = drag.open_dir;
            });
            _hammer
                .on(drag.events + ' panend', function (evnt) {
                if (_stage > 0) {
                    evnt.preventDefault();
                }
            });
            _hammer
                .on(drag.events, function (evnt) {
                new_distance = evnt['delta' + drag.typeUpper];
                if (drag.negative) {
                    new_distance = -new_distance;
                }
                if (new_distance != _distance) {
                    _direction = (new_distance >= _distance) ? drag.open_dir : drag.close_dir;
                }
                _distance = new_distance;
                if (_distance > options.menu.threshold) {
                    if (_stage == 1) {
                        if (document.documentElement.matches('.mm-wrapper_opened')) {
                            return;
                        }
                        _stage = 2;
                        _this._openSetup();
                        _this.trigger('open:start');
                        document.documentElement.classList.add('mm-wrapper_dragging');
                        _maxDistance = minMax(window[_winDimension] * configs.menu[_dimension].perc, configs.menu[_dimension].min, configs.menu[_dimension].max);
                    }
                }
                if (_stage == 2) {
                    drag_distance = minMax(_distance, 10, _maxDistance) - (zposition == 'front' ? _maxDistance : 0);
                    if (drag.negative) {
                        drag_distance = -drag_distance;
                    }
                    var css_value_1 = 'translate' + drag.typeUpper + '(' + drag_distance + 'px )';
                    slideOutNodes.forEach(function (node) {
                        node.style['-webkit-transform'] = '-webkit-' + css_value_1;
                        node.style['transform'] = css_value_1;
                    });
                }
            });
            _hammer
                .on('panend', function (evnt) {
                if (_stage == 2) {
                    document.documentElement.classList.remove('mm-wrapper_dragging');
                    slideOutNodes.forEach(function (node) {
                        node.style['-webkit-transform'] = '';
                        node.style['transform'] = '';
                    });
                    _this[_direction == drag.open_dir ? '_openFinish' : 'close']();
                }
                _stage = 0;
            });
        });
    }
    //	Drag close panels
    if (options.panels.close) {
        this.bind('initPanel:after', function (panel) {
            var parent = panel['mmParent '];
            if (parent) {
                parent = parent.closest('.mm-panel');
                var _hammer = new Hammer(panel, _this.opts.drag.vendors.hammer), timeout = null;
                _hammer
                    .on('panright', function (e) {
                    if (timeout) {
                        return;
                    }
                    _this.openPanel(parent);
                    //	prevent dragging while panel still open.
                    timeout = setTimeout(function () {
                        clearTimeout(timeout);
                        timeout = null;
                    }, _this.conf.openingInterval + _this.conf.transitionDuration);
                });
            }
        });
    }
};

Mmenu.addons.dropdown = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = this.opts.dropdown, configs = this.conf.dropdown;
    //	Extend shorthand options
    if (typeof options == 'boolean' && options) {
        options = {
            drop: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (typeof options.position == 'string') {
        options.position = {
            of: options.position
        };
    }
    //	/Extend shorthand options
    this.opts.dropdown = Mmenu.extend(options, Mmenu.options.dropdown);
    if (!options.drop) {
        return;
    }
    var button;
    this.bind('initMenu:after', function () {
        _this.node.menu.classList.add('mm-menu_dropdown');
        if (typeof options.position.of != 'string') {
            var id = _this.vars.orgMenuId;
            if (id && id.length) {
                options.position.of = '[href="#' + id + '"]';
            }
        }
        if (typeof options.position.of != 'string') {
            return;
        }
        //	Get the button to put the menu next to
        button = Mmenu.DOM.find(document.body, options.position.of)[0];
        //	Emulate hover effect
        var events = options.event.split(' ');
        if (events.length == 1) {
            events[1] = events[0];
        }
        if (events[0] == 'hover') {
            button.addEventListener('mouseenter', function (evnt) {
                _this.open();
            }, { passive: true });
        }
        if (events[1] == 'hover') {
            _this.node.menu.addEventListener('mouseleave', function (evnt) {
                _this.close();
            }, { passive: true });
        }
    });
    //	Add/remove classname and style when opening/closing the menu
    this.bind('open:start', function () {
        _this.node.menu['mmStyle'] = _this.node.menu.getAttribute('style');
        document.documentElement.classList.add('mm-wrapper_dropdown');
    });
    this.bind('close:finish', function () {
        _this.node.menu.setAttribute('style', _this.node.menu['mmStyle']);
        document.documentElement.classList.remove('mm-wrapper_dropdown');
    });
    //	Update the position and sizes
    var getPosition = function (dir, obj) {
        var css = obj[0], cls = obj[1];
        var _scrollPos = dir == 'x' ? 'scrollLeft' : 'scrollTop', _outerSize = dir == 'x' ? 'offsetWidth' : 'offsetHeight', _startPos = dir == 'x' ? 'left' : 'top', _stopPos = dir == 'x' ? 'right' : 'bottom', _size = dir == 'x' ? 'width' : 'height', _winSize = dir == 'x' ? 'innerWidth' : 'innerHeight', _maxSize = dir == 'x' ? 'maxWidth' : 'maxHeight', _position = null;
        var scrollPos = document.documentElement[_scrollPos] || document.body[_scrollPos], startPos = Mmenu.DOM.offset(button, _startPos) - scrollPos, stopPos = startPos + button[_outerSize], windowSize = window[_winSize];
        var offs = configs.offset.button[dir] + configs.offset.viewport[dir];
        //	Position set in option
        if (options.position[dir]) {
            switch (options.position[dir]) {
                case 'left':
                case 'bottom':
                    _position = 'after';
                    break;
                case 'right':
                case 'top':
                    _position = 'before';
                    break;
            }
        }
        //	Position not set in option, find most space
        if (_position === null) {
            _position = (startPos + ((stopPos - startPos) / 2) < windowSize / 2) ? 'after' : 'before';
        }
        //	Set position and max
        var val, max;
        if (_position == 'after') {
            val = (dir == 'x') ? startPos : stopPos;
            max = windowSize - (val + offs);
            css[_startPos] = (val + configs.offset.button[dir]) + 'px';
            css[_stopPos] = 'auto';
            if (options.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'left' : 'top'));
            }
        }
        else {
            val = (dir == 'x') ? stopPos : startPos;
            max = val - offs;
            css[_stopPos] = 'calc( 100% - ' + (val - configs.offset.button[dir]) + 'px )';
            css[_startPos] = 'auto';
            if (options.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'right' : 'bottom'));
            }
        }
        if (options.fitViewport) {
            css[_maxSize] = Math.min(configs[_size].max, max) + 'px';
        }
        return [css, cls];
    };
    function position() {
        var _a;
        if (!this.vars.opened) {
            return;
        }
        this.node.menu.setAttribute('style', this.node.menu['mmStyle']);
        var obj = [{}, []];
        obj = getPosition.call(this, 'y', obj);
        obj = getPosition.call(this, 'x', obj);
        for (var s in obj[0]) {
            this.node.menu.style[s] = obj[0][s];
        }
        if (options.tip) {
            this.node.menu.classList.remove('mm-menu_tip-left', 'mm-menu_tip-right', 'mm-menu_tip-top', 'mm-menu_tip-bottom');
            (_a = this.node.menu.classList).add.apply(_a, obj[1]);
        }
    }
    ;
    this.bind('open:start', position);
    window.addEventListener('resize', function (evnt) {
        position.call(_this);
    }, { passive: true });
    if (!this.opts.offCanvas.blockUI) {
        window.addEventListener('scroll', function (evnt) {
            position.call(_this);
        }, { passive: true });
    }
};

Mmenu.addons.fixedElements = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var configs = this.conf.fixedElements;
    var _fixd, _stck, fixed, stick;
    this.bind('setPage:after', function (page) {
        //	Fixed elements
        _fixd = _this.conf.classNames.fixedElements.fixed;
        fixed = Mmenu.DOM.find(page, '.' + _fixd);
        fixed.forEach(function (fxd) {
            Mmenu.refactorClass(fxd, _fixd, 'mm-slideout');
        });
        document.querySelector(configs.fixed.insertSelector)[configs.fixed.insertMethod](fixed);
        //	Sticky elements
        _stck = _this.conf.classNames.fixedElements.sticky;
        Mmenu.DOM.find(page, '.' + _stck)
            .forEach(function (stick) {
            Mmenu.refactorClass(stick, _stck, 'mm-sticky');
        });
        stick = Mmenu.DOM.find(page, '.mm-sticky');
    });
    this.bind('open:start', function () {
        if (stick.length) {
            if (window.getComputedStyle(document.documentElement).overflow == 'hidden') {
                var scrollTop_1 = (document.documentElement.scrollTop || document.body.scrollTop) + configs.sticky.offset;
                stick.forEach(function (element) {
                    element.style.top = (parseInt(window.getComputedStyle(element).top, 10) + scrollTop_1) + 'px';
                });
            }
        }
    });
    this.bind('close:finish', function () {
        stick.forEach(function (element) {
            element.style.top = '';
        });
    });
};

Mmenu.addons.iconbar = function () {
    var _this = this;
    var options = this.opts.iconbar;
    //	Extend shorthand options
    if (Mmenu.typeof(options) == 'array') {
        options = {
            add: true,
            top: options
        };
    }
    //	/Extend shorthand options
    if (!options.add) {
        return;
    }
    var iconbar;
    ['top', 'bottom'].forEach(function (position, n) {
        var ctnt = options[position];
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
        if (options.type == 'tabs') {
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

Mmenu.addons.iconPanels = function () {
    var _this = this;
    var options = this.opts.iconPanels;
    var keepFirst = false;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options == 'number' ||
        typeof options == 'string') {
        options = {
            add: true,
            visible: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.visible == 'first') {
        keepFirst = true;
        options.visible = 1;
    }
    //	/Extend shorthand options
    this.opts.iconPanels = Mmenu.extend(options, Mmenu.options.iconPanels);
    options.visible = Math.min(3, Math.max(1, options.visible));
    options.visible++;
    //	Add the iconpanels
    if (options.add) {
        this.bind('initMenu:after', function () {
            var _a;
            var cls = ['mm-menu_iconpanel'];
            if (options.hideNavbar) {
                cls.push('mm-menu_hidenavbar');
            }
            if (options.hideDivider) {
                cls.push('mm-menu_hidedivider');
            }
            (_a = _this.node.menu.classList).add.apply(_a, cls);
        });
        var cls = '';
        if (!keepFirst) {
            for (var i = 0; i <= options.visible; i++) {
                cls += ' mm-panel_iconpanel-' + i;
            }
            if (cls.length) {
                cls = cls.slice(1);
            }
        }
        function setPanels(panel) {
            if (panel.parentElement.matches('.mm-listitem_vertical')) {
                return;
            }
            var panels = Mmenu.DOM.children(this.node.pnls, '.mm-panels');
            if (keepFirst) {
                panels.forEach(function (panel, p) {
                    panel.classList[p == 0 ? 'add' : 'remove']('mm-panel_iconpanel-first');
                });
            }
            else {
                //	Remove the "iconpanel" classnames from all panels.
                panels.forEach(function (panel) {
                    panel.classList.remove(cls);
                });
                //	Filter out panels that are not opened.
                panels = panels.filter(function (panel) { return panel.matches('.mm-panel_opened-parent'); });
                //	Add the current panel to the list.
                //	TODO: check for duplicate?
                panels.push(panel);
                //	Remove the "hidden" classname from all opened panels.
                panels.forEach(function (panel) {
                    panel.classList.remove('mm-hidden');
                });
                //	Slice the opened panels to the max visible amount.
                panels = panels.slice(-options.visible);
                //	Add the "iconpanel" classnames.
                panels.forEach(function (panel, p) {
                    panel.classList.add('mm-panel_iconpanel-' + p);
                });
            }
        }
        ;
        this.bind('openPanel:start', setPanels);
        this.bind('initPanels:after', function (panels) {
            setPanels.call(_this, Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0]);
        });
        this.bind('initListview:after', function (panel) {
            if (options.blockPanel &&
                !panel.parentElement.matches('.mm-listitem_vertical') &&
                !Mmenu.DOM.children(panel, '.mm-panel__blocker')[0]) {
                var anchor = Mmenu.DOM.create('a.mm-panel__blocker');
                anchor.setAttribute('href', panel.closest('.mm-panel').id);
                panel.prepend(anchor);
            }
        });
    }
};

Mmenu.addons.keyboardNavigation = function () {
    var _this = this;
    //	Keyboard navigation on touchscreens opens the virtual keyboard :/
    //	Lets prevent that.
    if (Mmenu.support.touch) {
        return;
    }
    var options = this.opts.keyboardNavigation;
    //	Extend shorthand options
    if (typeof options == 'boolean' || typeof options == 'string') {
        options = {
            enable: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.keyboardNavigation = Mmenu.extend(options, Mmenu.options.keyboardNavigation);
    //	Enable keyboard navigation
    if (options.enable) {
        var menuStart_1 = Mmenu.DOM.create('button.mm-tabstart'), menuEnd_1 = Mmenu.DOM.create('button.mm-tabend'), blockerEnd_1 = Mmenu.DOM.create('button.mm-tabend');
        this.bind('initMenu:after', function () {
            if (options.enhance) {
                _this.node.menu.classList.add('mm-menu_keyboardfocus');
            }
            _this._initWindow_keyboardNavigation(options.enhance);
        });
        this.bind('initOpened:before', function () {
            _this.node.menu.prepend(menuStart_1);
            _this.node.menu.append(menuEnd_1);
            Mmenu.DOM.children(_this.node.menu, '.mm-navbars-top, .mm-navbars-bottom')
                .forEach(function (navbars) {
                navbars.querySelectorAll('.mm-navbar__title')
                    .forEach(function (title) {
                    title.setAttribute('tabindex', '-1');
                });
            });
        });
        this.bind('initBlocker:after', function () {
            Mmenu.node.blck.append(blockerEnd_1);
            Mmenu.DOM.children(Mmenu.node.blck, 'a')[0]
                .classList.add('mm-tabstart');
        });
        var focusable = 'input, select, textarea, button, label, a[href]';
        function setFocus(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            var focus = null;
            //	Focus already is on an element in a navbar in this menu.
            var navbar = document.activeElement.closest('.mm-navbar');
            if (navbar) {
                if (navbar.closest('.mm-menu') == this.node.menu) {
                    return;
                }
            }
            //	Set the focus to the first focusable element by default.
            if (options.enable == 'default') {
                //	First visible anchor in a listview in the current panel.
                focus = Mmenu.DOM.find(panel, '.mm-listview a[href]:not(.mm-hidden)')[0];
                //	First focusable and visible element in the current panel.
                if (!focus) {
                    focus = Mmenu.DOM.find(panel, focusable + ':not(.mm-hidden)')[0];
                }
                //	First focusable and visible element in a navbar.
                if (!focus) {
                    var elements_1 = [];
                    Mmenu.DOM.children(this.node.menu, '.mm-navbars_top, .mm-navbars_bottom')
                        .forEach(function (navbar) {
                        elements_1.push.apply(elements_1, Mmenu.DOM.find(navbar, focusable + ':not(.mm-hidden)'));
                    });
                    focus = elements_1[0];
                }
            }
            //	Default.
            if (!focus) {
                focus = Mmenu.DOM.children(this.node.menu, '.mm-tabstart')[0];
            }
            if (focus) {
                focus.focus();
            }
        }
        this.bind('open:finish', setFocus);
        this.bind('openPanel:finish', setFocus);
        //	Add screenreader / aria support.
        this.bind('initOpened:after:sr-aria', function () {
            [_this.node.menu, Mmenu.node.blck].forEach(function (element) {
                Mmenu.DOM.children(element, '.mm-tabstart, .mm-tabend')
                    .forEach(function (tabber) {
                    Mmenu.sr_aria(tabber, 'hidden', true);
                    Mmenu.sr_role(tabber, 'presentation');
                });
            });
        });
    }
};
/**
 * Initialize the window.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
Mmenu.prototype._initWindow_keyboardNavigation = function (enhance) {
    if (Mmenu.evnt.windowKeydownOffCanvasTab) {
        //	Re-enable tabbing in general
        window.removeEventListener('keydown', Mmenu.evnt.windowKeydownOffCanvasTab);
    }
    if (!Mmenu.evnt.windowFocusinKeyboardNavigationTab) {
        Mmenu.evnt.windowFocusinKeyboardNavigationTab = function (evnt) {
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                var target = evnt.target;
                if (target.matches('.mm-tabend')) {
                    var next = void 0;
                    //	Jump from menu to blocker.
                    if (target.parentElement.matches('.mm-menu')) {
                        if (Mmenu.node.blck) {
                            next = Mmenu.node.blck;
                        }
                    }
                    //	Jump to opened menu.
                    if (target.parentElement.matches('.mm-wrapper__blocker')) {
                        next = Mmenu.DOM.find(document.body, '.mm-menu_offcanvas.mm-menu_opened')[0];
                    }
                    //	If no available element found, stay in current element.
                    if (!next) {
                        next = target.parentElement;
                    }
                    if (next) {
                        Mmenu.DOM.children(next, '.mm-tabstart')[0].focus();
                    }
                }
            }
        };
        window.addEventListener('focusin', Mmenu.evnt.windowFocusinKeyboardNavigationTab);
    }
    if (!Mmenu.evnt.windowKeydownKeyboardNavigationKeys) {
        Mmenu.evnt.windowKeydownKeyboardNavigationKeys = function (evnt) {
            var target = evnt.target;
            var menu = target.closest('.mm-menu');
            if (menu) {
                var api = menu['mmenu'];
                //	special case for input and textarea
                if (target.matches('input, textarea')) {
                }
                else {
                    switch (evnt.keyCode) {
                        //	press enter to toggle and check
                        case 13:
                            if (target.matches('.mm-toggle') ||
                                target.matches('.mm-check')) {
                                target.dispatchEvent(new Event('click'));
                            }
                            break;
                        //	prevent spacebar or arrows from scrolling the page
                        case 32: //	space
                        case 37: //	left
                        case 38: //	top
                        case 39: //	right
                        case 40: //	bottom
                            evnt.preventDefault();
                            break;
                    }
                }
                if (enhance) {
                    //	special case for input and textarea
                    if (target.matches('input')) {
                        switch (evnt.keyCode) {
                            //	empty searchfield with esc
                            case 27:
                                target.value = '';
                                break;
                        }
                    }
                    else {
                        var api_1 = menu['mmenu'];
                        switch (evnt.keyCode) {
                            //	close submenu with backspace
                            case 8:
                                var parent_1 = Mmenu.DOM.find(menu, '.mm-panel_opened')[0]['mmParent'];
                                if (parent_1) {
                                    api_1.openPanel(parent_1.closest('.mm-panel'));
                                }
                                break;
                            //	close menu with esc
                            case 27:
                                if (menu.matches('.mm-menu_offcanvas')) {
                                    api_1.close();
                                }
                                break;
                        }
                    }
                }
            }
        };
        window.addEventListener('keydown', Mmenu.evnt.windowKeydownKeyboardNavigationKeys);
    }
};

Mmenu.addons.lazySubmenus = function () {
    var _this = this;
    var options = this.opts.lazySubmenus;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            load: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.lazySubmenus = Mmenu.extend(options, Mmenu.options.lazySubmenus);
    //	Sliding submenus
    if (options.load) {
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

Mmenu.addons.navbars = function () {
    var _this = this;
    var navs = this.opts.navbars;
    if (typeof navs == 'undefined') {
        return;
    }
    if (!(navs instanceof Array)) {
        navs = [navs];
    }
    var sizes = {}, navbars = {};
    if (!navs.length) {
        return;
    }
    navs.forEach(function (options) {
        //	Extend shorthand options.
        if (typeof options == 'boolean' && options) {
            options = {};
        }
        if (typeof options != 'object') {
            options = {};
        }
        if (typeof options.content == 'undefined') {
            options.content = ['prev', 'title'];
        }
        if (!(options.content instanceof Array)) {
            options.content = [options.content];
        }
        //	/Extend shorthand options.
        //	Create the navbar element.
        var navbar = Mmenu.DOM.create('div.mm-navbar');
        //	Get the height for the navbar.
        var height = options.height;
        if (typeof height != 'number') {
            //	Defaults to a height of 1.
            height = 1;
        }
        else {
            //	Restrict the height between 1 to 4.
            height = Math.min(4, Math.max(1, height));
            if (height > 1) {
                //	Add the height class to the navbar.
                navbar.classList.add('mm-navbar_size-' + height);
            }
        }
        //	Get the position for the navbar.
        var position = options.position;
        //	Restrict the position to either "bottom" or "top" (default).
        if (position !== 'bottom') {
            position = 'top';
        }
        //	Add up the wrapper height for the navbar position.
        if (!sizes[position]) {
            sizes[position] = 0;
        }
        sizes[position] += height;
        //	Create the wrapper for the navbar position.
        if (!navbars[position]) {
            navbars[position] = Mmenu.DOM.create('div.mm-navbars_' + position);
        }
        navbars[position].append(navbar);
        //	Add content to the navbar.
        for (var c = 0, l = options.content.length; c < l; c++) {
            var ctnt = options.content[c];
            //	The content is a string.
            if (typeof ctnt == 'string') {
                //	The content refers to one of the navbar-presets ("prev", "title", etc).
                var func = Mmenu.addons.navbars[ctnt];
                if (typeof func == 'function') {
                    //	Call the preset function.
                    func.call(_this, navbar);
                }
                //	The content is just HTML.
                else {
                    //	Add the HTML.
                    navbar.innerHTML += ctnt;
                }
            }
            //	The content is not a string, it must be an element.
            else {
                navbar.append(ctnt);
            }
        }
        //	If buttons were added, tell the navbar.
        if (navbar.querySelector('.mm-navbar__btn')) {
            navbar.classList.add('mm-navbar_has-btns');
        }
        //	The type option is set.
        if (typeof options.type == 'string') {
            //	The function refers to one of the navbar-presets ("tabs").
            var func = Mmenu.addons.navbars[options.type];
            if (typeof func == 'function') {
                //	Call the preset function.
                func.call(_this, navbar);
            }
        }
    });
    //	Add to menu
    this.bind('initMenu:after', function () {
        for (var position in navbars) {
            _this.node.menu.classList.add('mm-menu_navbar_' + position + '-' + sizes[position]);
            _this.node.menu[position == 'bottom' ? 'append' : 'prepend'](navbars[position]);
        }
    });
};

Mmenu.addons.pageScroll = function () {
    var _this = this;
    var options = this.opts.pageScroll, configs = this.conf.pageScroll;
    //	Extend shorthand options.
    if (typeof options == 'boolean') {
        options = {
            scroll: options
        };
    }
    //	/Extend shorthand options.
    this.opts.pageScroll = Mmenu.extend(options, Mmenu.options.pageScroll);
    var section;
    function scrollTo(offset) {
        if (section && section.matches(':visible')) {
            //	TODO: animate?
            document.documentElement.scrollTop = section.offsetTop + offset;
            document.body.scrollTop = section.offsetTop + offset;
        }
        section = null;
    }
    function anchorInPage(href) {
        try {
            if (href != '#' &&
                href.slice(0, 1) == '#') {
                return Mmenu.node.page.querySelector(href);
            }
            return null;
        }
        catch (err) {
            return null;
        }
    }
    //	Scroll to section after clicking menu item.
    if (options.scroll) {
        this.bind('close:finish', function () {
            scrollTo(configs.scrollOffset);
        });
    }
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor.
    if (this.opts.offCanvas && options.scroll) {
        this.clck.push(function (anchor, args) {
            section = null;
            //	Don't continue if the clicked anchor is not in the menu.
            if (!args.inMenu) {
                return;
            }
            //	Don't continue if the targeted section is not on the page.
            var href = anchor.getAttribute('href');
            section = anchorInPage(href);
            if (!section) {
                return;
            }
            //	If the sidebar add-on is "expanded"...
            if (_this.node.menu.matches('.mm-menu_sidebar-expanded') &&
                document.documentElement.matches('.mm-wrapper_sidebar-expanded')) {
                //	... scroll the page to the section.
                scrollTo(_this.conf.pageScroll.scrollOffset);
            }
            //	... otherwise...
            else {
                //	... close the menu.
                return {
                    close: true
                };
            }
        });
    }
    //	Update selected menu item after scrolling.
    if (options.update) {
        var scts_1 = [];
        this.bind('initListview:after', function (panel) {
            //	TODO de sections zouden geordend moeten worden op de hoogte in de DOM, niet op volgorde in het menu.
            var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
            Mmenu.filterListItemAnchors(listitems)
                .forEach(function (anchor) {
                var href = anchor.getAttribute('href');
                var section = anchorInPage(href);
                if (section) {
                    scts_1.unshift(section);
                }
            });
        });
        var _selected_1 = -1;
        window.addEventListener('scroll', function (evnt) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            for (var s = 0; s < scts_1.length; s++) {
                if (scts_1[s].offsetTop < scrollTop + configs.updateOffset) {
                    if (_selected_1 !== s) {
                        _selected_1 = s;
                        var panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0], listitems = Mmenu.DOM.find(panel, '.mm-listitem'), anchors = Mmenu.filterListItemAnchors(listitems);
                        anchors = anchors.filter(function (anchor) { return anchor.matches('[href="#' + scts_1[s].id + '"]'); });
                        if (anchors.length) {
                            _this.setSelected(anchors[0].parentElement);
                        }
                    }
                    break;
                }
            }
        });
    }
};

Mmenu.addons.searchfield = function () {
    var _this = this;
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Extend shorthand options.
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (typeof options.panel == 'boolean') {
        options.panel = {
            add: options.panel
        };
    }
    if (typeof options.panel != 'object') {
        options.panel = {};
    }
    //	/Extend shorthand options.
    if (!options.add) {
        return;
    }
    //	Extend logical options.
    if (options.addTo == 'panel') {
        options.panel.add = true;
    }
    if (options.panel.add) {
        options.showSubPanels = false;
        if (options.panel.splash) {
            options.cancel = true;
        }
    }
    //	/Extend logical options.
    this.opts.searchfield = Mmenu.extend(options, Mmenu.options.searchfield);
    //	Blur searchfield
    this.bind('close:start', function () {
        Mmenu.DOM.find(_this.node.menu, '.mm-searchfield')
            .forEach(function (input) {
            input.blur();
        });
    });
    this.bind('initPanels:after', function (panels) {
        var searchpanel = null;
        //	Add the search panel
        if (options.panel.add) {
            searchpanel = _this._initSearchPanel(panels);
        }
        //	Add the searchfield
        var addTo = null;
        switch (options.addTo) {
            case 'panels':
                addTo = panels;
                break;
            case 'panel':
                addTo = [searchpanel];
                break;
            default:
                if (typeof options.addTo == 'string') {
                    addTo = Mmenu.DOM.find(_this.node.menu, options.addTo);
                }
                else if (Mmenu.typeof(options.addTo) == 'array') {
                    addTo = options.addTo;
                }
                break;
        }
        addTo.forEach(function (form) {
            form = _this._initSearchfield(form);
            if (options.search && form) {
                _this._initSearching(form);
            }
        });
        //	Add the no-results message
        if (options.noResults) {
            (options.panel.add ? [searchpanel] : panels).forEach(function (panel) {
                _this._initNoResultsMsg(panel);
            });
        }
    });
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor
    this.clck.push(function (anchor, args) {
        if (args.inMenu) {
            if (anchor.matches('.mm-searchfield__btn')) {
                //	Clicking the clear button
                if (anchor.matches('.mm-btn_close')) {
                    var form = anchor.closest('.mm-searchfield'), input = Mmenu.DOM.find(form, 'input')[0];
                    input.value = '';
                    _this.search(input);
                    return true;
                }
                //	Clicking the submit button
                if (anchor.matches('.mm-btn_next')) {
                    var form = anchor.closest('form');
                    if (form) {
                        form.submit();
                    }
                    return true;
                }
            }
        }
    });
};
Mmenu.prototype._initSearchPanel = function (panels) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Only once
    if (Mmenu.DOM.children(this.node.pnls, '.mm-panel_search').length) {
        return null;
    }
    var searchpanel = Mmenu.DOM.create('div.mm-panel_search'), listview = Mmenu.DOM.create('ul');
    searchpanel.append(listview);
    this.node.pnls.append(searchpanel);
    if (options.panel.id) {
        searchpanel.id = options.panel.id;
    }
    if (options.panel.title) {
        searchpanel.setAttribute('data-mm-title', options.panel.title);
    }
    switch (options.panel.fx) {
        case false:
            break;
        case 'none':
            searchpanel.classList.add('mm-panel_noanimation');
            break;
        default:
            searchpanel.classList.add('mm-panel_fx-' + options.panel.fx);
            break;
    }
    //	Add splash content
    if (options.panel.splash) {
        var splash = Mmenu.DOM.create('div.mm-panel__searchsplash');
        splash.innerHTML = options.panel.splash;
        searchpanel.append(splash);
    }
    this._initPanels([searchpanel]);
    return searchpanel;
};
Mmenu.prototype._initSearchfield = function (wrapper) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	No searchfield in vertical submenus	
    if (wrapper.parentElement.matches('.mm-listitem_vertical')) {
        return null;
    }
    //	Only one searchfield per panel
    var form = Mmenu.DOM.find(wrapper, '.mm-searchfield')[0];
    if (form) {
        return form;
    }
    function addAttributes(element, attr) {
        if (attr) {
            for (var a in attr) {
                element.setAttribute(a, attr[a]);
            }
        }
    }
    var form = Mmenu.DOM.create((configs.form ? 'form' : 'div') + '.mm-searchfield'), field = Mmenu.DOM.create('div.mm-searchfield__input'), input = Mmenu.DOM.create('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = this.i18n(options.placeholder);
    field.append(input);
    form.append(field);
    wrapper.prepend(form);
    if (wrapper.matches('.mm-panel')) {
        wrapper.classList.add('mm-panel_has-searchfield');
    }
    //	Add attributes to the input
    addAttributes(input, configs.input);
    //	Add the clear button
    if (configs.clear) {
        var anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_close.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    //	Add attributes and submit to the form
    addAttributes(form, configs.form);
    if (configs.form && configs.submit && !configs.clear) {
        var anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    if (options.cancel) {
        var anchor = Mmenu.DOM.create('a.mm-searchfield__cancel');
        anchor.setAttribute('href', '#');
        anchor.textContent = this.i18n('cancel');
        form.append(anchor);
    }
    return form;
};
Mmenu.prototype._initSearching = function (form) {
    var _this = this;
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    var data = {};
    //	In the searchpanel.
    if (form.closest('.mm-panel_search')) {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [form.closest('.mm-panel')];
    }
    //	In a panel
    else if (form.closest('.mm-panel')) {
        data.panels = [form.closest('.mm-panel')];
        data.noresults = data.panels;
    }
    //	Not in a panel, global
    else {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [this.node.menu];
    }
    //	Filter out vertical submenus
    data.panels = data.panels.filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); });
    //	Filter out search panel
    data.panels = data.panels.filter(function (panel) { return !panel.matches('.mm-panel_search'); });
    var listitems = [];
    data.panels.forEach(function (panel) {
        listitems.push.apply(listitems, Mmenu.DOM.find(panel, '.mm-listitem'));
    });
    data.listitems = listitems.filter(function (listitem) { return !listitem.matches('.mm-listitem_divider'); });
    data.dividers = listitems.filter(function (listitem) { return listitem.matches('.mm-listitem_divider'); });
    var searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0], input = Mmenu.DOM.find(form, 'input')[0], cancel = Mmenu.DOM.find(form, '.mm-searchfield__cancel')[0];
    input['mmSearchfield'] = data;
    //	Open the splash panel when focussing the input.
    if (options.panel.add && options.panel.splash) {
        //	Remove the focus eventlistener from the input.
        if (this.evnt.inputFocusSearchfieldSplash) {
            input.removeEventListener('focus', this.evnt.inputFocusSearchfieldSplash);
        }
        //	Create the eventlistener.
        this.evnt.inputFocusSearchfieldSplash = function (evnt) {
            _this.openPanel(searchpanel);
        };
        //	Add the focus eventlistener to the input..
        input.addEventListener('focus', this.evnt.inputFocusSearchfieldSplash);
    }
    //	Handle the cancel button.
    if (options.cancel) {
        //	Remove the focus eventlistener from the input.
        if (this.evnt.inputFocusSearchfieldCancel) {
            input.removeEventListener('focus', this.evnt.inputFocusSearchfieldCancel);
        }
        //	Create the eventlistener.	
        this.evnt.inputFocusSearchfieldCancel = function (evnt) {
            cancel.classList.add('mm-searchfield__cancel-active');
        };
        //	Add the focus eventlistener to the input.
        input.addEventListener('focus', this.evnt.inputFocusSearchfieldCancel);
        //	Remove the focus eventlistener from the input.
        if (this.evnt.cancelClickSearchfieldSplash) {
            cancel.removeEventListener('click', this.evnt.cancelClickSearchfieldSplash);
        }
        //	Create the eventlistener.	
        this.evnt.cancelClickSearchfieldSplash = function (evnt) {
            evnt.preventDefault();
            cancel.classList.remove('mm-searchfield__cancel-active');
            if (searchpanel.matches('.mm-panel_opened')) {
                var parents = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened-parent');
                if (parents.length) {
                    _this.openPanel(parents[parents.length - 1]);
                }
            }
        };
        //	Add the focus eventlistener to the input.
        cancel.addEventListener('click', this.evnt.cancelClickSearchfieldSplash);
    }
    if (options.panel.add && options.addTo == 'panel') {
        this.bind('openPanel:finish', function (panel) {
            if (panel === searchpanel) {
                input.focus();
            }
        });
    }
    //	Remove the focus eventlistener from the input.
    if (this.evnt.inputInputSearchfieldSearch) {
        input.removeEventListener('input', this.evnt.inputInputSearchfieldSearch);
    }
    //	Create the eventlistener.	
    this.evnt.inputInputSearchfieldSearch = function (evnt) {
        switch (evnt.keyCode) {
            case 9: //	tab
            case 16: //	shift
            case 17: //	control
            case 18: //	alt
            case 37: //	left
            case 38: //	top
            case 39: //	right
            case 40: //	bottom
                break;
            default:
                _this.search(input);
                break;
        }
    };
    //	Add the focus eventlistener to the input.
    input.addEventListener('input', this.evnt.inputInputSearchfieldSearch);
    //	Fire once initially
    this.search(input);
};
Mmenu.prototype._initNoResultsMsg = function (wrapper) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Not in a panel
    if (!wrapper.closest('.mm-panel')) {
        wrapper = Mmenu.DOM.children(this.node.pnls, '.mm-panel')[0];
    }
    //	Only once
    if (Mmenu.DOM.children(wrapper, '.mm-panel__noresultsmsg').length) {
        return;
    }
    //	Add no-results message
    var message = Mmenu.DOM.create('div.mm-panel__noresultsmsg.mm-hidden');
    message.innerHTML = this.i18n(options.noResults);
    wrapper.prepend(message);
};
Mmenu.prototype.search = function (input, query) {
    var _this = this;
    var _a;
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    query = query || '' + input.value;
    query = query.toLowerCase().trim();
    var data = input['mmSearchfield'];
    var form = input.closest('.mm-searchfield'), buttons = Mmenu.DOM.find(form, '.mm-btn'), searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0];
    var panels = data.panels, noresults = data.noresults, listitems = data.listitems, dividers = data.dividers;
    //	Reset previous results
    listitems.forEach(function (listitem) {
        listitem.classList.remove('mm-listitem_nosubitems');
    });
    //	TODO: dit klopt niet meer	
    // Mmenu.$(listitems).find( '.mm-btn_fullwidth-search' )
    // .removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );
    if (searchpanel) {
        Mmenu.DOM.children(searchpanel, '.mm-listview')[0].innerHTML = '';
    }
    panels.forEach(function (panel) {
        panel.scrollTop = 0;
    });
    //	Search
    if (query.length) {
        //	Initially hide all listitems
        listitems.forEach(function (listitem) {
            listitem.classList.add('mm-hidden');
        });
        dividers.forEach(function (divider) {
            divider.classList.add('mm-hidden');
        });
        //	Re-show only listitems that match
        listitems.forEach(function (listitem) {
            var _search = '.mm-listitem__text'; // 'a'
            if (options.showTextItems || (options.showSubPanels && listitem.querySelector('.mm-btn_next'))) {
                // _search = 'a, span';
            }
            else {
                _search = 'a' + _search;
            }
            if (Mmenu.DOM.children(listitem, _search)[0].textContent.toLowerCase().indexOf(query) > -1) {
                listitem.classList.remove('mm-hidden');
            }
        });
        //	Show all mached listitems in the search panel
        if (options.panel.add) {
            //	Clone all matched listitems into the search panel
            var allitems_1 = [];
            panels.forEach(function (panel) {
                var listitems = Mmenu.filterListItems(Mmenu.DOM.find(panel, '.mm-listitem'));
                if (listitems.length) {
                    if (options.panel.dividers) {
                        var divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.innerHTML = panel.querySelector('.mm-navbar__title').innerHTML;
                        listitems.push(divider);
                    }
                    listitems.forEach(function (listitem) {
                        allitems_1.push(listitem.cloneNode(true));
                    });
                }
            });
            //	Remove toggles, checks and open buttons
            allitems_1.forEach(function (listitem) {
                listitem.querySelectorAll('.mm-toggle, .mm-check, .mm-btn')
                    .forEach(function (element) {
                    element.remove();
                });
            });
            //	Add to the search panel
            (_a = Mmenu.DOM.children(searchpanel, '.mm-listview')[0]).append.apply(_a, listitems);
            //	Open the search panel
            this.openPanel(searchpanel);
        }
        else {
            //	Also show listitems in sub-panels for matched listitems
            if (options.showSubPanels) {
                panels.forEach(function (panel) {
                    var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                    Mmenu.filterListItems(listitems)
                        .forEach(function (listitem) {
                        var child = listitem['mmChild'];
                        if (child) {
                            Mmenu.DOM.find(child, '.mm-listitem')
                                .forEach(function (listitem) {
                                listitem.classList.remove('mm-hidden');
                            });
                        }
                    });
                });
            }
            //	Update parent for sub-panel
            panels.reverse()
                .forEach(function (panel, p) {
                var parent = panel['mmParent'];
                if (parent) {
                    //	The current panel has mached listitems
                    var listitems_1 = Mmenu.DOM.find(panel, '.mm-listitem');
                    if (Mmenu.filterListItems(listitems_1).length) {
                        //	Show parent
                        if (parent.matches('.mm-hidden')) {
                            parent.classList.remove('mm-hidden');
                            //	TODO: dit klopt niet meer...
                            //	Het idee was een btn tijdelijk fullwidth te laten zijn omdat het zelf geen resultaat is, maar zn submenu wel.
                            // Mmenu.$(parent)
                            // 	.children( '.mm-btn_next' )
                            // 	.not( '.mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth-search' );
                        }
                    }
                    else if (!input.closest('.mm-panel')) {
                        if (panel.matches('.mm-panel_opened') ||
                            panel.matches('.mm-panel_opened-parent')) {
                            //	Compensate the timeout for the opening animation
                            setTimeout(function () {
                                _this.openPanel(parent.closest('.mm-panel'));
                            }, (p + 1) * (_this.conf.openingInterval * 1.5));
                        }
                        parent.classList.add('mm-listitem_nosubitems');
                    }
                }
            });
            //	Show first preceeding divider of parent
            panels.forEach(function (panel) {
                var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                Mmenu.filterListItems(listitems)
                    .forEach(function (listitem) {
                    var divider = Mmenu.DOM.prevAll(listitem, '.mm-listitem_divider')[0];
                    if (divider) {
                        divider.classList.remove('mm-hidden');
                    }
                });
            });
        }
        //	Show submit / clear button
        buttons.forEach(function (button) { return button.classList.remove('mm-hidden'); });
        //	Show/hide no results message
        noresults.forEach(function (wrapper) {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')
                .forEach(function (message) { return message.classList[listitems.filter(function (listitem) { return !listitem.matches('.mm-hidden'); }).length ? 'add' : 'remove']('mm-hidden'); });
        });
        if (options.panel.add) {
            //	Hide splash
            if (options.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')
                    .forEach(function (splash) { return splash.classList.add('mm-hidden'); });
            }
            //	Re-show original listitems when in search panel
            listitems.forEach(function (listitem) { return listitem.classList.remove('mm-hidden'); });
            dividers.forEach(function (divider) { return divider.classList.remove('mm-hidden'); });
        }
    }
    //	Don't search
    else {
        //	Show all items
        listitems.forEach(function (listitem) { return listitem.classList.remove('mm-hidden'); });
        dividers.forEach(function (divider) { return divider.classList.remove('mm-hidden'); });
        //	Hide submit / clear button
        buttons.forEach(function (button) { return button.classList.add('mm-hidden'); });
        //	Hide no results message
        noresults.forEach(function (wrapper) {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')
                .forEach(function (message) { return message.classList.add('mm-hidden'); });
        });
        if (options.panel.add) {
            //	Show splash
            if (options.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')
                    .forEach(function (splash) { return splash.classList.remove('mm-hidden'); });
            }
            //	Close panel 
            else if (!input.closest('.mm-panel_search')) {
                var opened = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened-parent');
                this.openPanel(opened.slice(-1)[0]);
            }
        }
    }
    //	Update for other addons
    this.trigger('updateListview');
};

Mmenu.addons.sectionIndexer = function () {
    var _this = this;
    var options = this.opts.sectionIndexer;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.sectionIndexer = Mmenu.extend(options, Mmenu.options.sectionIndexer);
    if (!options.add) {
        return;
    }
    this.bind('initPanels:after', function (panels) {
        //	Set the panel(s)
        if (options.addTo != 'panels') {
            //	TODO addTo kan ook een HTML element zijn?
            panels = Mmenu.DOM.find(_this.node.menu, options.addTo)
                .filter(function (panel) { return panel.matches('.mm-panel'); });
        }
        panels.forEach(function (panel) {
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach(function (listitem) {
                listitem.closest('.mm-panel').classList.add('mm-panel_has-sectionindexer');
            });
        });
        //	Add the indexer, only if it does not allready excists
        if (!_this.node.indx) {
            var buttons_1 = '';
            'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (letter) {
                buttons_1 += '<a href="#">' + letter + '</a>';
            });
            var indexer = Mmenu.DOM.create('div.mm-sectionindexer');
            indexer.innerHTML = buttons_1;
            _this.node.menu.prepend(indexer);
            _this.node.indx = indexer;
            //	Prevent default behavior when clicking an anchor
            _this.node.indx.addEventListener('click', function (evnt) {
                var anchor = evnt.target;
                if (anchor.matches('a')) {
                    evnt.preventDefault();
                }
            });
            //	Scroll onMouseOver / onTouchStart
            var mouseOverEvent = function (evnt) {
                if (!evnt.target.matches('a')) {
                    return;
                }
                var letter = evnt.target.textContent, panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
                var newTop = -1, oldTop = panel.scrollTop;
                panel.scrollTop = 0;
                Mmenu.DOM.find(panel, '.mm-listitem_divider')
                    .filter(function (divider) { return !divider.matches('.mm-hidden'); })
                    .forEach(function (divider) {
                    if (newTop < 0 &&
                        letter == divider.textContent.trim().slice(0, 1).toLowerCase()) {
                        newTop = divider.offsetTop;
                    }
                });
                panel.scrollTop = newTop > -1 ? newTop : oldTop;
            };
            _this.node.indx.addEventListener('mouseover', mouseOverEvent);
            if (Mmenu.support.touch) {
                _this.node.indx.addEventListener('touchstart', mouseOverEvent);
            }
        }
        //	Show or hide the indexer
        function update(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            this.node.menu.classList[panel.matches('.mm-panel_has-sectionindexer') ? 'add' : 'remove']('mm-menu_has-sectionindexer');
        }
        ;
        _this.bind('openPanel:start', update);
        _this.bind('initPanels:after', update); // TODO panel argument is an array
    });
};

Mmenu.addons.setSelected = function () {
    var _this = this;
    var options = this.opts.setSelected;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            hover: options,
            parent: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	Extend shorthand options
    this.opts.setSelected = Mmenu.extend(options, Mmenu.options.setSelected);
    //	Find current by URL
    if (options.current == 'detect') {
        function findCurrent(url) {
            url = url.split("?")[0].split("#")[0];
            var anchor = this.node.menu.querySelector('a[href="' + url + '"], a[href="' + url + '/"]');
            if (anchor) {
                this.setSelected(anchor.parentElement);
            }
            else {
                var arr = url.split('/').slice(0, -1);
                if (arr.length) {
                    findCurrent.call(this, arr.join('/'));
                }
            }
        }
        ;
        this.bind('initMenu:after', function () {
            findCurrent.call(_this, window.location.href);
        });
    }
    //	Remove current selected item
    else if (!options.current) {
        this.bind('initListview:after', function (panel) {
            Mmenu.DOM.find(panel, '.mm-listitem_selected')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected');
            });
        });
    }
    //	Add :hover effect on items
    if (options.hover) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-hover');
        });
    }
    //	Set parent item selected for submenus
    if (options.parent) {
        this.bind('openPanel:finish', function (panel) {
            //	Remove all
            Mmenu.DOM.find(_this.node.pnls, '.mm-listitem_selected-parent')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected-parent');
            });
            //	Move up the DOM tree
            var parent = panel['mmParent'];
            while (parent) {
                if (!parent.matches('.mm-listitem_vertical')) {
                    parent.classList.add('mm-listitem_selected-parent');
                }
                parent = parent.closest('.mm-panel');
                parent = parent['mmParent'];
            }
        });
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-parent');
        });
    }
};

Mmenu.addons.sidebar = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var options = this.opts.sidebar;
    //	Extend shorthand options
    if (typeof options == 'string' ||
        (typeof options == 'boolean' && options) ||
        typeof options == 'number') {
        options = {
            expanded: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	Extend collapsed shorthand options.
    if (typeof options.collapsed == 'boolean' && options.collapsed) {
        options.collapsed = {
            use: 'all'
        };
    }
    if (typeof options.collapsed == 'string' ||
        typeof options.collapsed == 'number') {
        options.collapsed = {
            use: options.collapsed
        };
    }
    if (typeof options.collapsed != 'object') {
        options.collapsed = {};
    }
    if (typeof options.collapsed.use == 'number') {
        options.collapsed.use = '(min-width: ' + options.collapsed.use + 'px)';
    }
    //	Extend expanded shorthand options.
    if (typeof options.expanded == 'boolean' && options.expanded) {
        options.expanded = {
            use: 'all'
        };
    }
    if (typeof options.expanded == 'string' ||
        typeof options.expanded == 'number') {
        options.expanded = {
            use: options.expanded
        };
    }
    if (typeof options.expanded != 'object') {
        options.expanded = {};
    }
    if (typeof options.expanded.use == 'number') {
        options.expanded.use = '(min-width: ' + options.expanded.use + 'px)';
    }
    //	/Extend shorthand options
    this.opts.sidebar = Mmenu.extend(options, Mmenu.options.sidebar);
    var clsclpsd = 'mm-wrapper_sidebar-collapsed', clsxpndd = 'mm-wrapper_sidebar-expanded';
    //	Collapsed
    if (options.collapsed.use) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_sidebar-collapsed');
            if (options.collapsed.blockMenu &&
                _this.opts.offCanvas &&
                !Mmenu.DOM.children(_this.node.menu, '.mm-menu__blocker')[0]) {
                var anchor = Mmenu.DOM.create('a.mm-menu__blocker');
                anchor.setAttribute('href', '#' + _this.node.menu.id);
                _this.node.menu.prepend(anchor);
            }
            if (options.collapsed.hideNavbar) {
                _this.node.menu.classList.add('mm-menu_hidenavbar');
            }
            if (options.collapsed.hideDivider) {
                _this.node.menu.classList.add('mm-menu_hidedivider');
            }
        });
        if (typeof options.collapsed.use == 'boolean') {
            this.bind('initMenu:after', function () {
                document.documentElement.classList.add(clsclpsd);
            });
        }
        else {
            this.matchMedia(options.collapsed.use, function () {
                document.documentElement.classList.add(clsclpsd);
            }, function () {
                document.documentElement.classList.remove(clsclpsd);
            });
        }
    }
    //	Expanded
    if (options.expanded.use) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_sidebar-expanded');
        });
        if (typeof options.expanded.use == 'boolean') {
            this.bind('initMenu:after', function () {
                document.documentElement.classList.add(clsxpndd);
                _this.open();
            });
        }
        else {
            this.matchMedia(options.expanded.use, function () {
                document.documentElement.classList.add(clsxpndd);
                if (!document.documentElement.matches('.mm-wrapper_sidebar-closed')) {
                    _this.open();
                }
            }, function () {
                document.documentElement.classList.remove(clsxpndd);
                _this.close();
            });
        }
        this.bind('close:start', function () {
            if (document.documentElement.matches('.' + clsxpndd)) {
                document.documentElement.classList.add('mm-wrapper_sidebar-closed');
            }
        });
        this.bind('open:start', function () {
            document.documentElement.classList.remove('mm-wrapper_sidebar-closed');
        });
        //	Add click behavior.
        //	Prevents default behavior when clicking an anchor
        this.clck.push(function (anchor, args) {
            if (args.inMenu && args.inListview) {
                if (document.documentElement.matches('.mm-wrapper_sidebar-expanded')) {
                    return {
                        close: false
                    };
                }
            }
        });
    }
};

Mmenu.addons.toggles = function () {
    var _this = this;
    this.bind('initPanels:after', function (panels) {
        //	Refactor toggle classes
        panels.forEach(function (panel) {
            Mmenu.DOM.find(panel, 'input')
                .forEach(function (input) {
                Mmenu.refactorClass(input, _this.conf.classNames.toggles.toggle, 'mm-toggle');
                Mmenu.refactorClass(input, _this.conf.classNames.toggles.check, 'mm-check');
            });
        });
        //	Loop over all panels.
        panels.forEach(function (panel) {
            //	Loop over all toggles and checks.
            Mmenu.DOM.find(panel, 'input.mm-toggle, input.mm-check')
                .forEach(function (input) {
                //	Find the listitem the input is in.
                var parent = input.closest('li');
                //	Get or create an ID for the input.
                var id = input.id || Mmenu.getUniqueId();
                //	Only needs to be done once.
                if (!Mmenu.DOM.children(parent, 'label[for="' + id + '"]').length) {
                    input.id = id;
                    parent.prepend(input);
                    var label = Mmenu.DOM.create('label.mm-' + (input.matches('.mm-toggle') ? 'toggle' : 'check'));
                    label.setAttribute('for', id);
                    var text = Mmenu.DOM.children(parent, '.mm-listitem__text')[0];
                    text.parentElement.insertBefore(label, text.nextSibling);
                }
            });
        });
    });
};

Mmenu.options.autoHeight = {
    height: 'default' // 'default/highest/auto'
};

Mmenu.options.backButton = {
    close: false,
    open: false
};

Mmenu.configs.classNames.counters = {
    counter: 'Counter'
};

Mmenu.options.counters = {
    add: false,
    addTo: 'panels',
    count: false
};

Mmenu.options.columns = {
    add: false,
    visible: {
        min: 1,
        max: 3
    }
};

Mmenu.options.dividers = {
    add: false,
    addTo: 'panels',
    fixed: false,
    type: null
};

Mmenu.configs.drag = {
    menu: {
        width: {
            perc: 0.8,
            min: 140,
            max: 440
        },
        height: {
            perc: 0.8,
            min: 140,
            max: 880
        }
    }
};

Mmenu.options.drag = {
    menu: {
        open: false,
        node: null,
        maxStartPos: 100,
        threshold: 50
    },
    panels: {
        close: false
    },
    vendors: {
        hammer: {}
    }
};

Mmenu.configs.dropdown = {
    offset: {
        button: {
            x: -5,
            y: 5
        },
        viewport: {
            x: 20,
            y: 20
        }
    },
    height: {
        max: 880
    },
    width: {
        max: 440
    }
};

Mmenu.options.dropdown = {
    drop: false,
    fitViewport: true,
    event: 'click',
    position: {},
    tip: true
};

Mmenu.configs.fixedElements = {
    fixed: {
        insertMethod: 'append',
        insertSelector: 'body'
    },
    sticky: {
        offset: 0
    }
};
Mmenu.configs.classNames.fixedElements = {
    fixed: 'Fixed',
    sticky: 'Sticky'
};

Mmenu.options.iconbar = {
    add: false,
    top: [],
    bottom: [],
    type: 'default'
};

Mmenu.options.iconPanels = {
    add: false,
    blockPanel: true,
    hideDivider: false,
    hideNavbar: true,
    visible: 3
};

Mmenu.options.keyboardNavigation = {
    enable: false,
    enhance: false
};

Mmenu.options.lazySubmenus = {
    load: false
};

Mmenu.configs.navbars = {
    breadcrumbs: {
        separator: '/',
        removeFirst: false
    }
};
Mmenu.configs.classNames.navbars = {};

Mmenu.addons.navbars.breadcrumbs = function (navbar) {
    //	Add content
    var _this = this;
    var breadcrumbs = Mmenu.DOM.create('span.mm-navbar__breadcrumbs');
    navbar.append(breadcrumbs);
    this.bind('initNavbar:after', function (panel) {
        if (panel.querySelector('.mm-navbar__breadcrumbs')) {
            return;
        }
        panel.classList.remove('mm-panel_has-navbar');
        var crumbs = [], breadcrumbs = Mmenu.DOM.create('span.mm-navbar__breadcrumbs'), current = panel, first = true;
        while (current) {
            if (!current.matches('.mm-panel')) {
                current = current.closest('.mm-panel');
            }
            if (!current.parentElement.matches('.mm-listitem_vertical')) {
                var text = Mmenu.DOM.find(current, '.mm-navbar__title')[0].textContent;
                if (text.length) {
                    crumbs.unshift(first ? '<span>' + text + '</span>' : '<a href="#' + current.id + '">' + text + '</a>');
                }
                first = false;
            }
            current = current['mmParent'];
        }
        if (_this.conf.navbars.breadcrumbs.removeFirst) {
            crumbs.shift();
        }
        breadcrumbs.innerHTML = crumbs.join('<span class="mm-separator">' + _this.conf.navbars.breadcrumbs.separator + '</span>');
        Mmenu.DOM.children(panel, '.mm-navbar')[0].append(breadcrumbs);
    });
    //	Update for to opened panel
    this.bind('openPanel:start', function (panel) {
        var crumbs = panel.querySelector('.mm-navbar__breadcrumbs');
        if (crumbs) {
            breadcrumbs.innerHTML = crumbs.innerHTML;
        }
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', function (panel) {
        Mmenu.DOM.find(panel, '.mm-breadcrumbs a')
            .forEach(function (anchor) {
            Mmenu.sr_aria(anchor, 'owns', anchor.getAttribute('href').slice(1));
        });
    });
};

Mmenu.addons.navbars.close = function (navbar) {
    var _this = this;
    //	Add content
    var close = Mmenu.DOM.create('a.mm-btn.mm-btn_close.mm-navbar__btn');
    navbar.append(close);
    //	Update to page node
    this.bind('setPage:after', function (page) {
        close.setAttribute('href', '#' + page.id);
    });
    //	Add screenreader / text support
    this.bind('setPage:after:sr-text', function () {
        close.innerHTML = Mmenu.sr_text(_this.i18n(_this.conf.screenReader.text.closeMenu));
        Mmenu.sr_aria(close, 'owns', close.getAttribute('href').slice(1));
    });
};

Mmenu.addons.navbars.next = function (navbar) {
    var _this = this;
    //	Add content
    var next = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-navbar__btn');
    navbar.append(next);
    //	Update to opened panel
    var org;
    var _url, _txt;
    this.bind('openPanel:start', function (panel) {
        org = panel.querySelector('.' + _this.conf.classNames.navbars.panelNext);
        _url = org ? org.getAttribute('href') : '';
        _txt = org ? org.innerHTML : '';
        if (_url) {
            next.setAttribute('href', _url);
        }
        else {
            next.removeAttribute('href');
        }
        next.classList[_url || _txt ? 'remove' : 'add']('mm-hidden');
        next.innerHTML = _txt;
    });
    //	Add screenreader / aria support
    this.bind('openPanel:start:sr-aria', function (panel) {
        Mmenu.sr_aria(next, 'hidden', next.matches('mm-hidden'));
        Mmenu.sr_aria(next, 'owns', (next.getAttribute('href') || '').slice(1));
    });
};
Mmenu.configs.classNames.navbars.panelNext = 'Next';

Mmenu.addons.navbars.prev = function (navbar) {
    var _this = this;
    //	Add content.
    var prev = Mmenu.DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
    navbar.append(prev);
    this.bind('initNavbar:after', function (panel) {
        panel.classList.remove('mm-panel_has-navbar');
    });
    //	Update to opened panel.
    var org;
    var _url, _txt;
    this.bind('openPanel:start', function (panel) {
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            return;
        }
        org = panel.querySelector('.' + _this.conf.classNames.navbars.panelPrev);
        if (!org) {
            org = panel.querySelector('.mm-navbar__btn.mm-btn_prev');
        }
        _url = org ? org.getAttribute('href') : '';
        _txt = org ? org.innerHTML : '';
        if (_url) {
            prev.setAttribute('href', _url);
        }
        else {
            prev.removeAttribute('href');
        }
        prev.classList[_url || _txt ? 'remove' : 'add']('mm-hidden');
        prev.innerHTML = _txt;
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', function (panel) {
        Mmenu.sr_aria(panel.querySelector('.mm-navbar'), 'hidden', true);
    });
    this.bind('openPanel:start:sr-aria', function (panel) {
        Mmenu.sr_aria(prev, 'hidden', prev.matches('.mm-hidden'));
        Mmenu.sr_aria(prev, 'owns', (prev.getAttribute('href') || '').slice(1));
    });
};
Mmenu.configs.classNames.navbars.panelPrev = 'Prev';

Mmenu.addons.navbars.searchfield = function (navbar) {
    if (Mmenu.typeof(this.opts.searchfield) != 'object') {
        this.opts.searchfield = {};
    }
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = [navbar];
};

Mmenu.addons.navbars.tabs = function (navbar) {
    var _this = this;
    navbar.classList.add('mm-navbar_tabs');
    navbar.parentElement.classList.add('mm-navbars_has-tabs');
    var anchors = Mmenu.DOM.children(navbar, 'a');
    navbar.addEventListener('click', function (evnt) {
        var anchor = evnt.target;
        if (!anchor.matches('a')) {
            return;
        }
        if (anchor.matches('.mm-navbar__tab_selected')) {
            evnt.stopImmediatePropagation();
            return;
        }
        try {
            _this.openPanel(_this.node.menu.querySelector(anchor.getAttribute('href')), false);
            evnt.stopImmediatePropagation();
        }
        catch (err) { }
    });
    function selectTab(panel) {
        anchors.forEach(function (anchor) {
            anchor.classList.remove('mm-navbar__tab_selected');
        });
        var anchor = anchors.filter(function (anchor) { return anchor.matches('[href="#' + panel.id + '"]'); })[0];
        if (anchor) {
            anchor.classList.add('mm-navbar__tab_selected');
        }
        else {
            var parent = panel['mmParent'];
            if (parent) {
                selectTab.call(this, parent.closest('.mm-panel'));
            }
        }
    }
    this.bind('openPanel:start', selectTab);
};

Mmenu.addons.navbars.title = function (navbar) {
    var _this = this;
    //	Add content to the navbar.
    var title = Mmenu.DOM.create('a.mm-navbar__title');
    navbar.append(title);
    //	Update the title to the opened panel.
    var _url, _txt;
    var original;
    this.bind('openPanel:start', function (panel) {
        //	Do nothing in a vertically expanding panel.
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            return;
        }
        //	Find the original title in the opened panel.
        original = panel.querySelector('.' + _this.conf.classNames.navbars.panelTitle);
        if (!original) {
            original = panel.querySelector('.mm-navbar__title');
        }
        //	Get the URL for the title.
        _url = original ? original.getAttribute('href') : '';
        if (_url) {
            title.setAttribute('href', _url);
        }
        else {
            title.removeAttribute('href');
        }
        //	Get the text for the title.
        _txt = original ? original.innerHTML : '';
        title.innerHTML = _txt;
        //	Show or hide the title.
        title.classList[_url || _txt ? 'remove' : 'add']('mm-hidden');
    });
    //	Add screenreader / aria support
    var prev;
    this.bind('openPanel:start:sr-aria', function (panel) {
        if (_this.opts.screenReader.text) {
            if (!prev) {
                var navbars = Mmenu.DOM.children(_this.node.menu, '.mm-navbars_top, .mm-navbars_bottom');
                navbars.forEach(function (navbar) {
                    var btn = navbar.querySelector('.mm-btn_prev');
                    if (btn) {
                        prev = btn;
                    }
                });
            }
            if (prev) {
                var hidden = true;
                if (_this.opts.navbar.titleLink == 'parent') {
                    hidden = !prev.matches('.mm-hidden');
                }
                Mmenu.sr_aria(title, 'hidden', hidden);
            }
        }
    });
};
Mmenu.configs.classNames.navbars.panelTitle = 'Title';

Mmenu.options.navbars = [];

Mmenu.configs.pageScroll = {
    scrollOffset: 0,
    updateOffset: 50
};

Mmenu.options.pageScroll = {
    scroll: false,
    update: false
};

Mmenu.configs.searchfield = {
    clear: false,
    form: false,
    input: false,
    submit: false
};

Mmenu.options.searchfield = {
    add: false,
    addTo: 'panels',
    cancel: false,
    noResults: 'No results found.',
    placeholder: 'Search',
    panel: {
        add: false,
        dividers: true,
        fx: 'none',
        id: null,
        splash: null,
        title: 'Search'
    },
    search: true,
    showTextItems: false,
    showSubPanels: true
};

Mmenu.options.sectionIndexer = {
    add: false,
    addTo: 'panels'
};

Mmenu.options.setSelected = {
    current: true,
    hover: false,
    parent: false
};

Mmenu.options.sidebar = {
    collapsed: {
        use: false,
        blockMenu: true,
        hideDivider: false,
        hideNavbar: true
    },
    expanded: {
        use: false
    }
};

Mmenu.configs.classNames.toggles = {
    toggle: 'Toggle',
    check: 'Check'
};

Mmenu.i18n({
    'Search': 'Suche',
    'No results found.': 'Keine Ergebnisse gefunden.',
    'cancel': 'beenden'
}, 'de');

Mmenu.i18n({
    'Search': 'جستجو',
    'No results found.': 'نتیجه‌ای یافت نشد.',
    'cancel': 'انصراف'
}, 'fa');

Mmenu.i18n({
    'Search': 'Zoeken',
    'No results found.': 'Geen resultaten gevonden.',
    'cancel': 'annuleren'
}, 'nl');

Mmenu.i18n({
    'Search': 'Найти',
    'No results found.': 'Ничего не найдено.',
    'Search results': 'Результаты поиска'
}, 'ru');

Mmenu.wrappers.angular = function () {
    this.opts.onClick = {
        close: true,
        preventDefault: false,
        setSelected: true
    };
};

Mmenu.wrappers.bootstrap4 = function () {
    var _this = this;
    //	Create the menu
    if (this.node.menu.matches('.navbar-collapse')) {
        //	No need for cloning the menu...
        this.conf.clone = false;
        //	... We'll create a new menu
        var nav = Mmenu.DOM.create('nav'), panel = Mmenu.DOM.create('div');
        nav.append(panel);
        Mmenu.DOM.children(this.node.menu)
            .forEach(function (child) {
            switch (true) {
                case child.matches('.navbar-nav'):
                    panel.append(cloneNav(child));
                    break;
                case child.matches('.dropdown-menu'):
                    panel.append(cloneDropdown(child));
                    break;
                case child.matches('.form-inline'):
                    _this.conf.searchfield.form = {
                        action: child.getAttribute('action') || null,
                        method: child.getAttribute('method') || null
                    };
                    _this.conf.searchfield.input = {
                        name: child.querySelector('input').getAttribute('name') || null
                    };
                    _this.conf.searchfield.clear = false;
                    _this.conf.searchfield.submit = true;
                    break;
                default:
                    panel.append(child.cloneNode(true));
                    break;
            }
        });
        //	Set the menu
        this.bind('initMenu:before', function () {
            document.body.prepend(nav);
            _this.node.menu = nav;
        });
        //	Hijack the toggler.
        var toggler = this.node.menu.parentElement.querySelector('.navbar-toggler');
        toggler.removeAttribute('data-target');
        toggler.removeAttribute('aria-controls');
        //	Remove all bound events.
        toggler.outerHTML = toggler.outerHTML;
        toggler.addEventListener('click', function (evnt) {
            evnt.preventDefault();
            evnt.stopImmediatePropagation();
            _this[_this.vars.opened ? 'close' : 'open']();
        });
    }
    function cloneLink(anchor) {
        var link = Mmenu.DOM.create('a');
        //	Copy attributes
        var attr = ['href', 'title', 'target'];
        for (var a = 0; a < attr.length; a++) {
            if (typeof anchor.getAttribute(attr[a]) != 'undefined') {
                link.setAttribute(attr[a], anchor.getAttribute(attr[a]));
            }
        }
        //	Copy contents
        link.innerHTML = anchor.innerHTML;
        //	Remove Screen reader text.
        Mmenu.DOM.find(link, '.sr-only')
            .forEach(function (sro) {
            sro.remove();
        });
        return link;
    }
    function cloneDropdown(dropdown) {
        var list = Mmenu.DOM.create('ul');
        Mmenu.DOM.children(dropdown)
            .forEach(function (anchor) {
            var item = Mmenu.DOM.create('li');
            if (anchor.matches('.dropdown-divider')) {
                item.classList.add('Divider');
            }
            else if (anchor.matches('.dropdown-item')) {
                item.append(cloneLink(anchor));
            }
            list.append(item);
        });
        return list;
    }
    function cloneNav(nav) {
        var list = Mmenu.DOM.create('ul');
        Mmenu.DOM.find(nav, '.nav-item')
            .forEach(function (anchor) {
            var item = Mmenu.DOM.create('li');
            if (anchor.matches('.active')) {
                item.classList.add('Selected');
            }
            if (!anchor.matches('.nav-link')) {
                var dropdown = Mmenu.DOM.children(anchor, '.dropdown-menu')[0];
                if (dropdown) {
                    item.append(cloneDropdown(dropdown));
                }
                anchor = Mmenu.DOM.children(anchor, '.nav-link')[0];
            }
            item.prepend(cloneLink(anchor));
            list.append(item);
        });
        return list;
    }
};

Mmenu.wrappers.magento = function () {
    this.conf.classNames.selected = 'active';
};

Mmenu.wrappers.olark = function () {
    this.conf.offCanvas.page.noSelector.push('#olark');
};

Mmenu.wrappers.turbolinks = function () {
    var classnames;
    var grep = function (items, callback) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (callback(item)) {
                filtered.push(item);
            }
        }
        return filtered;
    };
    document.addEventListener('turbolinks:before-visit', function (evnt) {
        classnames = document.documentElement.className;
        classnames = grep(classnames.split(' '), function (name) {
            return !/mm-/.test(name);
        }).join(' ');
    });
    document.addEventListener('turbolinks:load', function (evnt) {
        if (typeof classnames === 'undefined') {
            return;
        }
        document.documentElement.className = classnames;
    });
};

Mmenu.wrappers.wordpress = function () {
    this.conf.classNames.selected = 'current-menu-item';
    var wpadminbar = document.getElementById('wpadminbar');
    wpadminbar.style.position = 'fixed';
    wpadminbar.classList.add('mm-slideout');
};
