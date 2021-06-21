import Mmenu from '../oncanvas/mmenu.oncanvas';
import OPTIONS from './_options';
import * as DOM from '../../_modules/dom';
import * as support from '../../_modules/support';
import { extend } from '../../_modules/helpers';

export default function (this: Mmenu) {

    //	Add keyboard navigation only for keyboard devices
    if (support.touch) {
        return;
    }

    this.opts.keyboardNavigation = this.opts.keyboardNavigation || {};

    //	Extend options.
    const options = extend(this.opts.keyboardNavigation, OPTIONS);

    if (!options.enable) {
        return;
    }

    //  Add tabindex="-1" to the menu, the panels and blocker so they can be focussed.
    this.bind('initMenu:after', () => {
        this.node.menu.setAttribute('tabindex', '-1');
        this.node.pnls.setAttribute('tabindex', '-1');

        Mmenu.node.blck?.setAttribute('tabindex', '-1');
    });

    //	Add tabindex="-1" to the page so it can be focussed.
    this.bind('setPage:after', () => {
        Mmenu.node.page?.setAttribute('tabindex', '-1');
    });

    //  Focus menu when opening panel.
    this.bind('openPanel:after', (panel, options) => {
        if (options.setfocus) {
            this.node.pnls.focus();
        }
    });

    //  Focus menu when opening it.
    this.bind('open:after', () => {
        this.node.menu.focus();
    });

    //  Focus menu-button or page when closing the menu.
    this.bind('close:after', () => {
        const focus = document.querySelector(`[href="#${this.node.menu.id}"]`) || this.node.page || null;
        (focus as HTMLElement)?.focus();
    });

    //  Prevent tabbing outside the menu,
    //  set focus to the blocker when:
    //      1) it's an off-canvas menu,
    //      2) the menu is opened,
    //      3) the focus is not inside the menu,
    //      4) the focus is not inside the blocker.
    if (this.opts.offCanvas.use) { // 1
        document.addEventListener('focusin', event => {

            if (this.node.menu.matches('.mm-menu--opened')) { // 2
                if (!(event.target as HTMLElement)?.closest(`#${this.node.menu.id}`) && // 3
                    !(event.target as HTMLElement)?.closest(`#${Mmenu.node.blck.id}`) // 4
                ) {
                    Mmenu.node.blck?.focus();
                }
            }
        });
    }

    //	Add Additional keyboard behavior.
    if (options.enhance) {

        this.node.menu.addEventListener('keydown', (evnt: KeyboardEvent) => {

            switch (evnt.key) {
                //	close submenu with backspace
                case 'Backspace':
                    if (!(evnt.target as HTMLElement).closest('input')) {
                        const panel: HTMLElement = DOM.find(
                            this.node.pnls,
                            '.mm-panel--opened'
                        )[0];
    
                        if (panel) {
                            this.closePanel(panel);
                        }
                    }
                    break;

                //	close menu with esc
                case 'Escape':
                    if (this.opts.offCanvas.use) {
                        this.close();
                    }
                    break;
            }
        });
    }

}