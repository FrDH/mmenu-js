import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    /** The close button. */
    const close = DOM.create('a.mm-btn.mm-btn--close.mm-navbar__btn') as HTMLAnchorElement;
    close.title = this.i18n(this.conf.offCanvas.screenReader.closeMenu);
    
    //	Add the button to the navbar.
    navbar.append(close);

    //	Update to target the page node.
    this.bind('setPage:after', (page: HTMLElement) => {
        close.href = `#${page.id}`;
    });
}
