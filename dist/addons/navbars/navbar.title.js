import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
export default function (navbar) {
    /** The title node in the navbar. */
    const title = DOM.create('a.mm-navbar__title');
    /** Text in the title. */
    const titleText = DOM.create('span');
    //	Add title to the navbar.
    title.append(titleText);
    navbar.append(title);
    //	Update the title to the opened panel.
    this.bind('openPanel:before', (panel) => {
        var _a;
        //	Do nothing in a vertically expanding panel.
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }
        //	Find the original title in the opened panel.
        const original = DOM.find(panel, '.mm-navbar__title')[0];
        //	Get the URL for the title.
        let href = (original === null || original === void 0 ? void 0 : original.getAttribute('href')) || '';
        if (href) {
            title.href = href;
        }
        else {
            title.removeAttribute('href');
        }
        //	Get the text for the title.
        titleText.innerHTML = ((_a = DOM.children(original, 'span')[0]) === null || _a === void 0 ? void 0 : _a.innerHTML) || '';
    });
    //	Add screenreader  support
    let prev;
    this.bind('openPanel:before', (panel) => {
        if (this.opts.screenReader.text) {
            if (!prev) {
                var navbars = DOM.children(this.node.menu, '.mm-navbars');
                navbars.forEach((navbar) => {
                    let btn = DOM.find(navbar, '.mm-btn--prev')[0];
                    if (btn) {
                        prev = btn;
                    }
                });
            }
            if (prev) {
                var hidden = true;
                if (this.opts.navbar.titleLink == 'parent') {
                    hidden = !prev.matches('.mm-hidden');
                }
                sr.aria(title, 'hidden', hidden);
            }
        }
    });
}
