<<<<<<< HEAD
!function(a){a.mmenu.addons.navbars.tabs=function(e,t,n){var s=a.mmenu._c,r=a.mmenu._d,l=a.mmenu._e,d=this,i=e.children("a");e.addClass(s.navbar+"_tabs").parent().addClass(s.navbars+"_has-tabs"),i.on(l.click+"-navbars",function(e){e.preventDefault();var t=a(this);if(t.hasClass(s.navbar+"__tab_selected"))e.stopImmediatePropagation();else try{d.openPanel(a(t.attr("href")),!1),e.stopImmediatePropagation()}catch(a){}}),this.bind("openPanel:start",function a(e){i.removeClass(s.navbar+"__tab_selected");var t=i.filter('[href="#'+e.attr("id")+'"]');if(t.length)t.addClass(s.navbar+"__tab_selected");else{var n=e.data(r.parent);n&&n.length&&a(n.closest("."+s.panel))}})}}(jQuery);
=======
import * as DOM from '../../core/_dom';
export default function (navbar) {
    navbar.classList.add('mm-navbar_tabs');
    navbar.parentElement.classList.add('mm-navbars_has-tabs');
    var anchors = DOM.children(navbar, 'a');
    navbar.addEventListener('click', (evnt) => {
        var anchor = evnt.target;
        if (!anchor.matches('a')) {
            return;
        }
        if (anchor.matches('.mm-navbar__tab_selected')) {
            evnt.stopImmediatePropagation();
            return;
        }
        try {
            this.openPanel(this.node.menu.querySelector(anchor.getAttribute('href')), false);
            evnt.stopImmediatePropagation();
        }
        catch (err) { }
    });
    function selectTab(panel) {
        anchors.forEach((anchor) => {
            anchor.classList.remove('mm-navbar__tab_selected');
        });
        var anchor = anchors.filter(anchor => anchor.matches('[href="#' + panel.id + '"]'))[0];
        if (anchor) {
            anchor.classList.add('mm-navbar__tab_selected');
        }
        else {
            var parent = panel['mmParent'];
            if (parent) {
                selectTab.call(this, parent.closest('.mm-panel'));
            }
        }
    }
    this.bind('openPanel:start', selectTab);
}
;
>>>>>>> develop
