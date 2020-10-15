/*!
 * mmenu.js
 * mmenujs.com
 *
 * Copyright (c) Fred Heusschen
 * frebsite.nl
 */

//	Core
import Mmenu from '../dist/core/oncanvas/mmenu.oncanvas';

//	Core add-ons
import offcanvas from '../dist/core/offcanvas/mmenu.offcanvas';
import screenReader from '../dist/core/screenreader/mmenu.screenreader';
import scrollBugFix from '../dist/core/scrollbugfix/mmenu.scrollbugfix';

//	Add-ons
import autoHeight from '../dist/addons/autoheight/mmenu.autoheight';
import backButton from '../dist/addons/backbutton/mmenu.backbutton';
import columns from '../dist/addons/columns/mmenu.columns';
import counters from '../dist/addons/counters/mmenu.counters';
import dividers from '../dist/addons/dividers/mmenu.dividers';
import drag from '../dist/addons/drag/mmenu.drag';
import dropdown from '../dist/addons/dropdown/mmenu.dropdown';
import fixedElements from '../dist/addons/fixedelements/mmenu.fixedelements';
import iconbar from '../dist/addons/iconbar/mmenu.iconbar';
import iconPanels from '../dist/addons/iconpanels/mmenu.iconpanels';
import keyboardNavigation from '../dist/addons/keyboardnavigation/mmenu.keyboardnavigation';
import lazySubmenus from '../dist/addons/lazysubmenus/mmenu.lazysubmenus';
import navbars from '../dist/addons/navbars/mmenu.navbars';
import pageScroll from '../dist/addons/pagescroll/mmenu.pagescroll';
import searchfield from '../dist/addons/searchfield/mmenu.searchfield';
import sectionIndexer from '../dist/addons/sectionindexer/mmenu.sectionindexer';
import setSelected from '../dist/addons/setselected/mmenu.setselected';
import sidebar from '../dist/addons/sidebar/mmenu.sidebar';
import toggles from '../dist/addons/toggles/mmenu.toggles';

//	Wrappers
import angular from '../dist/wrappers/angular/mmenu.angular';
import bootstrap from '../dist/wrappers/bootstrap/mmenu.bootstrap';
import olark from '../dist/wrappers/olark/mmenu.olark';
import turbolinks from '../dist/wrappers/turbolinks/mmenu.turbolinks';
import wordpress from '../dist/wrappers/wordpress/mmenu.wordpress';

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

//  Export module
export default Mmenu;

//	Global namespace
if (window) {
    window.Mmenu = Mmenu;
}

//	jQuery plugin
(function ($) {
    if ($) {
        $.fn.mmenu = function (options, configs) {
            var $result = $();

            this.each(function (e, element) {
                //	Don't proceed if the element already is a mmenu.
                if (element.mmApi) {
                    return;
                }

                var menu = new Mmenu(element, options, configs),
                    $menu = $(menu.node.menu);

                //	Store the API for backward compat.
                $menu.data('mmenu', menu.API);

                $result = $result.add($menu);
            });

            return $result;
        };
    }
})(window.jQuery || window.Zepto || null);
