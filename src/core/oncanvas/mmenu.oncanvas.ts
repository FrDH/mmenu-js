import options from './_options';
import configs from './_configs';
import translate from './translations/translate';
import * as DOM from '../../_modules/dom';
import * as i18n from '../../_modules/i18n';
import * as media from '../../_modules/matchmedia';
import {
    type,
    extend,
    transitionend,
    uniqueId,
    valueOrFn,
} from '../../_modules/helpers';

//  Add the translations.
translate();

/**
 * Class for a mobile menu.
 */
export default class Mmenu {

    /**	Default options for menus. */
    static options: mmOptions = options;

    /**	Default configuration for menus. */
    static configs: mmConfigs = configs;

    /**	Available add-ons for the plugin. */
    static addons: mmLooseObject = {};

    /** Available wrappers for the plugin. */
    static wrappers: mmFunctionObject = {};

    /**	Globally used HTML elements. */
    static node: mmHtmlObject = {};

    /** Globally used variables. */
    static vars: mmLooseObject = {};

    /**	Options for the menu. */
    opts: mmOptions;

    /** Configuration for the menu. */
    conf: mmConfigs;

    /**	Array of method names to expose in the API. */
    _api: string[];

    /** The API. */
    API: mmApi;

    /** HTML elements used for the menu. */
    node: mmHtmlObject;

    /** Variables used for the menu. */
    vars: mmLooseObject;

    /** Callback hooks used for the menu. */
    hook: mmLooseObject;

    /** Click handlers used for the menu. */
    clck: Function[];

    /** Log deprecated warnings when using the debugger. */
    _deprecatedWarnings: Function;

    //	screenReader add-on
    static sr_aria: Function;
    static sr_role: Function;
    static sr_text: Function;

    //	offCanvas add-on

    /** Open the menu. */
    open: Function;

    /** Setup the menu so it can be opened. */
    _openSetup: Function;

    /** The menu starts opening. */
    _openStart: Function;

    /** Close the menu. */
    close: Function;

    /** Close all other menus. */
    closeAllOthers: Function;

    /** Set the page HTML element. */
    setPage: Function;

    //	searchfield add-on

    /** Search the menu */
    search: Function;

