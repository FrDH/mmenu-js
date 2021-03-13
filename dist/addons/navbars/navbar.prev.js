import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    //	Add content.
    var prev = DOM.create('a.mm-btn.mm-btn--prev.mm-navbar__btn');
    navbar.append(prev);
    this.bind('initNavbar:after', (panel) => {
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
    });
    //	Update to opened panel.
    let org;
    let _url, _txt;
    this.bind('openPanel:before', (panel) => {
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }
        org = panel.querySelector('.mm-navbar__btn.mm-btn--prev');
        _url = (org === null || org === void 0 ? void 0 : org.getAttribute('href')) || '';
        _txt = (org === null || org === void 0 ? void 0 : org.innerHTML) || '';
        if (_url) {
            prev.setAttribute('href', _url);
        }
        else {
            prev.removeAttribute('href');
        }
        if (_url || _txt) {
            prev.classList.remove('mm-hidden');
            sr.aria(prev, 'hidden', false);
        }
        else {
            prev.classList.add('mm-hidden');
            sr.aria(prev, 'hidden', true);
        }
        prev.innerHTML = _txt;
    });
    //	Add screenreader support, 
    //  aria-hidden for the navbar in the panel.
    this.bind('initNavbar:after', (panel) => {
        sr.aria(panel.querySelector('.mm-navbar'), 'hidden', true);
    });
}
