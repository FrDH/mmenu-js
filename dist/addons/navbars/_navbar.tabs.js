import * as DOM from '../../_modules/dom';
export default function (navbar) {
    navbar.classList.add('mm-navbar_tabs');
    navbar.parentElement.classList.add('mm-navbars_has-tabs');
    function selectTab(panel) {
        var anchors = DOM.children(navbar, 'a');
        anchors.forEach(function (anchor) {
            anchor.classList.remove('mm-navbar__tab_selected');
        });
        var anchor = anchors.filter(function (anchor) {
            return anchor.matches("[href=\"#" + panel.id + "\"]");
        })[0];
        if (anchor) {
            anchor.classList.add('mm-navbar__tab_selected');
        }
        else {
            var parent_1 = DOM.find(this.node.menu, "#" + panel.dataset.mmParent)[0];
            if (parent_1) {
                selectTab.call(this, parent_1.closest('.mm-panel'));
            }
        }
    }
    this.bind('openPanel:before', selectTab);
}
