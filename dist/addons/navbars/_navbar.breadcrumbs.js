<<<<<<< HEAD
!function(a){a.mmenu.addons.navbars.breadcrumbs=function(r,n,e){var s=this,t=a.mmenu._c,i=a.mmenu._d;t.add("separator");var b=a('<span class="'+t.navbar+'__breadcrumbs" />').appendTo(r);this.bind("initNavbar:after",function(r){if(!r.children("."+t.navbar).children("."+t.navbar+"__breadcrumbs").length){r.removeClass(t.panel+"_has-navbar");for(var n=[],s=a('<span class="'+t.navbar+'__breadcrumbs"></span>'),b=r,c=!0;b&&b.length;){if(b.is("."+t.panel)||(b=b.closest("."+t.panel)),!b.parent("."+t.listitem+"_vertical").length){var d=b.children("."+t.navbar).children("."+t.navbar+"__title").text();d.length&&n.unshift(c?"<span>"+d+"</span>":'<a href="#'+b.attr("id")+'">'+d+"</a>"),c=!1}b=b.data(i.parent)}e.breadcrumbs.removeFirst&&n.shift(),s.append(n.join('<span class="'+t.separator+'">'+e.breadcrumbs.separator+"</span>")).appendTo(r.children("."+t.navbar))}}),this.bind("openPanel:start",function(a){var r=a.find("."+t.navbar+"__breadcrumbs");r.length&&b.html(r.html()||"")}),this.bind("initNavbar:after:sr-aria",function(r){r.children("."+t.navbar).children("."+t.breadcrumbs).children("a").each(function(){s.__sr_aria(a(this),"owns",a(this).attr("href").slice(1))})})}}(jQuery);
=======
import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../core/_dom';
export default function (navbar) {
    //	Add content
    var breadcrumbs = DOM.create('span.mm-navbar__breadcrumbs');
    navbar.append(breadcrumbs);
    this.bind('initNavbar:after', (panel) => {
        if (panel.querySelector('.mm-navbar__breadcrumbs')) {
            return;
        }
        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');
        var crumbs = [], breadcrumbs = DOM.create('span.mm-navbar__breadcrumbs'), current = panel, first = true;
        while (current) {
            if (!current.matches('.mm-panel')) {
                current = current.closest('.mm-panel');
            }
            if (!current.parentElement.matches('.mm-listitem_vertical')) {
                var text = DOM.find(current, '.mm-navbar__title')[0]
                    .textContent;
                if (text.length) {
                    crumbs.unshift(first
                        ? '<span>' + text + '</span>'
                        : '<a href="#' + current.id + '">' + text + '</a>');
                }
                first = false;
            }
            current = current['mmParent'];
        }
        if (this.conf.navbars.breadcrumbs.removeFirst) {
            crumbs.shift();
        }
        breadcrumbs.innerHTML = crumbs.join('<span class="mm-separator">' +
            this.conf.navbars.breadcrumbs.separator +
            '</span>');
        DOM.children(panel, '.mm-navbar')[0].append(breadcrumbs);
    });
    //	Update for to opened panel
    this.bind('openPanel:start', (panel) => {
        var crumbs = panel.querySelector('.mm-navbar__breadcrumbs');
        if (crumbs) {
            breadcrumbs.innerHTML = crumbs.innerHTML;
        }
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', (panel) => {
        DOM.find(panel, '.mm-breadcrumbs a').forEach(anchor => {
            Mmenu.sr_aria(anchor, 'owns', anchor.getAttribute('href').slice(1));
        });
    });
}
>>>>>>> develop
