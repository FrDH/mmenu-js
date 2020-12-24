import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './options';
import configs from './configs';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import {
    extend,
    uniqueId,
    originalId,
} from '../../_modules/helpers';

//  Add the options and configs.
Mmenu.options.offCanvas = options;
Mmenu.configs.offCanvas = configs;

export default function (this: Mmenu) {

    const options = this.opts.offCanvas;
    const configs = this.conf.offCanvas;

    this.opts.searchfield = extend(options, Mmenu.options.searchfield);

    if (!options.use) {
        return;
    }

    //	Add methods to the API.
    this._api.push('open', 'close', 'setPage');



    //	Setup the UI blocker.
    if (!Mmenu.node.blck) {
        /** The UI blocker node. */
        const blocker = DOM.create('a.mm-wrapper__blocker.mm-slideout');
        blocker.id = uniqueId();

        /** Backdrop inside the blocker. */
        const backdrop = DOM.create('div.mm-wrapper__backdrop');
        blocker.append(backdrop);

        //	Append the blocker node to the body.
        document.querySelector(configs.menu.insertSelector).append(blocker);

        //  Add screenreader support

        blocker.append(sr.text(this.i18n(this.conf.screenReader.text.closeMenu)));

        //	Store the blocker node.
        Mmenu.node.blck = blocker;
    }

    //	Sync the blocker to target the page.
    this.bind('setPage:after', () => {
        Mmenu.node.blck.setAttribute('href', `#${Mmenu.node.page.id}`);
    });

    //  Clone menu and prepend it to the <body>.
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

        this.node.wrpr = document.querySelector(configs.menu.insertSelector);

        //	Prepend to the <body>
        document.querySelector(configs.menu.insertSelector)[configs.menu.insertMethod](this.node.menu);
    });

    this.bind('initMenu:after', () => {

        //	Setup the page.
        this.setPage(Mmenu.node.page);

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

    //	Add screenreader support.
    this.bind('initMenu:after', () => {
        sr.aria(this.node.menu, 'hidden', true);
        sr.aria(Mmenu.node.blck, 'hidden', true);
    });


    //	Open / close the menu.
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
    if (this.node.menu.matches('.mm-menu--opened')) {
        return;
    }

    //	Invoke "before" hook.
    this.trigger('open:before');

    var clsn = ['mm-wrapper--opened'];

    this.node.wrpr.classList.add(...clsn);

    //	Open
    this.node.menu.classList.add('mm-menu--opened');
    this.node.wrpr.classList.add('mm-wrapper--opened');

    //	Add screenreader support
    sr.aria(this.node.menu, 'hidden', false);
    sr.aria(Mmenu.node.blck, 'hidden', false);
    // sr.aria(Mmenu.node.page, 'disabled', true);

    //	Invoke "after" hook.
    this.trigger('open:after');
};

Mmenu.prototype.close = function (this: Mmenu) {
    if (!this.node.menu.matches('.mm-menu--opened')) {
        return;
    }

    //	Invoke "before" hook.
    this.trigger('close:before');

    this.node.menu.classList.remove('mm-menu--opened');
    this.node.wrpr.classList.remove('mm-wrapper--opened');

    //	Add screenreader support
    sr.aria(this.node.menu, 'hidden', true);
    sr.aria(Mmenu.node.blck, 'hidden', true);

    //	Invoke "after" hook.
    this.trigger('close:after');
};

/**
 * Set the "page" node.
 *
 * @param {HTMLElement} page Element to set as the page.
 */
Mmenu.prototype.setPage = function (this: Mmenu, page: HTMLElement) {

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

    //	Invoke "before" hook.
    this.trigger('setPage:before', [page]);

    page.classList.add('mm-page', 'mm-slideout');

    page.id = page.id || uniqueId();

    Mmenu.node.page = page;

    //	Invoke "after" hook.
    this.trigger('setPage:after', [page]);
};