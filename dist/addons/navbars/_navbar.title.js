import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    var _this = this;
    //	Add content to the navbar.
    var title = DOM.create('a.mm-navbar__title');
    var titleText = DOM.create('span');
    title.append(titleText);
    navbar.append(title);
    //	Update the title to the opened panel.
    this.bind('openPanel:before', function (panel) {
        var _a;
        //	Do nothing in a vertically expanding panel.
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }
        //	Find the original title in the opened panel.
        var original = DOM.find(panel, "." + _this.conf.classNames.navbars.panelTitle)[0];
        if (!original) {
            original = DOM.find(panel, '.mm-navbar__title span')[0];
        }
        //	Get the URL for the title.
        var _url = ((_a = original === null || original === void 0 ? void 0 : original.closest('a')) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
        if (_url) {
            title.setAttribute('href', _url);
        }
        else {
            title.removeAttribute('href');
        }
        //	Get the text for the title.
        titleText.innerHTML = (original === null || original === void 0 ? void 0 : original.innerHTML) || '';
    });
    //	Add screenreader / aria support
    var prev;
    this.bind('openPanel:before:sr-aria', function (panel) {
        if (_this.opts.screenReader.text) {
            if (!prev) {
                var navbars = DOM.children(_this.node.menu, '.mm-navbars');
                navbars.forEach(function (navbar) {
                    var btn = DOM.find(navbar, '.mm-btn--prev')[0];
                    if (btn) {
                        prev = btn;
                    }
                });
            }
            if (prev) {
                var hidden = true;
                if (_this.opts.navbar.titleLink == 'parent') {
                    hidden = !prev.matches('.mm-hidden');
                }
                sr.aria(title, 'hidden', hidden);
            }
        }
    });
}
