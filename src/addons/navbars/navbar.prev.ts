import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    /** The prev button. */
    const prev = DOM.create('a.mm-btn.mm-btn--prev.mm-navbar__btn') as HTMLAnchorElement;
    
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
        
        /** Prev button href */
        const href = panel.querySelector('.mm-navbar__btn.mm-btn--prev')?.getAttribute('href') || '';

        if (href) {
            prev.href = href;
            prev.classList.remove('mm-hidden');
        } else {
            prev.removeAttribute('href');
            prev.classList.add('mm-hidden');
        }
    });
}
