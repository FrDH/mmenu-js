import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    var _this = this;
    //	Add content
    var breadcrumbs = DOM.create('div.mm-navbar__breadcrumbs');
    navbar.append(breadcrumbs);
    this.bind('initNavbar:after', function (panel) {
        if (panel.querySelector('.mm-navbar__breadcrumbs')) {
            return;
        }
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
        var crumbs = [], breadcrumbs = DOM.create('span.mm-navbar__breadcrumbs'), current = panel, first = true;
        while (current) {
            current = current.closest('.mm-panel');
            if (!current.parentElement.matches('.mm-listitem--vertical')) {
                var title = DOM.find(current, '.mm-navbar__title span')[0];
                if (title) {
                    var text = title.textContent;
                    if (text.length) {
                        crumbs.unshift(first
                            ? '<span>' + text + '</span>'
                            : '<a href="#' +
                                current.id +
                                '">' +
                                text +
                                '</a>');
                    }
                }
                first = false;
            }
            current = DOM.find(_this.node.pnls, "#" + current.dataset.mmParent)[0];
        }
        if (_this.conf.navbars.breadcrumbs.removeFirst) {
            crumbs.shift();
        }
        breadcrumbs.innerHTML = crumbs.join('<span class="mm-separator">' +
            _this.conf.navbars.breadcrumbs.separator +
            '</span>');
        DOM.children(panel, '.mm-navbar')[0].append(breadcrumbs);
    });
    //	Update for to opened panel
    this.bind('openPanel:before', function (panel) {
        var crumbs = panel.querySelector('.mm-navbar__breadcrumbs');
        breadcrumbs.innerHTML = crumbs ? crumbs.innerHTML : '';
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', function (panel) {
        DOM.find(panel, '.mm-breadcrumbs a').forEach(function (anchor) {
            sr.aria(anchor, 'owns', anchor.getAttribute('href').slice(1));
        });
    });
}
