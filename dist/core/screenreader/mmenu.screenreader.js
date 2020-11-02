import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
import translate from './translations/translate';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import { extend } from '../../_modules/helpers';
//  Add the translations.
translate();
//  Add the options and configs.
Mmenu.options.screenReader = options;
Mmenu.configs.screenReader = configs;
export default function () {
    var _this = this;
    //	Extend options.
    var options = extendShorthandOptions(this.opts.screenReader);
    this.opts.screenReader = extend(options, Mmenu.options.screenReader);
    //	Extend configs.
    var configs = this.conf.screenReader;
    //	Add Aria-* attributes
    if (options.aria) {
        //	Add screenreader / aria hooks for add-ons
        //	In orde to keep this list short, only extend hooks that are actually used by other add-ons.
        this.bind('initAddons:after', function () {
            _this.bind('initMenu:after', function () {
                this.trigger('initMenu:after:sr-aria', [].slice.call(arguments));
            });
            _this.bind('initNavbar:after', function () {
                this.trigger('initNavbar:after:sr-aria', [].slice.call(arguments));
            });
            _this.bind('openPanel:before', function () {
                this.trigger('openPanel:before:sr-aria', [].slice.call(arguments));
            });
            _this.bind('close:after', function () {
                this.trigger('close:after:sr-aria', [].slice.call(arguments));
            });
            _this.bind('open:after', function () {
                this.trigger('open:after:sr-aria', [].slice.call(arguments));
            });
            _this.bind('initOpened:after', function () {
                this.trigger('initOpened:after:sr-aria', [].slice.call(arguments));
            });
        });
        //	Update aria-hidden for hidden / visible listitems
        this.bind('updateListview', function () {
            DOM.find(_this.node.pnls, '.mm-listitem').forEach(function (listitem) {
                sr.aria(listitem, 'hidden', listitem.matches('.mm-hidden'));
            });
        });
        //	Update aria-hidden for the panels when opening and closing a panel.
        this.bind('openPanel:before', function (panel) {
            /** Panels that should be considered "hidden". */
            var hidden = DOM.find(_this.node.pnls, '.mm-panel')
                .filter(function (hide) { return hide !== panel; })
                .filter(function (hide) { return !hide.parentElement.matches('.mm-panel'); });
            /** Panels that should be considered "visible". */
            var visible = [panel];
            DOM.find(panel, '.mm-listitem--vertical .mm-listitem--opened').forEach(function (listitem) {
                visible.push.apply(visible, DOM.children(listitem, '.mm-panel'));
            });
            //	Set the panels to be considered "hidden" or "visible".
            hidden.forEach(function (panel) {
                sr.aria(panel, 'hidden', true);
            });
            visible.forEach(function (panel) {
                sr.aria(panel, 'hidden', false);
            });
        });
        this.bind('closePanel', function (panel) {
            sr.aria(panel, 'hidden', true);
        });
        //	Add aria-haspopup and aria-owns to prev- and next buttons.
        this.bind('initPanel:after', function (panel) {
            DOM.find(panel, '.mm-btn').forEach(function (button) {
                sr.aria(button, 'haspopup', true);
                var href = button.getAttribute('href');
                if (href) {
                    sr.aria(button, 'owns', href.slice(1));
                }
            });
        });
        //	Add aria-hidden for navbars in panels.
        this.bind('initNavbar:after', function (panel) {
            /** The navbar in the panel. */
            var navbar = DOM.children(panel, '.mm-navbar')[0];
            /** Whether or not the navbar should be considered "hidden". */
            var hidden = navbar.matches('.mm-hidden');
            //	Set the navbar to be considered "hidden" or "visible".
            sr.aria(navbar, 'hidden', hidden);
        });
        //	Text
        if (options.text) {
            //	Add aria-hidden to titles in navbars
            if (this.opts.navbar.titleLink == 'parent') {
                this.bind('initNavbar:after', function (panel) {
                    /** The navbar in the panel. */
                    var navbar = DOM.children(panel, '.mm-navbar')[0];
                    /** Whether or not the navbar should be considered "hidden". */
                    var hidden = navbar.querySelector('.mm-btn--prev')
                        ? true
                        : false;
                    //	Set the navbar-title to be considered "hidden" or "visible".
                    sr.aria(DOM.find(navbar, '.mm-navbar__title')[0], 'hidden', hidden);
                });
            }
        }
    }
    //	Add screenreader text
    if (options.text) {
        //	Add screenreader / text hooks for add-ons
        //	In orde to keep this list short, only extend hooks that are actually used by other add-ons.
        this.bind('initAddons:after', function () {
            _this.bind('setPage:after', function () {
                this.trigger('setPage:after:sr-text', [].slice.call(arguments));
            });
            _this.bind('initBlocker:after', function () {
                this.trigger('initBlocker:after:sr-text', [].slice.call(arguments));
            });
        });
        //	Add text to the prev-buttons.
        this.bind('initNavbar:after', function (panel) {
            var navbar = DOM.children(panel, '.mm-navbar')[0];
            if (navbar) {
                var button = DOM.children(navbar, '.mm-btn--prev')[0];
                if (button) {
                    button.innerHTML = sr.text(_this.i18n(configs.text.closeSubmenu));
                }
            }
        });
        //	Add text to the next-buttons.
        this.bind('initListview:after', function (listview) {
            var panel = listview.closest('.mm-panel');
            var parent = DOM.find(_this.node.pnls, "#" + panel.dataset.mmParent)[0];
            if (parent) {
                var next = DOM.children(parent, '.mm-btn--next')[0];
                if (next) {
                    var text = _this.i18n(configs.text[next.parentElement.matches('.mm-listitem--vertical')
                        ? 'toggleSubmenu'
                        : 'openSubmenu']);
                    next.innerHTML += sr.text(text);
                }
            }
        });
    }
}
