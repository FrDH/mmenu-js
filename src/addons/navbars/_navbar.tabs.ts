import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    navbar.classList.add('mm-navbar_tabs');
    navbar.parentElement.classList.add('mm-navbars_has-tabs');

    function selectTab(this: Mmenu, panel: HTMLElement) {
        let anchors = DOM.children(navbar, 'a');

        anchors.forEach(anchor => {
            anchor.classList.remove('mm-navbar__tab_selected');
        });

        let anchor = anchors.filter(anchor =>
            anchor.matches(`[href="#${panel.id}"]`)
        )[0];

        if (anchor) {
            anchor.classList.add('mm-navbar__tab_selected');
        } else {
            let parent = DOM.find(this.node.menu, `#${panel.dataset.mmParent}`)[0];
            if (parent) {
                selectTab.call(this, parent.closest('.mm-panel'));
            }
        }
    }

    this.bind('openPanel:before', selectTab);
}