    /**
     * Create a mobile menu.
     * @param {HTMLElement|string} 	menu						The menu node.
     * @param {object} 				[options=Mmenu.options]		Options for the menu.
     * @param {object} 				[configs=Mmenu.configs]		Configuration options for the menu.
     */
    constructor(
        menu: HTMLElement | string,
        options?: mmOptions,
        configs?: mmConfigs
    ) {
        //	Extend options and configuration from defaults.
        this.opts = extend(options, Mmenu.options);
        this.conf = extend(configs, Mmenu.configs);

        //	Methods to expose in the API.
        this._api = [
            'bind',
            'initPanel',
            'initListview',
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
     * @param {HTMLElement} panel				Panel to open.
     * @param {boolean}		[animation=true]	Whether or not to open the panel with an animation.
     */
    openPanel(panel: HTMLElement, animation?: boolean) {
        //	Invoke "before" hook.
        this.trigger('openPanel:before', [panel]);

        //	Find panel.
        if (!panel) {
            return;
        }
        if (!panel.matches('.mm-panel')) {
            panel = panel.closest('.mm-panel') as HTMLElement;
        }
        if (!panel) {
            return;
        }
        //	/Find panel.

        if (typeof animation != 'boolean') {
            animation = true;
        }

        //	Open a "vertical" panel.
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            //	Open current and all vertical parent panels.
            DOM.parents(panel, '.mm-listitem_vertical').forEach((listitem) => {
                listitem.classList.add('mm-listitem_opened');
                DOM.children(listitem, '.mm-panel').forEach((panel) => {
                    panel.classList.remove('mm-hidden');
                });
            });

            //	Open first non-vertical parent panel.
            let parents = DOM.parents(panel, '.mm-panel').filter(
                (panel) => !panel.parentElement.matches('.mm-listitem_vertical')
            );

            this.trigger('openPanel:start', [panel]);

            if (parents.length) {
                this.openPanel(parents[0]);
            }

            this.trigger('openPanel:finish', [panel]);

            //	Open a "horizontal" panel.
        } else {
            if (panel.matches('.mm-panel_opened')) {
                return;
            }

            let panels = DOM.children(this.node.pnls, '.mm-panel'),
                current = DOM.children(this.node.pnls, '.mm-panel_opened')[0];

            //	Close all child panels.
            panels
                .filter((parent) => parent !== panel)
                .forEach((parent) => {
                    parent.classList.remove('mm-panel_opened-parent');
                });

            //	Open all parent panels.
            let parent: HTMLElement = panel['mmParent'];
            while (parent) {
                parent = parent.closest('.mm-panel') as HTMLElement;
                if (parent) {
                    if (
                        !parent.parentElement.matches('.mm-listitem_vertical')
                    ) {
                        parent.classList.add('mm-panel_opened-parent');
                    }
                    parent = parent['mmParent'];
                }
            }

            //	Add classes for animation.
            panels.forEach((panel) => {
                panel.classList.remove('mm-panel_highest');
            });

            panels
                .filter((hidden) => hidden !== current)
                .filter((hidden) => hidden !== panel)
                .forEach((hidden) => {
                    hidden.classList.add('mm-hidden');
                });

            panel.classList.remove('mm-hidden');

            /**	Start opening the panel. */
            let openPanelStart = () => {
                if (current) {
                    current.classList.remove('mm-panel_opened');
                }
                panel.classList.add('mm-panel_opened');

                if (panel.matches('.mm-panel_opened-parent')) {
                    if (current) {
                        current.classList.add('mm-panel_highest');
                    }
                    panel.classList.remove('mm-panel_opened-parent');
                } else {
                    if (current) {
                        current.classList.add('mm-panel_opened-parent');
                    }
                    panel.classList.add('mm-panel_highest');
                }

                //	Invoke "start" hook.
                this.trigger('openPanel:start', [panel]);
            };

            /**	Finish opening the panel. */
            let openPanelFinish = () => {
                if (current) {
                    current.classList.remove('mm-panel_highest');
                    current.classList.add('mm-hidden');
                }
                panel.classList.remove('mm-panel_highest');

                //	Invoke "finish" hook.
                this.trigger('openPanel:finish', [panel]);
            };

            if (animation && !panel.matches('.mm-panel_noanimation')) {
                //	Without the timeout the animation will not work because the element had display: none;
                setTimeout(() => {
                    //	Callback
                    transitionend(
                        panel,
                        () => {
                            openPanelFinish();
                        },
                        this.conf.transitionDuration
                    );

                    openPanelStart();
                }, this.conf.openingInterval);
            } else {
                openPanelStart();
                openPanelFinish();
            }
        }

        //	Invoke "after" hook.
        this.trigger('openPanel:after', [panel]);
    }

    /**
     * Close a panel.
     * @param {HTMLElement} panel Panel to close.
     */
    closePanel(panel: HTMLElement) {
        //	Invoke "before" hook.
        this.trigger('closePanel:before', [panel]);

        var li = panel.parentElement;

        //	Only works for "vertical" panels.
        if (li.matches('.mm-listitem_vertical')) {
            li.classList.remove('mm-listitem_opened');
            panel.classList.add('mm-hidden');

            //	Invoke main hook.
            this.trigger('closePanel', [panel]);
        }

        //	Invoke "after" hook.
        this.trigger('closePanel:after', [panel]);
    }

    /**
     * Close all opened panels.
     * @param {HTMLElement} panel Panel to open after closing all other panels.
     */
    closeAllPanels(panel?: HTMLElement) {
        //	Invoke "before" hook.
        this.trigger('closeAllPanels:before');

        //	Close all "vertical" panels.
        let listitems = this.node.pnls.querySelectorAll('.mm-listitem');
        listitems.forEach((listitem) => {
            listitem.classList.remove('mm-listitem_selected');
            listitem.classList.remove('mm-listitem_opened');
        });

        //	Close all "horizontal" panels.
        var panels = DOM.children(this.node.pnls, '.mm-panel'),
            opened = panel ? panel : panels[0];

        DOM.children(this.node.pnls, '.mm-panel').forEach((panel) => {
            if (panel !== opened) {
                panel.classList.remove('mm-panel_opened');
                panel.classList.remove('mm-panel_opened-parent');
                panel.classList.remove('mm-panel_highest');
                panel.classList.add('mm-hidden');
            }
        });

        //	Open first panel.
        this.openPanel(opened, false);

        //	Invoke "after" hook.
        this.trigger('closeAllPanels:after');
    }

    /**
     * Toggle a panel opened/closed.
     * @param {HTMLElement} panel Panel to open or close.
     */
    togglePanel(panel: HTMLElement) {
        let listitem = panel.parentElement;

        //	Only works for "vertical" panels.
        if (listitem.matches('.mm-listitem_vertical')) {
            this[
                listitem.matches('.mm-listitem_opened')
                    ? 'closePanel'
                    : 'openPanel'
            ](panel);
        }
    }

    /**
     * Display a listitem as being "selected".
     * @param {HTMLElement} listitem Listitem to mark.
     */
    setSelected(listitem: HTMLElement) {
        //	Invoke "before" hook.
        this.trigger('setSelected:before', [listitem]);

        //	First, remove the selected class from all listitems.
        DOM.find(this.node.menu, '.mm-listitem_selected').forEach((li) => {
            li.classList.remove('mm-listitem_selected');
        });

        //	Next, add the selected class to the provided listitem.
        listitem.classList.add('mm-listitem_selected');

        //	Invoke "after" hook.
        this.trigger('setSelected:after', [listitem]);
    }

    /**
     * Bind functions to a hook (subscriber).
     * @param {string} 		hook The hook.
     * @param {function} 	func The function.
     */
    bind(hook: string, func: Function) {
        //	Create an array for the hook if it does not yet excist.
        this.hook[hook] = this.hook[hook] || [];

        //	Push the function to the array.
        this.hook[hook].push(func);
    }

    /**
     * Invoke the functions bound to a hook (publisher).
     * @param {string} 	hook  	The hook.
     * @param {array}	[args] 	Arguments for the function.
     */
    trigger(hook: string, args?: any[]) {
        if (this.hook[hook]) {
            for (var h = 0, l = this.hook[hook].length; h < l; h++) {
                this.hook[hook][h].apply(this, args);
            }
        }
    }

    /**
     * Create the API.
     */
    _initAPI() {
        //	We need this=that because:
        //	1) the "arguments" object can not be referenced in an arrow function in ES3 and ES5.
        var that = this;

        (this.API as mmLooseObject) = {};

        this._api.forEach((fn) => {
            this.API[fn] = function () {
                var re = that[fn].apply(that, arguments); // 1)
                return typeof re == 'undefined' ? that.API : re;
            };
        });

        //	Store the API in the HTML node for external usage.
        this.node.menu['mmApi'] = this.API;
    }

    /**
     * Bind the hooks specified in the options (publisher).
     */
    _initHooks() {
        for (let hook in this.opts.hooks) {
            this.bind(hook, this.opts.hooks[hook]);
        }
    }

    /**
     * Initialize the wrappers specified in the options.
     */
    _initWrappers() {
        //	Invoke "before" hook.
        this.trigger('initWrappers:before');

        for (let w = 0; w < this.opts.wrappers.length; w++) {
            let wrpr = Mmenu.wrappers[this.opts.wrappers[w]];
            if (typeof wrpr == 'function') {
                wrpr.call(this);
            }
        }

        //	Invoke "after" hook.
        this.trigger('initWrappers:after');
    }

    /**
     * Initialize all available add-ons.
     */
    _initAddons() {
        //	Invoke "before" hook.
        this.trigger('initAddons:before');

        for (let addon in Mmenu.addons) {
            Mmenu.addons[addon].call(this);
        }

        //	Invoke "after" hook.
        this.trigger('initAddons:after');
    }

    /**
     * Initialize the extensions specified in the options.
     */
    _initExtensions() {
        //	Invoke "before" hook.
        this.trigger('initExtensions:before');

        //	Convert array to object with array.
        if (type(this.opts.extensions) == 'array') {
            this.opts.extensions = {
                all: this.opts.extensions,
            };
        }

        //	Loop over object.
        Object.keys(this.opts.extensions).forEach((query) => {
            let classnames = this.opts.extensions[query].map(
                (extension) => 'mm-menu_' + extension
            );

            if (classnames.length) {
                media.add(
                    query,
                    () => {
                        //  IE11:
                        classnames.forEach((classname) => {
                            this.node.menu.classList.add(classname);
                        });

                        //  Better browsers:
                        // this.node.menu.classList.add(...classnames);
                    },
                    () => {
                        //  IE11:
                        classnames.forEach((classname) => {
                            this.node.menu.classList.remove(classname);
                        });

                        //  Better browsers:
                        // this.node.menu.classList.remove(...classnames);
                    }
                );
            }
        });

        //	Invoke "after" hook.
        this.trigger('initExtensions:after');
    }

    /**
     * Initialize the menu.
     */
    _initMenu() {
        //	Invoke "before" hook.
        this.trigger('initMenu:before');

        //	Add class to the wrapper.
        this.node.wrpr = this.node.wrpr || this.node.menu.parentElement;
        this.node.wrpr.classList.add('mm-wrapper');

        //	Add an ID to the menu if it does not yet have one.
        this.node.menu.id = this.node.menu.id || uniqueId();

        //	Wrap the panels in a node.
        let panels = DOM.create('div.mm-panels');

        DOM.children(this.node.menu).forEach((panel) => {
            if (
                this.conf.panelNodetype.indexOf(panel.nodeName.toLowerCase()) >
                -1
            ) {
                panels.append(panel);
            }
        });

        this.node.menu.append(panels);
        this.node.pnls = panels;

        //	Add class to the menu.
        this.node.menu.classList.add('mm-menu');

        //	Invoke "after" hook.
        this.trigger('initMenu:after');
    }

    /**
     * Initialize panels.
     */
    _initPanels() {
        //	Invoke "before" hook.
        this.trigger('initPanels:before');

        //	Open / close panels.
        this.clck.push((anchor: HTMLElement, args: mmClickArguments) => {
            if (args.inMenu) {
                var href = anchor.getAttribute('href');
                if (href && href.length > 1 && href.slice(0, 1) == '#') {
                    try {
                        let panel = DOM.find(this.node.menu, href)[0];
                        if (panel && panel.matches('.mm-panel')) {
                            if (
                                anchor.parentElement.matches(
                                    '.mm-listitem_vertical'
                                )
                            ) {
                                this.togglePanel(panel);
                            } else {
                                this.openPanel(panel);
                            }
                            return true;
                        }
                    } catch (err) {}
                }
            }
        });

        /** The panels to initiate */
        const panels = DOM.children(this.node.pnls);

        panels.forEach((panel) => {
            this.initPanel(panel);
        });

        //	Invoke "after" hook.
        this.trigger('initPanels:after');
    }

    /**
     * Initialize a single panel and its children.
     * @param {HTMLElement} panel The panel to initialize.
     */
    initPanel(panel: HTMLElement) {
        /** Query selector for possible node-types for panels. */
        var panelNodetype = this.conf.panelNodetype.join(', ');

        if (panel.matches(panelNodetype)) {
            //  Only once
            if (!panel.matches('.mm-panel')) {
                panel = this._initPanel(panel);
            }

            if (panel) {
                /** The sub panels. */
                let children: HTMLElement[] = [];

                //	Find panel > panel
                children.push(
                    ...DOM.children(panel, '.' + this.conf.classNames.panel)
                );

                //	Find panel listitem > panel
                DOM.children(panel, '.mm-listview').forEach((listview) => {
                    DOM.children(listview, '.mm-listitem').forEach(
                        (listitem) => {
                            children.push(
                                ...DOM.children(listitem, panelNodetype)
                            );
                        }
                    );
                });

                //  Initiate subpanel(s).
                children.forEach((child) => {
                    this.initPanel(child);
                });
            }
        }
    }

    /**
     * Initialize a single panel.
     * @param  {HTMLElement} 		panel 	Panel to initialize.
     * @return {HTMLElement|null} 			Initialized panel.
     */
    _initPanel(panel: HTMLElement): HTMLElement {
        //	Invoke "before" hook.
        this.trigger('initPanel:before', [panel]);

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

        /** The original ID on the node. */
        var id = panel.id || uniqueId();

        //  Vertical panel.
        var vertical =
            panel.matches('.' + this.conf.classNames.vertical) ||
            !this.opts.slidingSubmenus;

        panel.classList.remove(this.conf.classNames.vertical);

        //	Wrap UL/OL in DIV
        if (panel.matches('ul, ol')) {
            panel.removeAttribute('id');

            /** The panel. */
            let wrapper = DOM.create('div');

            //	Wrap the listview in the panel.
            panel.before(wrapper);
            wrapper.append(panel);
            panel = wrapper;
        }

        panel.id = id;
        panel.classList.add('mm-panel');
        panel.classList.add('mm-hidden');

        /** The parent listitem. */
        var parent = [panel.parentElement].filter((listitem) =>
            listitem.matches('li')
        )[0];

        if (vertical) {
            if (parent) {
                parent.classList.add('mm-listitem_vertical');
            }
        } else {
            this.node.pnls.append(panel);
        }

        if (parent) {
            //	Store parent/child relation.
            parent['mmChild'] = panel;
            panel['mmParent'] = parent;

            //	Add open link to parent listitem
            if (parent && parent.matches('.mm-listitem')) {
                if (!DOM.children(parent, '.mm-btn').length) {
                    /** The text node. */
                    let item = DOM.children(parent, '.mm-listitem__text')[0];

                    if (item) {
                        /** The open link. */
                        let button = DOM.create(
                            'a.mm-btn.mm-btn_next.mm-listitem__btn'
                        );
                        button.setAttribute('href', '#' + panel.id);

                        //  If the item has no link,
                        //      Replace the item with the open link.
                        if (item.matches('span')) {
                            button.classList.add('mm-listitem__text');
                            button.innerHTML = item.innerHTML;
                            parent.insertBefore(
                                button,
                                item.nextElementSibling
                            );
                            item.remove();
                        }

                        //  Otherwise, insert the button after the text.
                        else {
                            parent.insertBefore(
                                button,
                                DOM.children(parent, '.mm-panel')[0]
                            );
                        }
                    }
                }
            }
        }

        this._initNavbar(panel);

        DOM.children(panel, 'ul, ol').forEach((listview) => {
            this.initListview(listview);
        });

        //	Invoke "after" hook.
        this.trigger('initPanel:after', [panel]);

        return panel;
    }

    /**
     * Initialize a navbar.
     * @param {HTMLElement} panel Panel for the navbar.
     */
    _initNavbar(panel: HTMLElement) {
        //	Invoke "before" hook.
        this.trigger('initNavbar:before', [panel]);

        //	Only one navbar per panel.
        if (DOM.children(panel, '.mm-navbar').length) {
            return;
        }

        /** The parent listitem. */
        let parentListitem: HTMLElement = null;

        /** The parent panel. */
        let parentPanel: HTMLElement = null;

        //  The parent panel was specified in the data-mm-parent attribute.
        if (panel.getAttribute('data-mm-parent')) {
            parentPanel = DOM.find(
                this.node.pnls,
                panel.getAttribute('data-mm-parent')
            )[0];
        }
        // if (panel.dataset.mmParent) { // IE10 has no dataset
        // parentPanel = DOM.find(this.node.pnls, panel.dataset.mmParent)[0];
        // }

        //  The parent panel from a listitem.
        else {
            parentListitem = panel['mmParent'];

            if (parentListitem) {
                parentPanel = parentListitem.closest(
                    '.mm-panel'
                ) as HTMLElement;
            }
        }

        //  No navbar needed for vertical submenus.
        if (parentListitem && parentListitem.matches('.mm-listitem_vertical')) {
            return;
        }

        /** The navbar element. */
        let navbar = DOM.create('div.mm-navbar');

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
            let prev = DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
            prev.setAttribute('href', '#' + parentPanel.id);

            navbar.append(prev);
        }

        /** The anchor that opens the panel. */
        let opener: HTMLElement = null;

        //  The anchor is in a listitem.
        if (parentListitem) {
            opener = DOM.children(parentListitem, '.mm-listitem__text')[0];
        }

        //  The anchor is in a panel.
        else if (parentPanel) {
            opener = DOM.find(parentPanel, 'a[href="#' + panel.id + '"]')[0];
        }

        //  Add the title.
        let title = DOM.create('a.mm-navbar__title');
        let titleText = DOM.create('span');
        title.append(titleText);
        titleText.innerHTML =
            // panel.dataset.mmTitle || // IE10 has no dataset :(
            panel.getAttribute('data-mm-title') ||
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
    }

