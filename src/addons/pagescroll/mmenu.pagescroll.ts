import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options and configs.
Mmenu.options.pageScroll = options;
Mmenu.configs.pageScroll = configs;

export default function (this: Mmenu) {
    var options = extendShorthandOptions(this.opts.pageScroll);
    this.opts.pageScroll = extend(options, Mmenu.options.pageScroll);

    var configs = this.conf.pageScroll;

    /** The currently "active" section */
    var section: HTMLElement;

    function scrollTo() {
        if (section) {
            // section.scrollIntoView({ behavior: 'smooth' });
            window.scrollTo({
                top:
                    section.getBoundingClientRect().top +
                    document.scrollingElement.scrollTop -
                    configs.scrollOffset,
                behavior: 'smooth'
            });
        }
        section = null;
    }
    function anchorInPage(href: string) {
        try {
            if (href.slice(0, 1) == '#') {
                return DOM.find(Mmenu.node.page, href)[0];
            }
        } catch (err) { }
        return null;
    }

    if (this.opts.offCanvas && options.scroll) {

        //	Scroll to section after clicking menu item.
        this.bind('close:finish', () => {
            scrollTo();
        });

        this.node.menu.addEventListener('click', event => {
            const href = (event.target as HTMLElement)?.closest('a[href]')?.getAttribute('href') || '';

            section = anchorInPage(href);
            if (section) {

                event.preventDefault();

                //	If the sidebar add-on is "expanded"...
                if (
                    this.node.menu.matches('.mm-menu--sidebar-expanded') &&
                    this.node.wrpr.matches('.mm-wrapper--sidebar-expanded')
                ) {
                    //	... scroll the page to the section.
                    scrollTo();

                    //	... otherwise...
                } else {
                    //	... close the menu.
                    this.close();
                }
            }
        });

    }

    //	Update selected menu item after scrolling.
    if (options.update) {
        let scts: HTMLElement[] = [];

        this.bind('initListview:after', (listview: HTMLElement) => {
            const listitems = DOM.children(listview, '.mm-listitem');
            DOM.filterLIA(listitems).forEach(anchor => {
                const section = anchorInPage(anchor.getAttribute('href'));

                if (section) {
                    scts.unshift(section);
                }
            });
        });

        let _selected = -1;

        window.addEventListener('scroll', evnt => {
            const scrollTop = window.scrollY;

            for (var s = 0; s < scts.length; s++) {
                if (scts[s].offsetTop < scrollTop + configs.updateOffset) {
                    if (_selected !== s) {
                        _selected = s;

                        let panel = DOM.children(
                            this.node.pnls,
                            '.mm-panel--opened'
                        )[0];

                        let listitems = DOM.find(panel, '.mm-listitem');
                        let anchors = DOM.filterLIA(listitems);

                        anchors = anchors.filter(anchor =>
                            anchor.matches('[href="#' + scts[s].id + '"]')
                        );

                        if (anchors.length) {
                            this.setSelected(anchors[0].parentElement);
                        }
                    }
                    break;
                }
            }
        }, {
            passive: true
        });
    }
}
