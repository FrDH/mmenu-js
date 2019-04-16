<<<<<<< HEAD
!function(a){a.mmenu.addons.navbars.prev=function(n,r){var e,t,i,s=a.mmenu._c,h=a('<a class="'+s.btn+" "+s.btn+"_prev "+s.navbar+'__btn" href="#" />').appendTo(n);this.bind("initNavbar:after",function(a){a.removeClass(s.panel+"_has-navbar")}),this.bind("openPanel:start",function(a){a.parent("."+s.listitem+"_vertical").length||((e=a.find("."+this.conf.classNames.navbars.panelPrev)).length||(e=a.children("."+s.navbar).children("."+s.btn+"_prev")),t=e.attr("href"),i=e.html(),t?h.attr("href",t):h.removeAttr("href"),h[t||i?"removeClass":"addClass"](s.hidden),h.html(i))}),this.bind("initNavbar:after:sr-aria",function(a){var n=a.children("."+s.navbar);this.__sr_aria(n,"hidden",!0)}),this.bind("openPanel:start:sr-aria",function(a){this.__sr_aria(h,"hidden",h.hasClass(s.hidden)),this.__sr_aria(h,"owns",(h.attr("href")||"").slice(1))})},a.mmenu.configuration.classNames.navbars.panelPrev="Prev"}(jQuery);
=======
import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../core/_dom';
export default function (navbar) {
    //	Add content.
    var prev = DOM.create('a.mm-btn.mm-btn_prev.mm-navbar__btn');
    navbar.append(prev);
    this.bind('initNavbar:after', (panel) => {
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
    });
    //	Update to opened panel.
    var org;
    var _url, _txt;
    this.bind('openPanel:start', (panel) => {
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
        }
        else {
            prev.removeAttribute('href');
        }
        prev.classList[_url || _txt ? 'remove' : 'add']('mm-hidden');
        prev.innerHTML = _txt;
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', (panel) => {
        Mmenu.sr_aria(panel.querySelector('.mm-navbar'), 'hidden', true);
    });
    this.bind('openPanel:start:sr-aria', (panel) => {
        Mmenu.sr_aria(prev, 'hidden', prev.matches('.mm-hidden'));
        Mmenu.sr_aria(prev, 'owns', (prev.getAttribute('href') || '').slice(1));
    });
}
>>>>>>> develop
