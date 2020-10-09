import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    var _this = this;
    //	Add content
    var close = DOM.create('a.mm-btn.mm-btn--close.mm-navbar__btn');
    navbar.append(close);
    //	Update to page node
    this.bind('setPage:after', function (page) {
        close.setAttribute('href', '#' + page.id);
    });
    //	Add screenreader / text support
    this.bind('setPage:after:sr-text', function () {
        close.innerHTML = sr.text(_this.i18n(_this.conf.screenReader.text.closeMenu));
        sr.aria(close, 'owns', close.getAttribute('href').slice(1));
    });
}
