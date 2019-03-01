import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
Mmenu.options.pageScroll = options;
Mmenu.configs.pageScroll = configs;
export default function () {
    var options = this.opts.pageScroll, configs = this.conf.pageScroll;
    //	Extend shorthand options.
    if (typeof options == 'boolean') {
        options = {
            scroll: options
        };
    }
    //	/Extend shorthand options.
    this.opts.pageScroll = Mmenu.extend(options, Mmenu.options.pageScroll);
    var section;
    function scrollTo(offset) {
        if (section && section.matches(':visible')) {
            //	TODO: animate?
            document.documentElement.scrollTop = section.offsetTop + offset;
            document.body.scrollTop = section.offsetTop + offset;
        }
        section = null;
    }
    function anchorInPage(href) {
        try {
            if (href != '#' &&
                href.slice(0, 1) == '#') {
                return Mmenu.node.page.querySelector(href);
            }
            return null;
        }
        catch (err) {
            return null;
        }
    }
    //	Scroll to section after clicking menu item.
    if (options.scroll) {
        this.bind('close:finish', () => {
            scrollTo(configs.scrollOffset);
        });
    }
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor.
    if (this.opts.offCanvas && options.scroll) {
        this.clck.push((anchor, args) => {
            section = null;
            //	Don't continue if the clicked anchor is not in the menu.
            if (!args.inMenu) {
                return;
            }
            //	Don't continue if the targeted section is not on the page.
            var href = anchor.getAttribute('href');
            section = anchorInPage(href);
            if (!section) {
                return;
            }
            //	If the sidebar add-on is "expanded"...
            if (this.node.menu.matches('.mm-menu_sidebar-expanded') &&
                document.documentElement.matches('.mm-wrapper_sidebar-expanded')) {
                //	... scroll the page to the section.
                scrollTo(this.conf.pageScroll.scrollOffset);
                //	... otherwise...
            }
            else {
                //	... close the menu.
                return {
                    close: true
                };
            }
        });
    }
    //	Update selected menu item after scrolling.
    if (options.update) {
        let scts = [];
        this.bind('initListview:after', (panel) => {
            //	TODO de sections zouden geordend moeten worden op de hoogte in de DOM, niet op volgorde in het menu.
            let listitems = Mmenu.DOM.find(panel, '.mm-listitem');
            Mmenu.filterListItemAnchors(listitems)
                .forEach((anchor) => {
                var href = anchor.getAttribute('href');
                var section = anchorInPage(href);
                if (section) {
                    scts.unshift(section);
                }
            });
        });
        let _selected = -1;
        window.addEventListener('scroll', (evnt) => {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            for (var s = 0; s < scts.length; s++) {
                if (scts[s].offsetTop < scrollTop + configs.updateOffset) {
                    if (_selected !== s) {
                        _selected = s;
                        let panel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0], listitems = Mmenu.DOM.find(panel, '.mm-listitem'), anchors = Mmenu.filterListItemAnchors(listitems);
                        anchors = anchors.filter(anchor => anchor.matches('[href="#' + scts[s].id + '"]'));
                        if (anchors.length) {
                            this.setSelected(anchors[0].parentElement);
                        }
                    }
                    break;
                }
            }
        });
    }
}
;
