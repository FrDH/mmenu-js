import Mmenu from '../oncanvas/mmenu.oncanvas';
import OPTIONS from './_options';
import * as DOM from '../../_modules/dom';
import * as support from '../../_modules/support';
import { extend } from '../../_modules/helpers';
export default function () {
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
        var _a;
        this.node.menu.setAttribute('tabindex', '-1');
        this.node.pnls.setAttribute('tabindex', '-1');
        (_a = Mmenu.node.blck) === null || _a === void 0 ? void 0 : _a.setAttribute('tabindex', '-1');
    });
    //	Add tabindex="-1" to the page so it can be focussed.
    this.bind('setPage:after', () => {
        var _a;
        (_a = Mmenu.node.page) === null || _a === void 0 ? void 0 : _a.setAttribute('tabindex', '-1');
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
        var _a;
        const focus = document.querySelector(`[href="#${this.node.menu.id}"]`) || this.node.page || null;
        (_a = focus) === null || _a === void 0 ? void 0 : _a.focus();
    });
    //  Prevent tabbing outside the menu,
    //  set focus to the blocker when:
    //      1) it's an off-canvas menu,
    //      2) the menu is opened,
    //      3) the focus is not inside the menu,
    //      4) the focus is not inside the blocker.
    if (this.opts.offCanvas.use) { // 1
        document.addEventListener('focusin', event => {
            var _a, _b, _c;
            if (this.node.menu.matches('.mm-menu--opened')) { // 2
                if (!((_a = event.target) === null || _a === void 0 ? void 0 : _a.closest(`#${this.node.menu.id}`)) && // 3
                    !((_b = event.target) === null || _b === void 0 ? void 0 : _b.closest(`#${Mmenu.node.blck.id}`)) // 4
                ) {
                    (_c = Mmenu.node.blck) === null || _c === void 0 ? void 0 : _c.focus();
                }
            }
        });
    }
    //	Add Additional keyboard behavior.
    if (options.enhance) {
        this.node.menu.addEventListener('keydown', (evnt) => {
            switch (evnt.key) {
                //	close submenu with backspace
                case 'Backspace':
                    if (!evnt.target.closest('input')) {
                        const panel = DOM.find(this.node.pnls, '.mm-panel--opened')[0];
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
