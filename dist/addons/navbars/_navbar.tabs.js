import * as DOM from '../../_modules/dom';
export default function (navbar) {
    var _this = this;
    navbar.classList.add('mm-navbar_tabs');
    navbar.closest('.mm-navbars').classList.add('mm-navbars_has-tabs');
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
            anchor.classList.add('mm-navbar__tab_selected');
        }
        else {
            /** The parent listitem. */
            var parent_1 = DOM.find(this.node.menu, "#" + panel.dataset.mmParent)[0];
            if (parent_1) {
                selectTab.call(this, parent_1.closest('.mm-panel'));
            }
        }
    }
    this.bind('openPanel:before', function (panel) {
        //  Remove selected class.
        DOM.children(navbar, 'a').forEach(function (anchor) {
            anchor.classList.remove('mm-navbar__tab_selected');
        });
        selectTab.call(_this, panel);
    });
    //	Add animation class to panel.
    navbar.addEventListener('click', function (event) {
        /** The clicked tab. */
        var anchor = event.target.closest('.mm-navbar__tab');
        if (anchor) {
            var panel = DOM.find(_this.node.pnls, anchor.getAttribute('href'))[0];
            if (panel) {
                panel.classList.add('mm-panel_noanimation');
            }
        }
    });
}
