import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    /** The prev button. */
    let prev = DOM.create('a.mm-btn.mm-hidden') as HTMLAnchorElement;

    //	Add button to navbar.
    navbar.append(prev);

    //  Hide navbar in the panel.
    this.bind('initNavbar:after', (panel: HTMLElement) => {
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
    });

    // Update the button href when opening a panel.
    this.bind('openPanel:before', (panel: HTMLElement) => {
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }

        prev.classList.add('mm-hidden');

        /** Original button in the panel. */
        const original = panel.querySelector('.mm-navbar__btn.mm-btn--prev') as HTMLAnchorElement;
        if (original) {

            /** Clone of the original button in the panel. */
            const clone = original.cloneNode(true) as HTMLAnchorElement;
            prev.after(clone);
            prev.remove();
            prev = clone;
        }
    });
}
