import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './options';
import configs from './configs';
import { extendShorthandOptions } from './options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import * as media from '../../_modules/matchmedia';

//  Add the options and configs.
Mmenu.options.navbars = options;
Mmenu.configs.navbars = configs;

//  Add the classnames.
Mmenu.configs.classNames.navbars = {
    panelPrev: 'Prev',
    panelTitle: 'Title',
};

import breadcrumbs from './navbar.breadcrumbs';
import close from './navbar.close';
import prev from './navbar.prev';
import searchfield from './navbar.searchfield';
import title from './navbar.title';

Navbars.navbarContents = {
    breadcrumbs,
    close,
    prev,
    searchfield,
    title,
};

import tabs from './navbar.tabs';

Navbars.navbarTypes = {
    tabs,
};

export default function Navbars(this: Mmenu) {
    var navs = this.opts.navbars;

    if (typeof navs == 'undefined') {
        return;
    }

    if (!(navs instanceof Array)) {
        navs = [navs];
    }

    var navbars = {};

    if (!navs.length) {
        return;
    }

    navs.forEach((options) => {
        options = extendShorthandOptions(options);

        if (!options.use) {
            return;
        }

        //	Create the navbar element.
        const navbar = DOM.create('div.mm-navbar');

        //	Get the position for the navbar.
        let { position } = options;

        //	Restrict the position to either "bottom" or "top" (default).
        if (position !== 'bottom') {
            position = 'top';
        }

        //	Create the wrapper for the navbar position.
        if (!navbars[position]) {
            navbars[position] = DOM.create('div.mm-navbars.mm-navbars--' + position);
        }
        navbars[position].append(navbar);

        //	Add content to the navbar.
        for (let c = 0, l = options.content.length; c < l; c++) {
            const ctnt = options.content[c];

            //	The content is a string.
            if (typeof ctnt == 'string') {
                let func = Navbars.navbarContents[ctnt];

                //	The content refers to one of the navbar-presets ("prev", "title", etc).
                if (typeof func == 'function') {
                    //	Call the preset function.
                    func.call(this, navbar);

                    //	The content is just HTML.
                } else {
                    //	Add the HTML.

                    //  Wrap the HTML in a single node
                    let node = DOM.create('span');
                    node.innerHTML = ctnt;

                    //  If there was only a single node, use that.
                    const children = DOM.children(node);
                    if (children.length == 1) {
                        node = children[0];
                    }

                    navbar.append(node);
                }

                //	The content is not a string, it must be an element.
            } else {
                navbar.append(ctnt);
            }
        }

        //	The type option is set.
        if (typeof options.type == 'string') {
            //	The function refers to one of the navbar-presets ("tabs").
            let func = Navbars.navbarTypes[options.type];
            if (typeof func == 'function') {
                //	Call the preset function.
                func.call(this, navbar);
            }
        }

        //	En-/disable the navbar.
        let enable = () => {
            navbar.classList.remove('mm-hidden');
            sr.aria(navbar, 'hidden', false);
        };
        let disable = () => {
            navbar.classList.add('mm-hidden');
            sr.aria(navbar, 'hidden', true);
        };
        if (typeof options.use != 'boolean') {
            media.add(options.use, enable, disable);
        }
    });

    //	Add to menu.
    this.bind('initMenu:after', () => {
        for (let position in navbars) {
            this.node.pnls[position == 'bottom' ? 'after' : 'before'](
                navbars[position]
            );
        }
    });
}
