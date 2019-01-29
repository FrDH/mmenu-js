Mmenu.addons.navbars.breadcrumbs = function (navbar) {
    //	Add content
    var _this = this;
    var breadcrumbs = Mmenu.DOM.create('span.mm-navbar__breadcrumbs');
    navbar.append(breadcrumbs);
    this.bind('initNavbar:after', function (panel) {
        if (panel.querySelector('.mm-navbar__breadcrumbs')) {
            return;
        }
        panel.classList.remove('mm-panel_has-navbar');
        var crumbs = [], breadcrumbs = Mmenu.DOM.create('span.mm-navbar__breadcrumbs'), current = panel, first = true;
        while (current) {
            if (!current.matches('.mm-panel')) {
                current = current.closest('.mm-panel');
            }
            if (!current.parentElement.matches('.mm-listitem_vertical')) {
                var text = Mmenu.DOM.find(current, '.mm-navbar__title')[0].innerText;
                if (text.length) {
                    crumbs.unshift(first ? '<span>' + text + '</span>' : '<a href="#' + current.id + '">' + text + '</a>');
                }
                first = false;
            }
            current = current['mmParent'];
        }
        if (_this.conf.navbars.breadcrumbs.removeFirst) {
            crumbs.shift();
        }
        breadcrumbs.innerHTML = crumbs.join('<span class="mm-separator">' + _this.conf.navbars.breadcrumbs.separator + '</span>');
        Mmenu.DOM.children(panel, '.mm-navbar')[0].append(breadcrumbs);
    });
    //	Update for to opened panel
    this.bind('openPanel:start', function (panel) {
        var crumbs = panel.querySelector('.mm-navbar__breadcrumbs');
        if (crumbs) {
            breadcrumbs.innerHTML = crumbs.innerHTML;
        }
    });
    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', function (panel) {
        Mmenu.DOM.find(panel, '.mm-breadcrumbs a')
            .forEach(function (anchor) {
            Mmenu.sr_aria(anchor, 'owns', anchor.getAttribute('href').slice(1));
        });
    });
};
