import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
//	Add the options and configs.
Mmenu.options.pageScroll = options;
Mmenu.configs.pageScroll = configs;
export default function () {
    var _this = this;
    var options = extendShorthandOptions(this.opts.pageScroll);
    this.opts.pageScroll = extend(options, Mmenu.options.pageScroll);
    var configs = this.conf.pageScroll;
    /** The currently "active" section */
    var section;
    function scrollTo() {
        if (section) {
            // section.scrollIntoView({ behavior: 'smooth' });
            window.scrollTo({
                top: section.getBoundingClientRect().top +
                    document.scrollingElement.scrollTop -
                    configs.scrollOffset,
                behavior: 'smooth'
            });
        }
        section = null;
    }
    function anchorInPage(href) {
        try {
            if (href.slice(0, 1) == '#') {
                return DOM.find(Mmenu.node.page, href)[0];
            }
        }
        catch (err) { }
        return null;
    }
    if (this.opts.offCanvas && options.scroll) {
        //	Scroll to section after clicking menu item.
        this.bind('close:after', function () {
            scrollTo();
        });
        this.node.menu.addEventListener('click', function (event) {
            var _a, _b;
            var href = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('a[href]')) === null || _b === void 0 ? void 0 : _b.getAttribute('href')) || '';
            section = anchorInPage(href);
            if (section) {
                event.preventDefault();
                //	If the sidebar add-on is "expanded"...
                if (_this.node.menu.matches('.mm-menu--sidebar-expanded') &&
                    _this.node.wrpr.matches('.mm-wrapper--sidebar-expanded')) {
                    //	... scroll the page to the section.
                    scrollTo();
                    //	... otherwise...
                }
                else {
                    //	... close the menu.
                    _this.close();
                }
            }
        });
    }
    //	Update selected menu item after scrolling.
    if (options.update) {
        var scts_1 = [];
        this.bind('initListview:after', function (listview) {
            var listitems = DOM.children(listview, '.mm-listitem');
            DOM.filterLIA(listitems).forEach(function (anchor) {
                var section = anchorInPage(anchor.getAttribute('href'));
                if (section) {
                    scts_1.unshift(section);
                }
            });
        });
        var _selected_1 = -1;
        window.addEventListener('scroll', function (evnt) {
            var scrollTop = window.scrollY;
            for (var s = 0; s < scts_1.length; s++) {
                if (scts_1[s].offsetTop < scrollTop + configs.updateOffset) {
                    if (_selected_1 !== s) {
                        _selected_1 = s;
                        var panel = DOM.children(_this.node.pnls, '.mm-panel--opened')[0];
                        var listitems = DOM.find(panel, '.mm-listitem');
                        var anchors = DOM.filterLIA(listitems);
                        anchors = anchors.filter(function (anchor) {
                            return anchor.matches('[href="#' + scts_1[s].id + '"]');
                        });
                        if (anchors.length) {
                            _this.setSelected(anchors[0].parentElement);
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