    /**
     * Initialize a listview.
     * @param {HTMLElement} listview Listview to initialize.
     */
    initListview(listview: HTMLElement) {
        //	Invoke "before" hook.
        this.trigger('initListview:before', [listview]);

        DOM.reClass(listview, this.conf.classNames.nolistview, 'mm-nolistview');

        if (!listview.matches('.mm-nolistview')) {
            listview.classList.add('mm-listview');

            DOM.children(listview).forEach((listitem) => {
                listitem.classList.add('mm-listitem');

                DOM.reClass(
                    listitem,
                    this.conf.classNames.selected,
                    'mm-listitem_selected'
                );

                DOM.children(listitem, 'a, span').forEach((item) => {
                    if (!item.matches('.mm-btn')) {
                        item.classList.add('mm-listitem__text');
                    }
                });
            });
        }

        //	Invoke "after" hook.
        this.trigger('initListview:after', [listview]);
    }

    /**
     * Find and open the correct panel after creating the menu.
     */
    _initOpened() {
        //	Invoke "before" hook.
        this.trigger('initOpened:before');

        /** The selected listitem(s). */
        let listitems = this.node.pnls.querySelectorAll(
            '.mm-listitem_selected'
        );

        /** The last selected listitem. */
        let lastitem = null;

        //	Deselect the listitems.
        listitems.forEach((listitem) => {
            lastitem = listitem;
            listitem.classList.remove('mm-listitem_selected');
        });

        //	Re-select the last listitem.
        if (lastitem) {
            lastitem.classList.add('mm-listitem_selected');
        }

        /**	The current opened panel. */
        let current = lastitem
            ? lastitem.closest('.mm-panel')
            : DOM.children(this.node.pnls, '.mm-panel')[0];

        //	Open the current opened panel.
        this.openPanel(current, false);

        //	Invoke "after" hook.
        this.trigger('initOpened:after');
    }

