//	Core
import Mmenu from './core/oncanvas/mmenu.oncanvas';
//	Core add-ons
import offcanvas from './core/offcanvas/mmenu.offcanvas';
import screenReader from './core/screenreader/mmenu.screenreader';
import scrollBugFix from './core/scrollbugfix/mmenu.scrollbugfix';
//	Add-ons
import autoHeight from './addons/autoheight/mmenu.autoheight';
import backButton from './addons/backbutton/mmenu.backbutton';
import columns from './addons/columns/mmenu.columns';
import counters from './addons/counters/mmenu.counters';
import dividers from './addons/dividers/mmenu.dividers';
import drag from './addons/drag/mmenu.drag';
import dropdown from './addons/dropdown/mmenu.dropdown';
import fixedElements from './addons/fixedelements/mmenu.fixedelements';
import iconbar from './addons/iconbar/mmenu.iconbar';
import iconPanels from './addons/iconpanels/mmenu.iconpanels';
import keyboardNavigation from './addons/keyboardnavigation/mmenu.keyboardnavigation';
import lazySubmenus from './addons/lazysubmenus/mmenu.lazysubmenus';
import navbars from './addons/navbars/mmenu.navbars';
import pageScroll from './addons/pagescroll/mmenu.pagescroll';
import searchfield from './addons/searchfield/mmenu.searchfield';
import sectionIndexer from './addons/sectionindexer/mmenu.sectionindexer';
import setSelected from './addons/setselected/mmenu.setselected';
import sidebar from './addons/sidebar/mmenu.sidebar';
import toggles from './addons/toggles/mmenu.toggles';
//	Wrappers
import angular from './wrappers/angular/mmenu.angular';
import bootstrap from './wrappers/bootstrap/mmenu.bootstrap4';
import olark from './wrappers/olark/mmenu.olark';
import turbolinks from './wrappers/turbolinks/mmenu.turbolinks';
import wordpress from './wrappers/wordpress/mmenu.wordpress';
Mmenu.addons = {
    //	Core add-ons
    offcanvas,
    screenReader,
    scrollBugFix,
    //	Add-ons
    autoHeight,
    backButton,
    columns,
    counters,
    dividers,
    drag,
    dropdown,
    fixedElements,
    iconbar,
    iconPanels,
    keyboardNavigation,
    lazySubmenus,
    navbars,
    pageScroll,
    searchfield,
    sectionIndexer,
    setSelected,
    sidebar,
    toggles
};
//	Wrappers
Mmenu.wrappers = {
    angular,
    bootstrap,
    olark,
    turbolinks,
    wordpress
};
//	Global namespace
window['Mmenu'] = Mmenu;
//	jQuery plugin
(function ($) {
    if ($) {
        $.fn['mmenu'] = function (options, configs) {
            var $result = $();
            this.each((e, element) => {
                //	Don't proceed if the element already is a mmenu.
                if (element['mmenu']) {
                    return;
                }
                let menu = new Mmenu(element, options, configs), $menu = $(menu.node.menu);
                //	Store the API.
                $menu.data('mmenu', menu.API);
                $result = $result.add($menu);
            });
            return $result;
        };
    }
})(window['jQuery'] || window['Zepto'] || null);
