import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './options';
import configs from './configs';
import translate from './translations';
import { extendShorthandOptions } from './options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import { extend } from '../../_modules/helpers';
//  Add the translations.
translate();
//  Add the options and configs.
Mmenu.options.screenReader = options;
Mmenu.configs.screenReader = configs;
export default function () {
    //	Extend options.
    const options = extendShorthandOptions(this.opts.screenReader);
    this.opts.screenReader = extend(options, Mmenu.options.screenReader);
    //	Extend configs.
    const configs = this.conf.screenReader;
    //	Add Aria-* attributes
    if (options.aria) {
        //	Update aria-hidden for hidden / visible listitems
        this.bind('updateListview', () => {
            DOM.find(this.node.pnls, '.mm-listitem').forEach((listitem) => {
                sr.aria(listitem, 'hidden', listitem.matches('.mm-hidden'));
            });
        });
        //	Update aria-hidden for the panels when opening and closing a panel.
        this.bind('openPanel:before', (panel) => {
            /** Panels that should be considered "hidden". */
            var hidden = DOM.find(this.node.pnls, '.mm-panel')
                .filter((hide) => hide !== panel)
                .filter((hide) => !hide.parentElement.matches('.mm-panel'));
            /** Panels that should be considered "visible". */
            var visible = [panel];
            DOM.find(panel, '.mm-listitem--vertical .mm-listitem--opened').forEach((listitem) => {
                visible.push(...DOM.children(listitem, '.mm-panel'));
            });
            //	Set the panels to be considered "hidden" or "visible".
            hidden.forEach((panel) => {
                sr.aria(panel, 'hidden', true);
            });
            visible.forEach((panel) => {
                sr.aria(panel, 'hidden', false);
            });
        });
        this.bind('closePanel', (panel) => {
            sr.aria(panel, 'hidden', true);
        });
        //	Add aria-haspopup to buttons.
        this.bind('initPanel:after', (panel) => {
            DOM.find(panel, '.mm-btn').forEach((button) => {
                sr.aria(button, 'haspopup', true);
            });
        });
        //	Add aria-hidden for navbars in panels.
        this.bind('initNavbar:after', (panel) => {
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
                this.bind('initNavbar:after', (panel) => {
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
        //	Add screenreader hooks for add-ons
        //	In orde to keep this list short, only extend hooks that are actually used by other add-ons.
        //	Add text to the prev-buttons.
        this.bind('initNavbar:after', (panel) => {
            let navbar = DOM.children(panel, '.mm-navbar')[0];
            if (navbar) {
                let button = DOM.children(navbar, '.mm-btn--prev')[0];
                if (button) {
                    button.innerHTML = sr.text(this.i18n(configs.text.closeSubmenu));
                }
            }
        });
        //	Add text to the next-buttons.
        this.bind('initListview:after', (listview) => {
            let panel = listview.closest('.mm-panel');
            let parent = DOM.find(this.node.pnls, `#${panel.dataset.mmParent}`)[0];
            if (parent) {
                let next = DOM.children(parent, '.mm-btn--next')[0];
                if (next) {
                    let text = this.i18n(configs.text[next.parentElement.matches('.mm-listitem--vertical')
                        ? 'toggleSubmenu'
                        : 'openSubmenu']);
                    next.innerHTML += sr.text(text);
                }
            }
        });
    }
}
