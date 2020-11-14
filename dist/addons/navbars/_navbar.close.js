import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    //	Add content
    var close = DOM.create('a.mm-btn.mm-btn--close.mm-navbar__btn');
    navbar.append(close);
    //	Update to page node
    this.bind('setPage:after', (page) => {
        close.setAttribute('href', '#' + page.id);
    });
    //	Add screenreader support
    close.innerHTML = sr.text(this.i18n(this.conf.screenReader.text.closeMenu));
    this.bind('setPage:after', () => {
        sr.aria(close, 'owns', close.getAttribute('href').slice(1));
    });
}
