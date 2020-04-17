import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';

export default function (this: Mmenu, navbar: HTMLElement) {
    //	Add content
    var close = DOM.create('a.mm-btn.mm-btn_close.mm-navbar__btn');
    navbar.append(close);

    //	Update to page node
    this.bind('setPage:after', (page: HTMLElement) => {
        close.setAttribute('href', '#' + page.id);
    });

    //	Add screenreader / text support
    this.bind('setPage:after:sr-text', () => {
        close.innerHTML = sr.text(
            this.i18n(this.conf.screenReader.text.closeMenu)
        );
        sr.aria(close, 'owns', close.getAttribute('href').slice(1));
    });
}
