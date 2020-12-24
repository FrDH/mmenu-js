import Mmenu from '../oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//  Add the options.
Mmenu.options.keyboardNavigation = options;

export default function (this: Mmenu) {

    const options = extendShorthandOptions(this.opts.keyboardNavigation);
    this.opts.keyboardNavigation = extend(options, Mmenu.options.keyboardNavigation);

    if (!this.opts.keyboardNavigation.enable) {
        return;
    }

    if (!this.opts.offCanvas.use) {
        return;
    }

    //  Add tabindex="-1" to the menu and blocker so they can be focussed.
    this.bind('initMenu:after', () => {
        this.node.menu.setAttribute('tabindex', '-1');
        Mmenu.node.blck.setAttribute('tabindex', '-1');
    });

    //	Add tabindex="-1" to the page so it can be focussed.
    this.bind('setPage:after', () => {
        Mmenu.node.page.setAttribute('tabindex', '-1');
    });

    //  Focus menu when opening it.
    this.bind('open:after', () => {
        this.node.menu.focus();
    });

    //  Focus menu-button or page when closing the menu.
    this.bind('close:after', () => {
        let focus = document.querySelector(`[href="#${this.node.menu.id}"]`) || this.node.page;
        (focus as HTMLElement).focus();
    });

    //  Focus menu when opening panel.
    this.bind('openPanel:after', () => {
        this.node.menu.focus();
    });

    //  Prevent tabbing outside the menu,
    //  set focus to the blocker when:
    //      1) the menu is opened,
    //      2) the focus is not inside the menu,
    //      3) the focus is not inside the blocker.
    document.addEventListener('focusin', evnt => {

        if (this.node.menu.matches('.mm-menu--opened')) { // 1
            if (!(evnt.target as HTMLElement)?.closest(`#${this.node.menu.id}`) && // 2
                !(evnt.target as HTMLElement)?.closest(`#${Mmenu.node.blck.id}`) // 3
            ) {
                Mmenu.node.blck.focus();
            }
        }
    });

    //	Add Additional keyboard behavior.
    if (this.opts.keyboardNavigation.enhance) {

        this.node.menu.addEventListener('keydown', (evnt: KeyboardEvent) => {

            switch (evnt.key) {
                //	close submenu with backspace
                case 'Backspace':
                    const panel: HTMLElement = DOM.find(
                        this.node.pnls,
                        '.mm-panel--opened'
                    )[0];

                    if (panel) {
                        this.closePanel(panel);
                    }
                    break;

                //	close menu with esc
                case 'Escape':
                    if (this.node.menu.matches('.mm-menu--offcanvas')) {
                        this.close();
                    }
                    break;
            }
        });
    }

}