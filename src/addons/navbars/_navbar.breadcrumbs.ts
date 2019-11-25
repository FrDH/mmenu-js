import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function(this: Mmenu, navbar: HTMLElement) {
    //	Add content
    var breadcrumbs = DOM.create('div.mm-navbar__breadcrumbs');
    navbar.append(breadcrumbs);

    this.bind('initNavbar:after', (panel: HTMLElement) => {
        if (panel.querySelector('.mm-navbar__breadcrumbs')) {
            return;
        }

        DOM.children(panel, '.mm-navbar')[0].classList.add('mm-hidden');

        var crumbs: string[] = [],
            breadcrumbs = DOM.create('span.mm-navbar__breadcrumbs'),
            current = panel,
            first = true;

        while (current) {
            current = current.closest('.mm-panel') as HTMLElement;

            if (!current.parentElement.matches('.mm-listitem_vertical')) {
                let title = DOM.find(current, '.mm-navbar__title span')[0];
                if (title) {
                    let text = title.textContent;
                    if (text.length) {
                        crumbs.unshift(
                            first
                                ? '<span>' + text + '</span>'
                                : '<a href="#' +
                                      current.id +
                                      '">' +
                                      text +
                                      '</a>'
                        );
                    }
                }
                first = false;
            }
            current = current['mmParent'];
        }

        if (this.conf.navbars.breadcrumbs.removeFirst) {
            crumbs.shift();
        }

        breadcrumbs.innerHTML = crumbs.join(
            '<span class="mm-separator">' +
                this.conf.navbars.breadcrumbs.separator +
                '</span>'
        );
        DOM.children(panel, '.mm-navbar')[0].append(breadcrumbs);
    });

    //	Update for to opened panel
    this.bind('openPanel:start', (panel: HTMLElement) => {
        var crumbs = panel.querySelector('.mm-navbar__breadcrumbs');
        breadcrumbs.innerHTML = crumbs ? crumbs.innerHTML : '';
    });

    //	Add screenreader / aria support
    this.bind('initNavbar:after:sr-aria', (panel: HTMLElement) => {
        DOM.find(panel, '.mm-breadcrumbs a').forEach(anchor => {
            Mmenu.sr_aria(anchor, 'owns', anchor.getAttribute('href').slice(1));
        });
    });
}