    /**
     * Initialize anchors in / for the menu.
     */
    _initAnchors() {
        //	Invoke "before" hook.
        this.trigger('initAnchors:before');

        document.addEventListener(
            'click',
            (evnt) => {
                /** The clicked element. */
                var target = (evnt.target as HTMLElement).closest(
                    'a[href]'
                ) as HTMLElement;
                if (!target) {
                    return;
                }

                /** Arguments passed to the bound methods. */
                var args: mmClickArguments = {
                    inMenu: target.closest('.mm-menu') === this.node.menu,
                    inListview: target.matches('.mm-listitem > a'),
                    toExternal:
                        target.matches('[rel="external"]') ||
                        target.matches('[target="_blank"]'),
                };

                var onClick: mmOptionsOnclick = {
                    close: null,
                    setSelected: null,
                    preventDefault:
                        target.getAttribute('href').slice(0, 1) == '#',
                };

                //	Find hooked behavior.
                for (let c = 0; c < this.clck.length; c++) {
                    let click = this.clck[c].call(this, target, args);

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
                    if (
                        valueOrFn(
                            target,
                            this.opts.onClick.setSelected,
                            onClick.setSelected
                        )
                    ) {
                        this.setSelected(target.parentElement);
                    }

                    //	Prevent default / don't follow link. Default: false.
                    if (
                        valueOrFn(
                            target,
                            this.opts.onClick.preventDefault,
                            onClick.preventDefault
                        )
                    ) {
                        evnt.preventDefault();
                    }

                    //	Close menu. Default: false
                    if (
                        valueOrFn(
                            target,
                            this.opts.onClick.close,
                            onClick.close
                        )
                    ) {
                        if (
                            this.opts.offCanvas &&
                            typeof this.close == 'function'
                        ) {
                            this.close();
                        }
                    }
                }
            },
            true
        );

        //	Invoke "after" hook.
        this.trigger('initAnchors:after');
    }

    /**
     * Get the translation for a text.
     * @param  {string} text 	Text to translate.
     * @return {string}			The translated text.
     */
    i18n(text: string): string {
        return i18n.get(text, this.conf.language);
    }
}
