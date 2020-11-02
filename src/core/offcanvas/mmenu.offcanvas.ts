import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import * as events from '../../_modules/eventlisteners';
import {
    extend,
    transitionend,
    uniqueId,
    originalId,
} from '../../_modules/helpers';

//  Add the options and configs.
Mmenu.options.offCanvas = options;
Mmenu.configs.offCanvas = configs;

export default function (this: Mmenu) {
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
    this.bind('initMenu:before', () => {
        //	Clone if needed.
        if (configs.clone) {
            //	Clone the original menu and store it.
            this.node.menu = this.node.menu.cloneNode(true) as HTMLElement;

            //	Prefix all ID's in the cloned menu.
            if (this.node.menu.id) {
                this.node.menu.id = 'mm-' + this.node.menu.id;
            }
            DOM.find(this.node.menu, '[id]').forEach((elem) => {
                elem.id = 'mm-' + elem.id;
            });
        }

        this.node.wrpr = document.body;

        //	Prepend to the <body>
        document
            .querySelector(configs.menu.insertSelector)
        [configs.menu.insertMethod](this.node.menu);
    });

    this.bind('initMenu:after', () => {
        //	Setup the UI blocker.
        initBlocker.call(this);

        //	Setup the page.
        this.setPage(Mmenu.node.page);

        //	Setup window events.
        initWindow.call(this);

        //	Setup the menu.
        this.node.menu.classList.add('mm-menu--offcanvas');

        //	Open if url hash equals menu id (usefull when user clicks the hamburger icon before the menu is created)
        let hash = window.location.hash;
        if (hash) {
            let id = originalId(this.node.menu.id);
            if (id && id == hash.slice(1)) {
                setTimeout(() => {
                    this.open();
                }, 1000);
            }
        }
    });

    //	Sync the blocker to target the page.
    this.bind('setPage:after', (page: HTMLElement) => {
        if (Mmenu.node.blck) {
            DOM.children(Mmenu.node.blck, 'a').forEach((anchor) => {
                anchor.setAttribute('href', '#' + page.id);
            });
        }
    });

    //	Add screenreader / aria support
    this.bind('open:after:sr-aria', () => {
        sr.aria(this.node.menu, 'hidden', false);
    });
    this.bind('close:after:sr-aria', () => {
        sr.aria(this.node.menu, 'hidden', true);
    });
    this.bind('initMenu:after:sr-aria', () => {
        sr.aria(this.node.menu, 'hidden', true);
    });

    //	Add screenreader / text support
    this.bind('initBlocker:after:sr-text', () => {
        DOM.children(Mmenu.node.blck, 'a').forEach((anchor) => {
            anchor.innerHTML = sr.text(
                this.i18n(this.conf.screenReader.text.closeMenu)
            );
        });
    });

    document.addEventListener('click', event => {


        /** THe href attribute for the clicked anchor. */
        const href = (event.target as HTMLElement).closest('a')?.getAttribute('href');

        switch (href) {
            //	Open menu if the clicked anchor links to the menu.
            case `#${originalId(this.node.menu.id)}`:
                event.preventDefault();
                this.open();
                break;

            //	Close menu if the clicked anchor links to the page.
            case `#${originalId(Mmenu.node.page.id)}`:
                event.preventDefault();
                this.close();
                break;
        }
    });
}

/**
 * Open the menu.
 */
Mmenu.prototype.open = function (this: Mmenu) {
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

Mmenu.prototype._openSetup = function (this: Mmenu) {
    /** The off-canvas options. */
    const options = this.opts.offCanvas;

    var clsn = ['mm-wrapper--opened'];

    //	Add options
    if (options.blockUI) {
        clsn.push('mm-wrapper--blocking');
    }
    if (options.blockUI == 'modal') {
        clsn.push('mm-wrapper--modal');
    }

    this.node.wrpr.classList.add(...clsn);

    //	Open
    this.node.menu.classList.add('mm-menu--opened');
};

/**
 * Finish opening the menu.
 */
Mmenu.prototype._openStart = function (this: Mmenu) {

    //	Opening
    this.node.wrpr.classList.add('mm-wrapper--opening');
};

Mmenu.prototype.close = function (this: Mmenu) {
    //	Invoke "before" hook.
    this.trigger('close:before');

    if (!this.vars.opened) {
        return;
    }

    //  TODO: transitionend er uit
    //	Callback when the page finishes closing.
    transitionend(
        Mmenu.node.page,
        () => {

            this.node.menu.classList.remove('mm-menu--opened');

            this.node.wrpr.classList.remove(
                'mm-wrapper--opened',
                'mm-wrapper--blocking',
                'mm-wrapper--modal',
                'mm-wrapper--background'
            );

            this.vars.opened = false;
        }
    );

    this.node.wrpr.classList.remove('mm-wrapper--opening');

    //	Invoke "after" hook.
    this.trigger('close:after');
};

/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function (this: Mmenu, page: HTMLElement) {
    //	Invoke "before" hook.
    this.trigger('setPage:before', [page]);

    var configs = this.conf.offCanvas;

    //	If no page was specified, find it.
    if (!page) {
        /** Array of elements that are / could be "the page". */
        let pages =
            typeof configs.page.selector == 'string'
                ? DOM.find(document.body, configs.page.selector)
                : DOM.children(document.body, configs.page.nodetype);

        //	Filter out elements that are absolutely not "the page".
        pages = pages.filter(
            (page) => !page.matches('.mm-menu, .mm-wrapper__blocker')
        );

        //	Filter out elements that are configured to not be "the page".
        if (configs.page.noSelector.length) {
            pages = pages.filter(
                (page) => !page.matches(configs.page.noSelector.join(', '))
            );
        }

        //	Wrap multiple pages in a single element.
        if (pages.length > 1) {
            let wrapper = DOM.create('div');
            pages[0].before(wrapper);
            pages.forEach((page) => {
                wrapper.append(page);
            });

            pages = [wrapper];
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
const initWindow = function (this: Mmenu) {
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
const initBlocker = function (this: Mmenu) {
    //	Invoke "before" hook.
    this.trigger('initBlocker:before');

    var options = this.opts.offCanvas,
        configs = this.conf.offCanvas;

    if (!options.blockUI) {
        return;
    }

    //	Create the blocker node.
    if (!Mmenu.node.blck) {
        let blck = DOM.create('div.mm-wrapper__blocker.mm-slideout');
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
    var closeMenu = (evnt: Event) => {
        evnt.preventDefault();
        evnt.stopPropagation();

        if (!this.node.wrpr.matches('.mm-wrapper--modal')) {
            this.close();
        }
    };
    Mmenu.node.blck.addEventListener('mousedown', closeMenu); // 1
    Mmenu.node.blck.addEventListener('touchstart', closeMenu); // 2
    Mmenu.node.blck.addEventListener('touchmove', closeMenu); // 3

    //	Invoke "after" hook.
    this.trigger('initBlocker:after');
};
