/*!
 * mmenu.js
 * mmenujs.com
 *
 * Copyright (c) Fred Heusschen
 * frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */

//	Core
import Mmenu from '../dist/core/oncanvas/mmenu.oncanvas';

//	Core add-ons
import offcanvas from '../dist/core/offcanvas/mmenu.offcanvas';
import screenReader from '../dist/core/screenreader/mmenu.screenreader';
import scrollBugFix from '../dist/core/scrollbugfix/mmenu.scrollbugfix';

//	Add-ons
import backButton from '../dist/addons/backbutton/mmenu.backbutton';
import counters from '../dist/addons/counters/mmenu.counters';
import drag from '../dist/addons/drag/mmenu.drag';
import iconbar from '../dist/addons/iconbar/mmenu.iconbar';
import iconPanels from '../dist/addons/iconpanels/mmenu.iconpanels';
import keyboardNavigation from '../dist/addons/keyboardnavigation/mmenu.keyboardnavigation';
import navbars from '../dist/addons/navbars/mmenu.navbars';
import pageScroll from '../dist/addons/pagescroll/mmenu.pagescroll';
import searchfield from '../dist/addons/searchfield/mmenu.searchfield';
import sectionIndexer from '../dist/addons/sectionindexer/mmenu.sectionindexer';
import setSelected from '../dist/addons/setselected/mmenu.setselected';
import sidebar from '../dist/addons/sidebar/mmenu.sidebar';
import toggles from '../dist/addons/toggles/mmenu.toggles';

//	Wrappers
import bootstrap from '../dist/wrappers/bootstrap/mmenu.bootstrap';

Mmenu.addons = {
    //	Core add-ons
    offcanvas,
    screenReader,
    scrollBugFix,

    //	Add-ons
    backButton,
    counters,
    drag,
    iconbar,
    iconPanels,
    keyboardNavigation,
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
    bootstrap,
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
