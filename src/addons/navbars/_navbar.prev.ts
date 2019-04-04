import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

import * as DOM from '../../core/_dom';

export default function(this: Mmenu, navbar: HTMLElement) {
    //	Add content.
    var prev = DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
    navbar.append(prev);

    this.bind('initNavbar:after', (panel: HTMLElement) => {
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
    });

    //	Update to opened panel.
    var org: HTMLElement;
    var _url, _txt;

    this.bind('openPanel:start', (panel: HTMLElement) => {
        if (panel.parentElement.matches('.mm-listitem_vertical')) {
            return;
        }

        org = panel.querySelector('.' + this.conf.classNames.navbars.panelPrev);
        if (!org) {
            org = panel.querySelector('.mm-navbar__btn.mm-btn_prev');
        }

        _url = org ? org.getAttribute('href') : '';
        _txt = org ? org.innerHTML : '';

        if (_url) {
            prev.setAttribute('href', _url);
        } else {
            prev.removeAttribute('href');
        }

        prev.classList[_url || _txt ? 'remove' : 'add']('mm-hidden');
        prev.innerHTML = _txt;
    });

    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', (panel: HTMLElement) => {
        Mmenu.sr_aria(panel.querySelector('.mm-navbar'), 'hidden', true);
    });
    this.bind('openPanel:start:sr-aria', (panel: HTMLElement) => {
        Mmenu.sr_aria(prev, 'hidden', prev.matches('.mm-hidden'));
        Mmenu.sr_aria(prev, 'owns', (prev.getAttribute('href') || '').slice(1));
    });
}
