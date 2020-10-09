import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    navbar.classList.add('mm-navbar_tabs');
    navbar.closest('.mm-navbars').classList.add('mm-navbars_has-tabs');

    // TODO: mutation observer?
    DOM.children(navbar, 'a').forEach(anchor => {
        anchor.classList.add('mm-navbar__tab');
    });

    /**
     * Mark a tab as selected.
     * @param {HTMLElement} panel Opened panel.
     */
    function selectTab(this: Mmenu, panel: HTMLElement) {
        /** The tab that links to the opened panel. */
        const anchor = DOM.children(navbar, `.mm-navbar__tab[href="#${panel.id}"]`)[0];

        if (anchor) {
            anchor.classList.add('mm-navbar__tab--selected');
        } else {

            /** The parent listitem. */
            const parent = DOM.find(this.node.menu, `#${panel.dataset.mmParent}`)[0];
            if (parent) {
                selectTab.call(this, parent.closest('.mm-panel'));
            }
        }
    }

    this.bind('openPanel:before', (panel) => {
        //  Remove selected class.
        DOM.children(navbar, 'a').forEach(anchor => {
            anchor.classList.remove('mm-navbar__tab--selected');
        });

        selectTab.call(this, panel);
    });

    //	Add animation class to panel.
    navbar.addEventListener('click', event => {
        /** The clicked tab. */
        const anchor = (event.target as HTMLElement).closest('.mm-navbar__tab');

        if (anchor) {
            const panel = DOM.find(this.node.pnls, anchor.getAttribute('href'))[0];
            if (panel) {
                panel.classList.add('mm-panel--noanimation');
            }
        }
    });
}
