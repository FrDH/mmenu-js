import * as DOM from '../../_modules/dom';
export default function (navbar) {
    var _this = this;
    navbar.classList.add('mm-navbar--tabs');
    navbar.closest('.mm-navbars').classList.add('mm-navbars--has-tabs');
    // TODO: mutation observer?
    DOM.children(navbar, 'a').forEach(function (anchor) {
        anchor.classList.add('mm-navbar__tab');
    });
    /**
     * Mark a tab as selected.
     * @param {HTMLElement} panel Opened panel.
     */
    function selectTab(panel) {
        /** The tab that links to the opened panel. */
        var anchor = DOM.children(navbar, ".mm-navbar__tab[href=\"#" + panel.id + "\"]")[0];
        if (anchor) {
            anchor.classList.add('mm-navbar__tab--selected');
        }
        else {
            /** The parent listitem. */
            var parent_1 = DOM.find(this.node.pnls, "#" + panel.dataset.mmParent)[0];
            if (parent_1) {
                selectTab.call(this, parent_1.closest('.mm-panel'));
            }
        }
    }
    this.bind('openPanel:before', function (panel) {
        //  Remove selected class.
        DOM.children(navbar, 'a').forEach(function (anchor) {
            anchor.classList.remove('mm-navbar__tab--selected');
        });
        selectTab.call(_this, panel);
    });
    this.bind('initPanels:after', function () {
        //	Add animation class to panel.
        navbar.addEventListener('click', function (event) {
            var _a, _b, _c;
            /** The href for the clicked tab. */
            var href = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('.mm-navbar__tab')) === null || _b === void 0 ? void 0 : _b.getAttribute('href');
            if (href) {
                (_c = DOM.find(_this.node.pnls, href + ".mm-panel")[0]) === null || _c === void 0 ? void 0 : _c.classList.add('mm-panel--noanimation');
            }
        }, {
            // useCapture to ensure the logical order.
            capture: true
        });
    });
}
