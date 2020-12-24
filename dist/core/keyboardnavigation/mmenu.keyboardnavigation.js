import Mmenu from '../oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
//  Add the options.
Mmenu.options.keyboardNavigation = options;
export default function () {
    const options = extendShorthandOptions(this.opts.keyboardNavigation);
    this.opts.keyboardNavigation = extend(options, Mmenu.options.keyboardNavigation);
    if (!this.opts.keyboardNavigation.enable) {
        return;
    }
    // todo alleen bij off-canvas?
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
        focus.focus();
    });
    //  Focus menu when opening panel.
    this.bind('openPanel:after', () => {
        this.node.menu.focus();
    });
    //  Prevent tabbing outside the menu.
    //      1) If the menu is opened
    //      2) and the focus is not inside the menu
    //      3) and the focus is not inside the blocker:
    //      4) Set focus to the blocker
    document.addEventListener('focusin', evnt => {
        var _a, _b;
        if (this.node.menu.matches('.mm-menu--opened')) { // 1
            if (!((_a = evnt.target) === null || _a === void 0 ? void 0 : _a.closest(`#${this.node.menu.id}`)) && // 2
                !((_b = evnt.target) === null || _b === void 0 ? void 0 : _b.closest(`#${Mmenu.node.blck.id}`)) // 3
            ) {
                Mmenu.node.blck.focus(); // 4
            }
        }
    });
    //  Enhanced behavior
    if (this.opts.keyboardNavigation.enhance) {
        //  Add :hover like styles for :focus
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu--keyboardfocus');
        });
        //	Add Additional keyboard behavior.
        this.node.menu.addEventListener('keydown', (evnt) => {
            switch (evnt.key) {
                //	close submenu with backspace
                case 'Backspace':
                    const panel = DOM.find(this.node.pnls, '.mm-panel--opened')[0];
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
