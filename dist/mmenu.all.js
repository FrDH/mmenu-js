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
                    Mmenu.transitionend(Mmenu.$(panel), function () {
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
        var $pnls = Mmenu.$(this.node.pnls).children('.mm-panel'), $frst = (panel) ? Mmenu.$(panel) : $pnls.first();
        Mmenu.$(this.node.pnls)
            .children('.mm-panel')
            .not($frst)
            .removeClass('mm-panel_opened')
            .removeClass('mm-panel_opened-parent')
            .removeClass('mm-panel_highest')
            .addClass('mm-hidden');
        //	Open first panel.
        this.openPanel($frst[0], false);
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
        var $parent = Mmenu.$(panel).parent('li');
        var parent = $parent[0];
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
        if (Mmenu.$(panel).children('.mm-navbar').length) {
            return;
        }
        var parent = panel.mmParent, $navbar = Mmenu.$('<div class="mm-navbar" />');
        var title = this._getPanelTitle(panel, this.opts.navbar.title), href = '';
        if (parent) {
            if (parent.matches('.mm-listitem_vertical')) {
                return;
            }
            //	Listview, the panel wrapping this panel
            if (parent.parentElement.matches('.mm-listview')) {
                var $a = Mmenu.$(parent)
                    .children('a, span')
                    .not('.mm-btn_next');
            }
            //	Non-listview, the first anchor in the parent panel that links to this panel
            else {
                var $a = Mmenu.$(panel)
                    .closest('.mm-panel')
                    .find('a[href="#' + panel.id + '"]');
            }
            $a = $a.first();
            parent = $a.closest('.mm-panel')[0];
            var id = parent.id;
            title = this._getPanelTitle(panel, Mmenu.$('<span>' + $a.text() + '</span>').text());
            switch (this.opts.navbar.titleLink) {
                case 'anchor':
                    href = $a[0].getAttribute('href');
                    break;
                case 'parent':
                    href = '#' + id;
                    break;
            }
            $navbar.append('<a class="mm-btn mm-btn_prev mm-navbar__btn" href="#' + id + '" />');
        }
        else if (!this.opts.navbar.title) {
            return;
        }
        if (this.opts.navbar.add) {
            panel.classList.add('mm-panel_has-navbar');
        }
        $navbar.append('<a class="mm-navbar__title"' + (href.length ? ' href="' + href + '"' : '') + '>' + title + '</a>')
            .prependTo(panel);
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
        var $panel = Mmenu.$(panel);
        //	Refactor listviews classnames
        var filter = 'ul, ol', uls = Mmenu.DOM.children(panel, filter);
        if (panel.matches(filter)) {
            uls.unshift(panel);
        }
        uls.forEach(function (ul) {
            Mmenu.refactorClass(ul, _this.conf.classNames.nolistview, 'mm-nolistview');
        });
        //	Refactor listitems classnames
        var $li = Mmenu.$(uls)
            .not('.mm-nolistview')
            .addClass('mm-listview')
            .children()
            .addClass('mm-listitem');
        $li.each(function (l, li) {
            Mmenu.refactorClass(li, _this.conf.classNames.selected, 'mm-listitem_selected');
            Mmenu.refactorClass(li, _this.conf.classNames.divider, 'mm-listitem_divider');
            Mmenu.refactorClass(li, _this.conf.classNames.spacer, 'mm-listitem_spacer');
        });
        $li.children('a, span')
            .not('.mm-btn')
            .addClass('mm-listitem__text');
        //	Add open link to parent listitem
        var parent = panel.mmParent;
        if (parent && parent.matches('.mm-listitem')) {
            if (!Mmenu.$(parent).children('.mm-btn').length) {
                var $a = Mmenu.$(parent).children('a, span').first(), $b = Mmenu.$('<a class="mm-btn mm-btn_next mm-listitem__btn" href="#' + panel.id + '" />');
                $b.insertAfter($a);
                if ($a.is('span')) {
                    $b.addClass('mm-listitem__text').html($a.html());
                    $a.remove();
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
        var last = null;
        listitems.forEach(function (listitem) {
            last = listitem;
            listitem.classList.remove('mm-listitem_selected');
        });
        if (last) {
            last.classList.add('mm-listitem_selected');
        }
        //	Find the current opened panel
        var current = (last)
            ? last.closest('.mm-panel')
            : Mmenu.$(this.node.pnls).children('.mm-panel')[0];
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
    Mmenu.transitionend = function ($element, func, duration) {
        var guid = Mmenu.getUniqueId();
        var _ended = false, _fn = function (e) {
            if (typeof e !== 'undefined') {
                if (e.target != $element[0]) {
                    return;
                }
            }
            if (!_ended) {
                $element.off('transitionend.' + guid);
                $element.off('webkitTransitionEnd.' + guid);
                func.call($element[0]);
            }
            _ended = true;
        };
        $element.on('transitionend.' + guid, _fn);
        $element.on('webkitTransitionEnd.' + guid, _fn);
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
                        Mmenu.transitionend(Mmenu.$(menu), function () {
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
    Mmenu.transitionend(Mmenu.$(Mmenu.node.page), function () {
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
    Mmenu.transitionend(Mmenu.$(Mmenu.node.page), function () {
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
    Mmenu.$('body')
        .find('.mm-menu_offcanvas')
        .not(this.node.menu)
        .each(function (i, elem) {
        var api = elem.mmenu;
        if (api && api.close) {
            api.close();
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
    Mmenu.$(window)
        .off('keydown.mm-offCanvas')
        .on('keydown.mm--offCanvas', function (e) {
        if (Mmenu.$('html').hasClass('mm-wrapper_opened')) {
            if (e.keyCode == 9) {
                e.preventDefault();
                return false;
            }
        }
    });
    //	Set "page" node min-height to window height
    var oldHeight, newHeight;
    Mmenu.$(window)
        .off('resize.mm-offCanvas')
        .on('resize.mm-offCanvas', function (e, force) {
        //	if ( Mmenu.node.page.length == 1 )
        {
            if (force || Mmenu.$('html').hasClass('mm-wrapper_opened')) {
                newHeight = Mmenu.$(window).height();
                if (force || newHeight != oldHeight) {
                    oldHeight = newHeight;
                    Mmenu.$(Mmenu.node.page).css('minHeight', newHeight);
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
    Mmenu.$(Mmenu.node.blck)
        .appendTo(conf.menu.insertSelector)
        .off('touchstart.mm-offCanvas touchmove.mm-offCanvas')
        .on('touchstart.mm-offCanvas touchmove.mm-offCanvas', function (evnt) {
        evnt.preventDefault();
        evnt.stopPropagation();
        Mmenu.$(Mmenu.node.blck).trigger('mousedown.mm-offCanvas');
    })
        .off('mousedown.mm-offCanvas')
        .on('mousedown.mm-offCanvas', function (evnt) {
        evnt.preventDefault();
        if (!document.querySelector('html').matches('.mm-wrapper_modal')) {
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
    //		1) in an off-canvas menu 
    //		2) that -when opened- blocks the UI from interaction 
    //		3) on touch devices
    if (!Mmenu.support.touch || // 3
        !this.opts.offCanvas || // 1
        !this.opts.offCanvas.blockUI // 2
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
    //opts = this.opts.scrollBugFix = jQuery.extend( true, {}, Mmenu.options.scrollBugFix, opts );
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
                    scrolling = true;
                    if (panel.scrollTop === 0) {
                        panel.scrollTop = 1;
                    }
                    else if (panel.scrollHeight === panel.scrollTop + panel.offsetHeight) {
                        panel.scrollTop -= 1;
                    }
                    scrolling = false;
                }
            }
        })
            .off('touchmove.mm-scrollBugFix')
            .on('touchmove.mm-scrollBugFix', '.mm-panels > .mm-panel', function (evnt) {
            if (document.documentElement.matches('.mm-wrapper_opened')) {
                var panel = evnt.currentTarget;
                if (panel.scrollHeight > panel.clientHeight) {
                    evnt.stopPropagation();
                }
            }
        });
        //	Fix issue after device rotation change
        Mmenu.$('window')
            .off('orientationchange.mm-scrollBugFix')
            .on('orientationchange.mm-scrollBugFix', function () {
            Mmenu.$(_this.node.pnls)
                .children('.mm-panel_opened')
                .scrollTop(0)
                .css({ '-webkit-overflow-scrolling': 'auto' })
                .css({ '-webkit-overflow-scrolling': 'touch' });
        });
    });
};
//	Default options and configuration.
Mmenu.options.scrollBugFix = {
    fix: true
};

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

Mmenu.addons.counters = function () {
    var _this = this;
    var opts = this.opts.counters;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts,
            count: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (opts.addTo == 'panels') {
        opts.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.counters = Mmenu.extend(opts, Mmenu.options.counters);
    //	Refactor counter class
    this.bind('initListview:after', function (panel) {
        var cntrclss = _this.conf.classNames.counters.counter, counters = panel.querySelectorAll('.' + cntrclss);
        counters.forEach(function (counter) {
            Mmenu.refactorClass(counter, cntrclss, 'mm-counter');
        });
    });
    //	Add the counters after a listview is initiated.
    if (opts.add) {
        this.bind('initListview:after', function (panel) {
            if (!panel.matches(opts.addTo)) {
                return;
            }
            var parent = panel.mmParent;
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
    if (opts.count) {
        function count(panel) {
            var panels = panel ? [panel] : Mmenu.DOM.children(this.node.pnls, '.mm-panel');
            panels.forEach(function (panel) {
                var parent = panel.mmParent;
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
//	Default options and configuration.
Mmenu.options.counters = {
    add: false,
    addTo: 'panels',
    count: false
};
Mmenu.configs.classNames.counters = {
    counter: 'Counter'
};

Mmenu.addons.columns = function () {
    var _this = this;
    var opts = this.opts.columns;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts == 'number') {
        opts = {
            add: true,
            visible: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.visible == 'number') {
        opts.visible = {
            min: opts.visible,
            max: opts.visible
        };
    }
    //	/Extend shorthand options
    this.opts.columns = Mmenu.extend(opts, Mmenu.options.columns);
    //	Add the columns
    if (opts.add) {
        opts.visible.min = Math.max(1, Math.min(6, opts.visible.min));
        opts.visible.max = Math.max(opts.visible.min, Math.min(6, opts.visible.max));
        var colm = '', colp = '';
        for (var i = 0; i <= opts.visible.max; i++) {
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
                parent = panel.mmParent;
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
            _num = Math.min(opts.visible.max, Math.max(opts.visible.min, _num));
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
            panels.slice(-opts.visible.max)
                .forEach(function (panel, p) {
                panel.classList.add('mm-panel_columns-' + p);
            });
        });
    }
};
//	Default options and configuration.
Mmenu.options.columns = {
    add: false,
    visible: {
        min: 1,
        max: 3
    }
};

Mmenu.addons.dividers = function () {
    var _this = this;
    var opts = this.opts.dividers;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts,
            fixed: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (opts.addTo == 'panels') {
        opts.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.dividers = Mmenu.extend(opts, Mmenu.options.dividers);
    //	Add classname to the menu to specify the type of the dividers
    if (opts.type) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_dividers-' + opts.type);
        });
    }
    //	Add dividers
    if (opts.add) {
        this.bind('initListview:after', function (panel) {
            if (!panel.matches(opts.addTo)) {
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
                        .innerText.trim().toLowerCase()[0];
                    if (letter.length && letter != lastletter) {
                        lastletter = letter;
                        var divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.innerText = letter;
                        listview.insertBefore(divider, listitem);
                    }
                });
            });
        });
    }
    //	Fixed dividers
    if (opts.fixed) {
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
//	Default options and configuration.
Mmenu.options.dividers = {
    add: false,
    addTo: 'panels',
    fixed: false,
    type: null
};

Mmenu.addons.drag = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    if (typeof Hammer != 'function' || Hammer.VERSION < 2) {
        return;
    }
    var opts = this.opts.drag, conf = this.conf.drag;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            menu: opts,
            panels: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.menu == 'boolean') {
        opts = {
            open: opts.menu
        };
    }
    if (typeof opts.menu != 'object') {
        opts.menu = {};
    }
    if (typeof opts.panels == 'boolean') {
        opts.panels = {
            close: opts.panels
        };
    }
    if (typeof opts.panels != 'object') {
        opts.panels = {};
    }
    //	/Extend shorthand options
    //opts = this.opts.drag = jQuery.extend( true, {}, Mmenu.options.drag, opts );
    this.opts.drag = Mmenu.extend(opts, Mmenu.options.drag);
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
    if (opts.menu.open) {
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
            var _dimension = 'width', _direction = drag.open_dir;
            var doPanstart = function (pos) {
                if (pos <= opts.menu.maxStartPos) {
                    _stage = 1;
                }
            };
            var getSlideNodes = function () {
                return Mmenu.$('.mm-slideout');
            };
            var _stage = 0, _distance = 0, _maxDistance = 0;
            var new_distance, drag_distance, css_value;
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
                    break;
            }
            switch (position) {
                case 'right':
                case 'bottom':
                    drag.negative = true;
                    doPanstart = function (pos) {
                        if (pos >= Mmenu.$(window)[_dimension]() - opts.menu.maxStartPos) {
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
                        return Mmenu.$(this.node.menu);
                    };
                    break;
            }
            var $slideOutNodes, $dragNode = Mmenu.valueOrFn(_this.node.menu, opts.menu.node, Mmenu.$(Mmenu.node.page));
            if (typeof $dragNode == 'string') {
                $dragNode = Mmenu.$($dragNode);
            }
            //	Bind events
            var _hammer = new Hammer($dragNode[0], _this.opts.drag.vendors.hammer);
            _hammer
                .on('panstart', function (evnt) {
                doPanstart.call(_this, evnt.center[drag.typeLower]);
                $slideOutNodes = getSlideNodes.call(_this);
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
                if (_distance > opts.menu.threshold) {
                    if (_stage == 1) {
                        if (document.documentElement.matches('.mm-wrapper_opened')) {
                            return;
                        }
                        _stage = 2;
                        _this._openSetup();
                        _this.trigger('open:start');
                        document.documentElement.classList.add('mm-wrapper_dragging');
                        _maxDistance = minMax(Mmenu.$(window)[_dimension]() * conf.menu[_dimension].perc, conf.menu[_dimension].min, conf.menu[_dimension].max);
                    }
                }
                if (_stage == 2) {
                    drag_distance = minMax(_distance, 10, _maxDistance) - (zposition == 'front' ? _maxDistance : 0);
                    if (drag.negative) {
                        drag_distance = -drag_distance;
                    }
                    css_value = 'translate' + drag.typeUpper + '(' + drag_distance + 'px )';
                    $slideOutNodes.css({
                        '-webkit-transform': '-webkit-' + css_value,
                        'transform': css_value
                    });
                }
            });
            _hammer
                .on('panend', function (evnt) {
                if (_stage == 2) {
                    document.documentElement.classList.remove('mm-wrapper_dragging');
                    $slideOutNodes.css('transform', '');
                    _this[_direction == drag.open_dir ? '_openFinish' : 'close']();
                }
                _stage = 0;
            });
        });
    }
    //	Drag close panels
    if (opts.panels.close) {
        this.bind('initPanel:after', function (panel) {
            var parent = panel.mmParent;
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
//	Default options and configuration.
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

Mmenu.addons.dropdown = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var opts = this.opts.dropdown, conf = this.conf.dropdown;
    //	Extend shorthand options
    if (typeof opts == 'boolean' && opts) {
        opts = {
            drop: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.position == 'string') {
        opts.position = {
            of: opts.position
        };
    }
    //	/Extend shorthand options
    this.opts.dropdown = Mmenu.extend(opts, Mmenu.options.dropdown);
    if (!opts.drop) {
        return;
    }
    var button;
    this.bind('initMenu:after', function () {
        _this.node.menu.classList.add('mm-menu_dropdown');
        if (typeof opts.position.of != 'string') {
            var id = _this.vars.orgMenuId;
            if (id && id.length) {
                opts.position.of = '[href="#' + id + '"]';
            }
        }
        if (typeof opts.position.of != 'string') {
            return;
        }
        //	Get the button to put the menu next to
        button = Mmenu.DOM.find(document.body, opts.position.of)[0];
        //	Emulate hover effect
        var events = opts.event.split(' ');
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
        _this.node.menu.mmStyle = _this.node.menu.getAttribute('style');
        document.documentElement.classList.add('mm-wrapper_dropdown');
    });
    this.bind('close:finish', function () {
        _this.node.menu.setAttribute('style', _this.node.menu.mmStyle);
        document.documentElement.classList.remove('mm-wrapper_dropdown');
    });
    //	Update the position and sizes
    var getPosition = function (dir, obj) {
        var css = obj[0], cls = obj[1];
        var _scrollPos = dir == 'x' ? 'scrollLeft' : 'scrollTop', _outerSize = dir == 'x' ? 'outerWidth' : 'outerHeight', _startPos = dir == 'x' ? 'left' : 'top', _stopPos = dir == 'x' ? 'right' : 'bottom', _size = dir == 'x' ? 'width' : 'height', _maxSize = dir == 'x' ? 'maxWidth' : 'maxHeight', _position = null;
        var scrollPos = Mmenu.$(window)[_scrollPos](), startPos = Mmenu.$(button).offset()[_startPos] -= scrollPos, stopPos = startPos + Mmenu.$(button)[_outerSize](), windowSize = Mmenu.$(window)[_size]();
        var offs = conf.offset.button[dir] + conf.offset.viewport[dir];
        //	Position set in option
        if (opts.position[dir]) {
            switch (opts.position[dir]) {
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
            css[_startPos] = val + conf.offset.button[dir];
            css[_stopPos] = 'auto';
            if (opts.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'left' : 'top'));
            }
        }
        else {
            val = (dir == 'x') ? stopPos : startPos;
            max = val - offs;
            css[_stopPos] = 'calc( 100% - ' + (val - conf.offset.button[dir]) + 'px )';
            css[_startPos] = 'auto';
            if (opts.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'right' : 'bottom'));
            }
        }
        if (opts.fitViewport) {
            css[_maxSize] = Math.min(conf[_size].max, max);
        }
        return [css, cls];
    };
    function position() {
        var _a;
        if (!this.vars.opened) {
            return;
        }
        this.node.menu.setAttribute('style', this.node.menu.mmStyle);
        var obj = [{}, []];
        obj = getPosition.call(this, 'y', obj);
        obj = getPosition.call(this, 'x', obj);
        Mmenu.$(this.node.menu).css(obj[0]);
        if (opts.tip) {
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
//	Default options and configuration.
Mmenu.options.dropdown = {
    drop: false,
    fitViewport: true,
    event: 'click',
    position: {},
    tip: true
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

Mmenu.addons.fixedElements = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var conf = this.conf.fixedElements;
    var _fixd, _stck, fixed, stick;
    this.bind('setPage:after', function (page) {
        //	Fixed elements
        _fixd = _this.conf.classNames.fixedElements.fixed;
        fixed = Mmenu.DOM.find(page, '.' + _fixd);
        fixed.forEach(function (fxd) {
            Mmenu.refactorClass(fxd, _fixd, 'mm-slideout');
        });
        document.querySelector(conf.fixed.insertSelector)[conf.fixed.insertMethod](fixed);
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
                var scrolltop = Mmenu.$(window).scrollTop() + conf.sticky.offset;
                stick.forEach(function (element) {
                    element.style.top = (parseInt(Mmenu.$(element).css('top'), 10) + scrolltop) + 'px';
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
//	Default options and configuration.
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

Mmenu.addons.iconbar = function () {
    var _this = this;
    var opts = this.opts.iconbar;
    //	Extend shorthand options
    if (Mmenu.typeof(opts) == 'array') {
        opts = {
            add: true,
            top: opts
        };
    }
    //	/Extend shorthand options
    if (!opts.add) {
        return;
    }
    var iconbar;
    ['top', 'bottom'].forEach(function (position, n) {
        var ctnt = opts[position];
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
        if (opts.type == 'tabs') {
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
                    var parent_1 = panel.mmParent;
                    if (parent_1) {
                        selectTab.call(this, parent_1.closest('.mm-panel'));
                    }
                }
            }
            this.bind('openPanel:start', selectTab);
        }
    }
};
//	Default options and configuration.
Mmenu.options.iconbar = {
    add: false,
    top: [],
    bottom: [],
    type: 'default'
};

Mmenu.addons.iconPanels = function () {
    var _this = this;
    var opts = this.opts.iconPanels;
    var keepFirst = false;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts == 'number' ||
        typeof opts == 'string') {
        opts = {
            add: true,
            visible: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (opts.visible == 'first') {
        keepFirst = true;
        opts.visible = 1;
    }
    //	/Extend shorthand options
    //opts = this.opts.iconPanels = jQuery.extend( true, {}, Mmenu.options.iconPanels, opts );
    this.opts.iconPanels = Mmenu.extend(opts, Mmenu.options.iconPanels);
    opts.visible = Math.min(3, Math.max(1, opts.visible));
    opts.visible++;
    //	Add the iconpanels
    if (opts.add) {
        this.bind('initMenu:after', function () {
            var _a;
            var cls = ['mm-menu_iconpanel'];
            if (opts.hideNavbar) {
                cls.push('mm-menu_hidenavbar');
            }
            if (opts.hideDivider) {
                cls.push('mm-menu_hidedivider');
            }
            (_a = _this.node.menu.classList).add.apply(_a, cls);
        });
        var cls = '';
        if (!keepFirst) {
            for (var i = 0; i <= opts.visible; i++) {
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
                panels = panels.slice(-opts.visible);
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
            if (opts.blockPanel &&
                !panel.parentElement.matches('.mm-listitem_vertical') &&
                !Mmenu.DOM.children(panel, '.mm-panel__blocker')[0]) {
                var anchor = Mmenu.DOM.create('a.mm-panel__blocker');
                anchor.setAttribute('href', panel.closest('.mm-panel').id);
                panel.prepend(anchor);
            }
        });
    }
};
//	Default options and configuration.
Mmenu.options.iconPanels = {
    add: false,
    blockPanel: true,
    hideDivider: false,
    hideNavbar: true,
    visible: 3
};

Mmenu.addons.keyboardNavigation = function () {
    var _this = this;
    //	Keyboard navigation on touchscreens opens the virtual keyboard :/
    //	Lets prevent that.
    if (Mmenu.support.touch) {
        return;
    }
    var opts = this.opts.keyboardNavigation;
    //	Extend shorthand options
    if (typeof opts == 'boolean' || typeof opts == 'string') {
        opts = {
            enable: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.keyboardNavigation = Mmenu.extend(opts, Mmenu.options.keyboardNavigation);
    //	Enable keyboard navigation
    if (opts.enable) {
        var menuStart_1 = Mmenu.DOM.create('button.mm-tabstart'), menuEnd_1 = Mmenu.DOM.create('button.mm-tabend'), blockerEnd_1 = Mmenu.DOM.create('button.mm-tabend');
        this.bind('initMenu:after', function () {
            if (opts.enhance) {
                _this.node.menu.classList.add('mm-menu_keyboardfocus');
            }
            _this._initWindow_keyboardNavigation(opts.enhance);
        });
        this.bind('initOpened:before', function () {
            _this.node.menu.prepend(menuStart_1);
            _this.node.menu.append(menuEnd_1);
            Mmenu.DOM.children(_this.node.menu, '.mm-navbars-top, .mm-navbars-bottom')
                .forEach(function (navbars) {
                navbars.querySelectorAll('a.mm-navbar__title')
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
        var focs = 'input, select, textarea, button, label, a[href]';
        function focus(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            var $focs = Mmenu.$(), $navb = Mmenu.$(this.node.menu)
                .children('.mm-navbars_top, .mm-navbars_bottom')
                .children('.mm-navbar');
            //	already focus in navbar
            if ($navb.find(focs).filter(':focus').length) {
                return;
            }
            if (opts.enable == 'default') {
                //	first anchor in listview
                $focs = Mmenu.$(panel).children('.mm-listview').find('a[href]').not('.mm-hidden');
                //	first element in panel
                if (!$focs.length) {
                    $focs = Mmenu.$(panel)
                        .find(focs)
                        .not('.mm-hidden');
                }
                //	first element in navbar
                if (!$focs.length) {
                    $focs = $navb
                        .find(focs)
                        .not('.mm-hidden');
                }
            }
            //	default
            if (!$focs.length) {
                $focs = Mmenu.$(this.node.menu).children('.mm-tabstart');
            }
            $focs.first().focus();
        }
        this.bind('open:finish', focus);
        this.bind('openPanel:finish', focus);
        //	Add screenreader / aria support
        this.bind('initOpened:after:sr-aria', function () {
            var $btns = Mmenu.$(_this.node.menu).add(Mmenu.node.blck)
                .children('.mm-tabstart, .mm-tabend');
            $btns.each(function (b, btn) {
                Mmenu.sr_aria(btn, 'hidden', true);
                Mmenu.sr_role(btn, 'presentation');
            });
        });
    }
};
//	Default options and configuration.
Mmenu.options.keyboardNavigation = {
    enable: false,
    enhance: false
};
/**
 * Initialize the window.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
Mmenu.prototype._initWindow_keyboardNavigation = function (enhance) {
    Mmenu.$(window)
        //	Re-enable tabbing in general
        //	TODO: dit wordt lastig omdat removeEventListner de functie als argument nodig heeft
        .off('keydown.mm-offCanvas')
        //	Prevent tabbing outside an offcanvas menu
        .off('focusin.mm-keyboardNavigation')
        .on('focusin.mm-keyboardNavigation', function (evnt) {
        if (document.documentElement.matches('.mm-wrapper_opened')) {
            var target = evnt.target; // Typecast to any because somehow, TypeScript thinks event.target is the window.
            if (target.matches('.mm-tabend')) {
                var next = void 0;
                //	Jump from menu to blocker
                if (target.parentElement.matches('.mm-menu')) {
                    if (Mmenu.node.blck) {
                        next = Mmenu.node.blck;
                    }
                }
                if (target.parentElement.matches('.mm-wrapper__blocker')) {
                    next = Mmenu.DOM.find(document.body, '.mm-menu_offcanvas.mm-menu_opened')[0];
                }
                if (!next) {
                    next = target.parentElement;
                }
                Mmenu.DOM.children(next, '.mm-tabstart')[0].focus();
            }
        }
    })
        //	Default keyboard navigation
        .off('keydown.mm-keyboardNavigation')
        .on('keydown.mm-keyboardNavigation', function (evnt) {
        var target = evnt.target;
        var menu = target.closest('.mm-menu');
        if (menu) {
            var api = menu.mmenu;
            //	special case for input and textarea
            if (target.matches('input, textarea')) {
            }
            else {
                switch (evnt.keyCode) {
                    //	press enter to toggle and check
                    case 13:
                        if (target.matches('.mm-toggle') ||
                            target.matches('.mm-check')) {
                            Mmenu.$(target).trigger('click.mm');
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
        }
    });
    if (enhance) {
        Mmenu.$(window)
            //	Enhanced keyboard navigation
            .off('keydown.mm-keyboardNavigation')
            .on('keydown.mm-keyboardNavigation', function (evnt) {
            var target = evnt.target, // Typecast to any because somehow, TypeScript thinks event.target is the window.
            menu = target.closest('.mm-menu');
            if (menu) {
                var api = menu.mmenu;
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
                    switch (evnt.keyCode) {
                        //	close submenu with backspace
                        case 8:
                            var parent = menu.querySelector('.mm-panel_opened').mmParent;
                            if (parent) {
                                api.openPanel(parent.closest('.mm-panel'));
                            }
                            break;
                        //	close menu with esc
                        case 27:
                            if (menu.matches('.mm-menu_offcanvas')) {
                                api.close();
                            }
                            break;
                    }
                }
            }
        });
    }
};

Mmenu.addons.lazySubmenus = function () {
    var _this = this;
    var opts = this.opts.lazySubmenus;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            load: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    // opts = this.opts.lazySubmenus = jQuery.extend( true, {}, Mmenu.options.lazySubmenus, opts );
    this.opts.lazySubmenus = Mmenu.extend(opts, Mmenu.options.lazySubmenus);
    //	Sliding submenus
    if (opts.load) {
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
//	Default options and configuration.
Mmenu.options.lazySubmenus = {
    load: false
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
    navs.forEach(function (opts) {
        //	Extend shorthand options.
        if (typeof opts == 'boolean' && opts) {
            opts = {};
        }
        if (typeof opts != 'object') {
            opts = {};
        }
        if (typeof opts.content == 'undefined') {
            opts.content = ['prev', 'title'];
        }
        if (!(opts.content instanceof Array)) {
            opts.content = [opts.content];
        }
        //	/Extend shorthand options.
        //	Create the navbar element.
        var navbar = Mmenu.DOM.create('div.mm-navbar');
        //	Get the height for the navbar.
        var height = opts.height;
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
        var position = opts.position;
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
        for (var c = 0, l = opts.content.length; c < l; c++) {
            var ctnt = opts.content[c];
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
        if (typeof opts.type == 'string') {
            //	The function refers to one of the navbar-presets ("tabs").
            var func = Mmenu.addons.navbars[opts.type];
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
//	Default options and configuration.
Mmenu.options.navbars = [];
Mmenu.configs.navbars = {
    breadcrumbs: {
        separator: '/',
        removeFirst: false
    }
};
Mmenu.configs.classNames.navbars = {};

Mmenu.addons.pageScroll = function () {
    var _this = this;
    var opts = this.opts.pageScroll, conf = this.conf.pageScroll;
    //	Extend shorthand options.
    if (typeof opts == 'boolean') {
        opts = {
            scroll: opts
        };
    }
    //	/Extend shorthand options.
    this.opts.pageScroll = Mmenu.extend(opts, Mmenu.options.pageScroll);
    var section;
    function scrollTo(offset) {
        if (section && section.matches(':visible')) {
            //	TODO: animate in vanilla JS
            document.documentElement.scrollTop = section.offsetTop + offset;
            // Mmenu.$('html, body').animate({
            // 	scrollTop: $section.offset().top + offset
            // });
        }
        section = null;
    }
    function anchorInPage(href) {
        try {
            if (href != '#' &&
                href.slice(0, 1) == '#' &&
                Mmenu.node.page.querySelector(href)) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    }
    //	Scroll to section after clicking menu item.
    if (opts.scroll) {
        this.bind('close:finish', function () {
            scrollTo(conf.scrollOffset);
        });
    }
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor.
    if (this.opts.offCanvas && opts.scroll) {
        this.clck.push(function (anchor, args) {
            section = null;
            //	Don't continue if the clicked anchor is not in the menu.
            if (!args.inMenu) {
                return;
            }
            //	Don't continue if the targeted section is not on the page.
            var href = anchor.getAttribute('href');
            if (!anchorInPage(href)) {
                return;
            }
            section = document.querySelector(href);
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
    if (opts.update) {
        var orgs_1 = [], scts_1 = [];
        this.bind('initListview:after', function (panel) {
            //	TODO de sections zouden geordend moeten worden op de hoogte in de DOM, niet op volgorde in het menu.
            //	TODO querySelector haalt een enkel HTML element op, er kunnen meerdere lisviews in een panel zitten.
            var listitems = Mmenu.DOM.children(panel.querySelector('.mm-listview'), 'li');
            Mmenu.filterListItemAnchors(listitems)
                .forEach(function (anchor) {
                var href = anchor.getAttribute('href');
                if (anchorInPage(href)) {
                    orgs_1.push(href);
                }
            });
            scts_1 = orgs_1.reverse();
        });
        var _selected_1 = -1;
        window.addEventListener('scroll', function (evnt) {
            var scrollTop = document.documentElement.scrollTop;
            for (var s = 0; s < scts_1.length; s++) {
                if (scts_1[s].offsetTop < scrollTop + conf.updateOffset) {
                    if (_selected_1 !== s) {
                        _selected_1 = s;
                        var panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0], listitems = Mmenu.DOM.find(panel, '.mm-listitem'), anchors = Mmenu.filterListItemAnchors(listitems);
                        anchors = anchors.filter(function (anchor) { return anchor.matches('[href="' + scts_1[s] + '"]'); });
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
//	Default options and configuration.
Mmenu.options.pageScroll = {
    scroll: false,
    update: false
};
Mmenu.configs.pageScroll = {
    scrollOffset: 0,
    updateOffset: 50
};

Mmenu.addons.searchfield = function () {
    var _this = this;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Extend shorthand options.
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.panel == 'boolean') {
        opts.panel = {
            add: opts.panel
        };
    }
    if (typeof opts.panel != 'object') {
        opts.panel = {};
    }
    //	/Extend shorthand options.
    if (!opts.add) {
        return;
    }
    //	Extend logical options.
    if (opts.addTo == 'panel') {
        opts.panel.add = true;
    }
    if (opts.panel.add) {
        opts.showSubPanels = false;
        if (opts.panel.splash) {
            opts.cancel = true;
        }
    }
    //	/Extend logical options.
    this.opts.searchfield = Mmenu.extend(opts, Mmenu.options.searchfield);
    //	Blur searchfield
    this.bind('close:start', function () {
        Mmenu.DOM.find(_this.node.menu, '.mm-searchfield')
            .forEach(function (input) {
            input.blur();
        });
    });
    this.bind('initPanels:after', function (panels) {
        var $pnls = Mmenu.$(panels);
        var $spnl = Mmenu.$();
        //	Add the search panel
        if (opts.panel.add) {
            $spnl = _this._initSearchPanel($pnls);
        }
        //	Add the searchfield
        var $field;
        switch (opts.addTo) {
            case 'panels':
                $field = $pnls;
                break;
            case 'panel':
                $field = $spnl;
                break;
            default:
                if (typeof opts.addTo == 'string') {
                    $field = Mmenu.$(_this.node.menu).find(opts.addTo);
                }
                else {
                    $field = Mmenu.$(opts.addTo);
                }
                break;
        }
        $field.each(function (e, elem) {
            var $srch = _this._initSearchfield(Mmenu.$(elem));
            if (opts.search && $srch.length) {
                _this._initSearching($srch);
            }
        });
        //	Add the no-results message
        if (opts.noResults) {
            var $results = (opts.panel.add) ? $spnl : $pnls;
            $results.each(function (i, elem) {
                _this._initNoResultsMsg(Mmenu.$(elem));
            });
        }
    });
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor
    this.clck.push(function (anchor, args) {
        if (args.inMenu) {
            if (anchor.matches('.mm-searchfield__btn')) {
                var $a = Mmenu.$(anchor);
                //	Clicking the clear button
                if (anchor.matches('.mm-btn_close')) {
                    var $inpt = $a.closest('.mm-searchfield').find('input');
                    $inpt.val('');
                    _this.search($inpt);
                    return true;
                }
                //	Clicking the submit button
                if (anchor.matches('.mm-btn_next')) {
                    $a.closest('.mm-searchfield')
                        .submit();
                    return true;
                }
            }
        }
    });
};
//	Default options and configuration.
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
Mmenu.configs.searchfield = {
    clear: false,
    form: false,
    input: false,
    submit: false
};
Mmenu.prototype._initSearchPanel = function ($panels) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Only once
    if (Mmenu.$(this.node.pnls).children('.mm-panel_search').length) {
        return Mmenu.$();
    }
    var $spnl = Mmenu.$('<div class="mm-panel_search " />')
        .append('<ul />')
        .appendTo(this.node.pnls);
    if (opts.panel.id) {
        $spnl[0].id = opts.panel.id;
    }
    if (opts.panel.title) {
        $spnl[0].setAttribute('data-mm-title', opts.panel.title);
    }
    switch (opts.panel.fx) {
        case false:
            break;
        case 'none':
            $spnl.addClass('mm-panel_noanimation');
            break;
        default:
            $spnl.addClass('mm-panel_fx-' + opts.panel.fx);
            break;
    }
    //	Add splash content
    if (opts.panel.splash) {
        $spnl.append('<div class="mm-panel__searchsplash">' + opts.panel.splash + '</div>');
    }
    this._initPanels($spnl.get());
    return $spnl;
};
Mmenu.prototype._initSearchfield = function ($wrpr) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	No searchfield in vertical submenus	
    if ($wrpr.parent('.mm-listitem_vertical').length) {
        return Mmenu.$();
    }
    //	Only one searchfield per panel
    if ($wrpr.find('.mm-searchfield').length) {
        return $wrpr.find('.mm-searchfield');
    }
    var $srch = Mmenu.$('<' + (conf.form ? 'form' : 'div') + ' class="mm-searchfield" />'), $inpd = Mmenu.$('<div class="mm-searchfield__input" />'), $inpt = Mmenu.$('<input placeholder="' + this.i18n(opts.placeholder) + '" type="text" autocomplete="off" />');
    $inpd.append($inpt).appendTo($srch);
    $wrpr.prepend($srch);
    if ($wrpr.hasClass('mm-panel')) {
        $wrpr.addClass('mm-panel_has-searchfield');
    }
    function addAttributes($el, attr) {
        if (attr) {
            for (var a in attr) {
                $el[0].setAttribute(a, attr[a]);
            }
        }
    }
    //	Add attributes to the input
    addAttributes($inpt, conf.input);
    //	Add the clear button
    if (conf.clear) {
        Mmenu.$('<a class="mm-btn mm-btn_close mm-searchfield__btn" href="#" />')
            .appendTo($inpd);
    }
    //	Add attributes and submit to the form
    addAttributes($srch, conf.form);
    if (conf.form && conf.submit && !conf.clear) {
        Mmenu.$('<a class="mm-btn mm-btn_next mm-searchfield__btn" href="#" />')
            .appendTo($inpd);
    }
    if (opts.cancel) {
        Mmenu.$('<a href="#" class="mm-searchfield__cancel">' + this.i18n('cancel') + '</a>')
            .appendTo($srch);
    }
    return $srch;
};
Mmenu.prototype._initSearching = function ($srch) {
    var _this = this;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    var data = {};
    //	In searchpanel
    if ($srch.closest('.mm-panel_search').length) {
        data.$pnls = Mmenu.$(this.node.pnls).find('.mm-panel');
        data.$nrsp = $srch.closest('.mm-panel');
    }
    //	In a panel
    else if ($srch.closest('.mm-panel').length) {
        data.$pnls = $srch.closest('.mm-panel');
        data.$nrsp = data.$pnls;
    }
    //	Not in a panel, global
    else {
        data.$pnls = Mmenu.$(this.node.pnls).find('.mm-panel');
        data.$nrsp = Mmenu.$(this.node.menu);
    }
    //	Filter out vertical submenus
    data.$pnls = data.$pnls.not(function (i, panel) {
        var parent = panel.parentElement;
        return parent && parent.matches('.mm-listitem_vertical');
    });
    //	Filter out search panel
    if (opts.panel.add) {
        data.$pnls = data.$pnls.not('.mm-panel_search');
    }
    var $inpt = $srch.find('input'), $cncl = $srch.find('.mm-searchfield__cancel'), $spnl = Mmenu.$(this.node.pnls).children('.mm-panel_search'), $itms = data.$pnls.find('.mm-listitem');
    data.$itms = $itms.not('.mm-listitem_divider');
    data.$dvdr = $itms.filter('.mm-listitem_divider');
    if (opts.panel.add && opts.panel.splash) {
        $inpt
            .off('focus.mm-searchfield-splash')
            .on('focus.mm-searchfield-splash', function (e) {
            _this.openPanel($spnl[0]);
        });
    }
    if (opts.cancel) {
        $inpt
            .off('focus.mm-searchfield-cancel')
            .on('focus.mm-searchfield-cancel', function (e) {
            $cncl.addClass('mm-searchfield__cancel-active');
        });
        $cncl
            .off('click.mm-searchfield-splash')
            .on('click.mm-searchfield-splash', function (e) {
            e.preventDefault();
            $cncl.removeClass('mm-searchfield__cancel-active');
            if ($spnl.hasClass('mm-panel_opened')) {
                _this.openPanel(Mmenu.$(_this.node.pnls).children('.mm-panel_opened-parent').last()[0]);
            }
        });
    }
    if (opts.panel.add && opts.addTo == 'panel') {
        this.bind('openPanel:finish', function (panel) {
            if (panel === $spnl[0]) {
                $inpt.focus();
            }
        });
    }
    $inpt[0].mmSearchfield = data;
    $inpt.off('input.mm-searchfield')
        .on('input.mm-searchfield', function (e) {
        switch (e.keyCode) {
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
                _this.search($inpt);
                break;
        }
    });
    //	Fire once initially
    //	TODO better in initMenu:after or the likes
    this.search($inpt);
};
Mmenu.prototype._initNoResultsMsg = function ($wrpr) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Not in a panel
    if (!$wrpr.closest('.mm-panel').length) {
        $wrpr = Mmenu.$(this.node.pnls).children('.mm-panel').first();
    }
    //	Only once
    if ($wrpr.children('.mm-panel__noresultsmsg').length) {
        return;
    }
    //	Add no-results message
    var $lst = $wrpr.children('.mm-listview').first(), $msg = Mmenu.$('<div class="mm-panel__noresultsmsg mm-hidden" />')
        .append(this.i18n(opts.noResults));
    if ($lst.length) {
        $msg.insertAfter($lst);
    }
    else {
        $msg.prependTo($wrpr);
    }
};
Mmenu.prototype.search = function ($inpt, query) {
    var _this = this;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    $inpt = $inpt || Mmenu.$(this.node.menu).find('.mm-searchfield').children('input').first();
    query = query || '' + $inpt.val();
    query = query.toLowerCase().trim();
    var _anchor = 'a', _both = 'a, span';
    var data = $inpt[0].mmSearchfield;
    var $srch = $inpt.closest('.mm-searchfield'), $btns = $srch.find('.mm-btn'), $spnl = Mmenu.$(this.node.pnls).children('.mm-panel_search'), $pnls = data.$pnls, $itms = data.$itms, $dvdr = data.$dvdr, $nrsp = data.$nrsp;
    //	Reset previous results
    $itms
        .removeClass('mm-listitem_nosubitems')
        .find('.mm-btn_fullwidth-search')
        .removeClass('mm-btn_fullwidth-search mm-btn_fullwidth');
    $spnl.children('.mm-listview').empty();
    $pnls.scrollTop(0);
    //	Search
    if (query.length) {
        //	Initially hide all listitems
        $itms
            .add($dvdr)
            .addClass('mm-hidden');
        //	Re-show only listitems that match
        $itms
            .each(function (i, elem) {
            var $item = Mmenu.$(elem), _search = _anchor;
            if (opts.showTextItems || (opts.showSubPanels && $item.find('.mm-btn_next'))) {
                _search = _both;
            }
            if ($item.children(_search).not('.mm-btn_next').text().toLowerCase().indexOf(query) > -1) {
                $item.removeClass('mm-hidden');
            }
        });
        //	Show all mached listitems in the search panel
        if (opts.panel.add) {
            //	Clone all matched listitems into the search panel
            var listitems = [];
            $pnls
                .each(function (p, panel) {
                var items = Mmenu.filterListItems(Mmenu.DOM.find(panel, '.mm-listitem'));
                if (items.length) {
                    if (opts.panel.dividers) {
                        var divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.innerHTML = panel.querySelector('.mm-navbar__title').innerHTML;
                        listitems.push(divider);
                    }
                    items.forEach(function (item) {
                        listitems.push(item.cloneNode(true));
                    });
                }
            });
            //	Remove toggles, checks and open buttons
            listitems.forEach(function (listitem) {
                listitem.querySelectorAll('.mm-toggle, .mm-check, .mm-btn')
                    .forEach(function (element) {
                    element.remove();
                });
            });
            //	Add to the search panel
            $spnl.children('.mm-listview').append(listitems);
            //	Open the search panel
            this.openPanel($spnl[0]);
        }
        else {
            //	Also show listitems in sub-panels for matched listitems
            if (opts.showSubPanels) {
                $pnls.each(function (p, panel) {
                    var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                    Mmenu.filterListItems(listitems)
                        .forEach(function (listitem) {
                        var child = listitem.mmChild;
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
            Mmenu.$($pnls.get().reverse())
                .each(function (p, panel) {
                var $panel = Mmenu.$(panel), parent = panel.mmParent;
                if (parent) {
                    //	The current panel has mached listitems
                    var listitems_1 = Mmenu.DOM.find(panel, '.mm-listitem');
                    if (Mmenu.filterListItems(listitems_1).length) {
                        //	Show parent
                        if (parent.matches('.mm-hidden')) {
                            Mmenu.$(parent)
                                .removeClass('mm-hidden')
                                .children('.mm-btn_next')
                                .not('.mm-btn_fullwidth')
                                .addClass('mm-btn_fullwidth')
                                .addClass('mm-btn_fullwidth-search');
                        }
                    }
                    else if (!$inpt.closest('.mm-panel').length) {
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
            $pnls.each(function (p, panel) {
                var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                Mmenu.filterListItems(listitems)
                    .forEach(function (listitem) {
                    Mmenu.$(listitem).prevAll('.mm-listitem_divider')
                        .first()
                        .removeClass('mm-hidden');
                });
            });
        }
        //	Show submit / clear button
        $btns.removeClass('mm-hidden');
        //	Show/hide no results message
        $nrsp.find('.mm-panel__noresultsmsg')[$itms.not('.mm-hidden').length ? 'addClass' : 'removeClass']('mm-hidden');
        if (opts.panel.add) {
            //	Hide splash
            if (opts.panel.splash) {
                $spnl.find('.mm-panel__searchsplash').addClass('mm-hidden');
            }
            //	Re-show original listitems when in search panel
            $itms
                .add($dvdr)
                .removeClass('mm-hidden');
        }
    }
    //	Don't search
    else {
        //	Show all items
        $itms
            .add($dvdr)
            .removeClass('mm-hidden');
        //	Hide submit / clear button
        $btns.addClass('mm-hidden');
        //	Hide no results message
        $nrsp.find('.mm-panel__noresultsmsg').addClass('mm-hidden');
        if (opts.panel.add) {
            //	Show splash
            if (opts.panel.splash) {
                $spnl.find('.mm-panel__searchsplash').removeClass('mm-hidden');
            }
            //	Close panel 
            else if (!$inpt.closest('.mm-panel_search').length) {
                this.openPanel(Mmenu.$(this.node.pnls).children('.mm-panel_opened-parent').last()[0]);
            }
        }
    }
    //	Update for other addons
    this.trigger('updateListview');
};

Mmenu.addons.sectionIndexer = function () {
    var _this = this;
    var opts = this.opts.sectionIndexer;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.sectionIndexer = Mmenu.extend(opts, Mmenu.options.sectionIndexer);
    if (!opts.add) {
        return;
    }
    this.bind('initPanels:after', function (panels) {
        var $panels = Mmenu.$(panels);
        //	Set the panel(s)
        if (opts.addTo != 'panels') {
            //	TODO addTo kan ook een HTML element zijn?
            panels = Mmenu.DOM.find(_this.node.menu, opts.addTo)
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
            //	Scroll onMouseOver
            Mmenu.$(_this.node.indx)
                .on('mouseover.mm-sectionIndexer touchstart.mm-sectionIndexer', 'a', function (e) {
                var letter = e.target.innerText, panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
                var $panl = Mmenu.$(_this.node.pnls).children('.mm-panel_opened'), $list = $panl.find('.mm-listview');
                var newTop = -1, oldTop = panel.scrollTop;
                panel.scrollTop = 0;
                Mmenu.DOM.find(panel, '.mm-listitem_divider')
                    .filter(function (divider) { return !divider.matches('.mm-hidden'); })
                    .forEach(function (divider) {
                    if (newTop < 0 &&
                        letter == divider.innerText.trim().slice(0, 1).toLowerCase()) {
                        newTop = divider.offsetTop;
                    }
                });
                panel.scrollTop = newTop > -1 ? newTop : oldTop;
            });
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
//	Default options and configuration.
Mmenu.options.sectionIndexer = {
    add: false,
    addTo: 'panels'
};

Mmenu.addons.setSelected = function () {
    var _this = this;
    var opts = this.opts.setSelected;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            hover: opts,
            parent: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	Extend shorthand options
    //opts = this.opts.setSelected = jQuery.extend( true, {}, Mmenu.options.setSelected, opts );
    this.opts.setSelected = Mmenu.extend(opts, Mmenu.options.setSelected);
    //	Find current by URL
    if (opts.current == 'detect') {
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
    else if (!opts.current) {
        this.bind('initListview:after', function (panel) {
            Mmenu.DOM.find(panel, '.mm-listitem_selected')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected');
            });
        });
    }
    //	Add :hover effect on items
    if (opts.hover) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-hover');
        });
    }
    //	Set parent item selected for submenus
    if (opts.parent) {
        this.bind('openPanel:finish', function (panel) {
            //	Remove all
            Mmenu.DOM.find(_this.node.pnls, '.mm-listitem_selected-parent')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected-parent');
            });
            //	Move up the DOM tree
            var parent = panel.mmParent;
            while (parent) {
                Mmenu.$(parent)
                    .not('.mm-listitem_vertical')
                    .addClass('mm-listitem_selected-parent');
                parent = parent.closest('.mm-panel');
                parent = parent.mmParent;
            }
        });
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-parent');
        });
    }
};
//	Default options and configuration.
Mmenu.options.setSelected = {
    current: true,
    hover: false,
    parent: false
};

Mmenu.addons.sidebar = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var opts = this.opts.sidebar;
    //	Extend shorthand options
    if (typeof opts == 'string' ||
        (typeof opts == 'boolean' && opts) ||
        typeof opts == 'number') {
        opts = {
            expanded: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	Extend collapsed shorthand options.
    if (typeof opts.collapsed == 'boolean' && opts.collapsed) {
        opts.collapsed = {
            use: 'all'
        };
    }
    if (typeof opts.collapsed == 'string' ||
        typeof opts.collapsed == 'number') {
        opts.collapsed = {
            use: opts.collapsed
        };
    }
    if (typeof opts.collapsed != 'object') {
        opts.collapsed = {};
    }
    if (typeof opts.collapsed.use == 'number') {
        opts.collapsed.use = '(min-width: ' + opts.collapsed.use + 'px)';
    }
    //	Extend expanded shorthand options.
    if (typeof opts.expanded == 'boolean' && opts.expanded) {
        opts.expanded = {
            use: 'all'
        };
    }
    if (typeof opts.expanded == 'string' ||
        typeof opts.expanded == 'number') {
        opts.expanded = {
            use: opts.expanded
        };
    }
    if (typeof opts.expanded != 'object') {
        opts.expanded = {};
    }
    if (typeof opts.expanded.use == 'number') {
        opts.expanded.use = '(min-width: ' + opts.expanded.use + 'px)';
    }
    //	/Extend shorthand options
    //opts = this.opts.sidebar = jQuery.extend( true, {}, Mmenu.options.sidebar, opts );
    this.opts.sidebar = Mmenu.extend(opts, Mmenu.options.sidebar);
    var clsclpsd = 'mm-wrapper_sidebar-collapsed', clsxpndd = 'mm-wrapper_sidebar-expanded';
    //	Collapsed
    if (opts.collapsed.use) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_sidebar-collapsed');
            if (opts.collapsed.blockMenu &&
                _this.opts.offCanvas &&
                !Mmenu.DOM.children(_this.node.menu, '.mm-menu__blocker')[0]) {
                Mmenu.$(_this.node.menu).prepend('<a class="mm-menu__blocker" href="#' + _this.node.menu.id + '" />');
            }
            if (opts.collapsed.hideNavbar) {
                _this.node.menu.classList.add('mm-menu_hidenavbar');
            }
            if (opts.collapsed.hideDivider) {
                _this.node.menu.classList.add('mm-menu_hidedivider');
            }
        });
        if (typeof opts.collapsed.use == 'boolean') {
            this.bind('initMenu:after', function () {
                document.documentElement.classList.add(clsclpsd);
            });
        }
        else {
            this.matchMedia(opts.collapsed.use, function () {
                document.documentElement.classList.add(clsclpsd);
            }, function () {
                document.documentElement.classList.remove(clsclpsd);
            });
        }
    }
    //	Expanded
    if (opts.expanded.use) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_sidebar-expanded');
        });
        if (typeof opts.expanded.use == 'boolean') {
            this.bind('initMenu:after', function () {
                document.documentElement.classList.add(clsxpndd);
                _this.open();
            });
        }
        else {
            this.matchMedia(opts.expanded.use, function () {
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
//	Default options and configuration.
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
//	Default options and configuration.
Mmenu.configs.classNames.toggles = {
    toggle: 'Toggle',
    check: 'Check'
};

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
                var text = Mmenu.DOM.find(current, '.mm-navbar__title')[0].innerText;
                if (text.length) {
                    crumbs.unshift(first ? '<span>' + text + '</span>' : '<a href="#' + current.id + '">' + text + '</a>');
                }
                first = false;
            }
            current = current.mmParent;
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
            var parent = panel.mmParent;
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

Mmenu.wrappers.angular = function () {
    this.opts.onClick = {
        close: true,
        preventDefault: false,
        setSelected: true
    };
};

Mmenu.wrappers.bootstrap3=function(){var a=this;if(this.node.menu.classList.contains("navbar-collapse")){this.conf.classNames.selected="active",this.conf.classNames.divider="divider",this.conf.clone=!0,this.opts.hooks=this.opts.hooks||{};for(var n="",e=["nav-tabs","nav-pills","navbar-nav"],o=0;o<e.length;o++)if(this.node.menu.querySelector("."+e[o])){n=e[o];break}n.length&&(this.opts.hooks["initMenu:before"]=function(){"navbar-nav"==n&&Mmenu.$(a.node.menu).wrapInner("<div />")},this.opts.hooks["initMenu:after"]=function(){t.menu.call(a),t.dropdown.call(a),t[n.split("nav-").join("").split("-nav").join("")].call(a)})}var t={menu:function(){Mmenu.$(a.node.menu).find(".nav").removeClass("nav").end().find(".sr-only").remove().end().find(".divider:empty").remove();for(var n=["role","aria-haspopup","aria-expanded"],e=0;e<n.length;e++)Mmenu.$(a.node.menu).find("["+n[e]+"]").removeAttr(n[e])},dropdown:function(){var n=Mmenu.$(a.node.menu).find(".dropdown");n.removeClass("dropdown"),n.children(".dropdown-toggle").find(".caret").remove().end().each(function(n,e){Mmenu.$(e).replaceWith("<span>"+Mmenu.$(e).html()+"</span>")}),n.children(".dropdown-menu").removeClass("dropdown-menu")},tabs:function(){Mmenu.$(a.node.menu).find(".nav-tabs").removeClass("nav-tabs")},pills:function(){Mmenu.$(a.node.menu).find(".nav-pills").removeClass("nav-pills")},navbar:function(){Mmenu.$(a.node.menu).removeClass("collapse navbar-collapse").find('[class*="navbar-"]').removeClass("navbar-left navbar-right navbar-nav navbar-text navbar-btn");var n=Mmenu.$(a.node.menu).find(".navbar-form");a.conf.searchfield={form:{action:n[0].getAttribute("action"),method:n[0].getAttribute("method")},input:{name:n.find("input")[0].getAttribute("name")},submit:!0,clear:!1},n.remove(),(Mmenu.$(a.node.orig)||Mmenu.$(a.node.menu)).closest(".navbar").find(".navbar-header").find(".navbar-toggle").off("click").on("click",function(n){a.open(),n.stopImmediatePropagation(),n.preventDefault()})}}};
Mmenu.wrappers.bootstrap4 = function () {
    var _this = this;
    //	Create the menu
    if (this.node.menu.matches('.navbar-collapse')) {
        //	No need for cloning the menu...
        this.conf.clone = false;
        //	... We'll create a new menu
        var nav = Mmenu.DOM.create('nav'), $pnl = Mmenu.$('<div />');
        nav.append($pnl[0]);
        Mmenu.$(this.node.menu)
            .children()
            .each(function (i, elem) {
            var $t = Mmenu.$(elem);
            switch (true) {
                case $t.hasClass('navbar-nav'):
                    $pnl.append(cloneNav($t));
                    break;
                case $t.hasClass('dropdown-menu'):
                    $pnl.append(cloneDropdown($t));
                    break;
                case $t.hasClass('form-inline'):
                    _this.conf.searchfield.form = {
                        action: $t[0].getAttribute('action') || null,
                        method: $t[0].getAttribute('method') || null
                    };
                    _this.conf.searchfield.input = {
                        name: $t.find('input')[0].getAttribute('name') || null
                    };
                    _this.conf.searchfield.clear = false;
                    _this.conf.searchfield.submit = true;
                    break;
                default:
                    $pnl.append($t.clone(true));
                    break;
            }
        });
        //	Set the menu
        this.bind('initMenu:before', function () {
            document.body.prepend(nav);
            _this.node.menu = nav;
        });
        //	Hijack the toggler
        var toggler = this.node.menu.parentElement.querySelector('.navbar-toggler');
        toggler.removeAttribute('data-target');
        toggler.removeAttribute('aria-controls');
        Mmenu.$(toggler)
            .off('click')
            .on('click', function (evnt) {
            evnt.preventDefault();
            evnt.stopImmediatePropagation();
            _this[_this.vars.opened ? 'close' : 'open']();
        });
    }
    function cloneLink($a) {
        var $i = Mmenu.$('<a />');
        var attr = ['href', 'title', 'target'];
        for (var a = 0; a < attr.length; a++) {
            if (typeof $a.attr(attr[a]) != 'undefined') {
                $i[0].setAttribute(attr[a], $a[0].getAttribute(attr[a]));
            }
        }
        $i.html($a.html());
        $i.find('.sr-only').remove();
        return $i;
    }
    function cloneDropdown($d) {
        var $ul = Mmenu.$('<ul />');
        $d.children()
            .each(function () {
            var $di = Mmenu.$(this), $li = Mmenu.$('<li />');
            if ($di.hasClass('dropdown-divider')) {
                $li.addClass('Divider');
            }
            else if ($di.hasClass('dropdown-item')) {
                $li.append(cloneLink($di));
            }
            $ul.append($li);
        });
        return $ul;
    }
    function cloneNav($n) {
        var $ul = Mmenu.$('<ul />');
        $n.find('.nav-item')
            .each(function () {
            var $ni = Mmenu.$(this), $li = Mmenu.$('<li />');
            if ($ni.hasClass('active')) {
                $li.addClass('Selected');
            }
            if (!$ni.hasClass('nav-link')) {
                var $dd = $ni.children('.dropdown-menu');
                if ($dd.length) {
                    $li.append(cloneDropdown($dd));
                }
                $ni = $ni.children('.nav-link');
            }
            $li.prepend(cloneLink($ni));
            $ul.append($li);
        });
        return $ul;
    }
};

Mmenu.wrappers.jqueryMobile=function(){var t=this;this.opts.onClick.close=!1,this.conf.offCanvas.page.selector="div.ui-page-active",Mmenu.$("body").on("pagecontainerchange",function(e,n){t.opts.offCanvas&&("function"==typeof t.close&&t.close(),"function"==typeof t.close&&t.setPage(n.toPage))}),this.bind("initAnchors:after",function(){Mmenu.$("body").on("click",".mm-listview a",function(e){e.isDefaultPrevented()||(e.preventDefault(),Mmenu.$("body").pagecontainer("change",e.currentTarget.getAttribute("href")))})})};
Mmenu.wrappers.magento = function () {
    this.conf.classNames.selected = 'active';
};

Mmenu.wrappers.olark = function () {
    this.conf.offCanvas.page.noSelector.push('#olark');
};

Mmenu.wrappers.turbolinks = function () {
    var classnames, html;
    Mmenu.$(document)
        //	Store the HTML classnames onDocumentReady
        .on('turbolinks:before-visit', function () {
        html = document.documentElement;
        classnames = html.getAttribute('class');
        classnames = Mmenu.$.grep(classnames.split(/\s+/), function (name) {
            return !/mm-/.test(name);
        }).join(' ');
    })
        //	Reset the HTML classnames when changing pages
        .on('turbolinks:load', function () {
        if (typeof html === 'undefined') {
            return;
        }
        html.setAttribute('class', classnames);
    });
};

Mmenu.wrappers.wordpress = function () {
    this.conf.classNames.selected = 'current-menu-item';
    var wpadminbar = document.getElementById('wpadminbar');
    wpadminbar.style.position = 'fixed';
    wpadminbar.classList.add('mm-slideout');
};

return Mmenu;
}));
