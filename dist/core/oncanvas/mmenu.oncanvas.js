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
            var current = element;
            while (current) {
                current = current.previousElementSibling;
                if (!filter || current.matches(filter)) {
                    previous.push(current);
                }
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
            direction = (direction === 'left') ? 'offsetLeft' : 'offsetTop';
            var offset = 0;
            while (element) {
                offset += element[direction];
                element = element.offsetParent || null;
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
            if (element['mmenu']) {
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
