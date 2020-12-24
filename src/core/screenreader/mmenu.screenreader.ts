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

export default function (this: Mmenu) {
    //	Extend options.
    const options = extendShorthandOptions(this.opts.screenReader);
    this.opts.screenReader = extend(options, Mmenu.options.screenReader);

    //	Extend configs.
    const configs = this.conf.screenReader;

    //	Add Aria-* attributes
    if (options.aria) {

        //	Add aria-haspopup to listitem buttons.
        this.bind('initListitem:after', (listitem: HTMLElement) => {
            DOM.find(listitem, '.mm-btn').forEach((button) => {
                sr.aria(button, 'haspopup', true);
            });
        });

        //  Set aria-hidden for panels.
        this.bind('initPanel:after', (panel: HTMLElement) => {
            sr.aria(panel, 'hidden', true);
        });

        //	Update aria-hidden for the panels when opening a panel.
        this.bind('openPanel:after', () => {
            DOM.find(this.node.pnls, '.mm-panel').forEach(panel => {
                //  Set a panel to be visible
                if (panel.matches('.mm-panel--opened') ||
                    panel.parentElement.matches('.mm-listitem--opened')
                ) {
                    sr.aria(panel, 'hidden', false);

                } else {
                    sr.aria(panel, 'hidden', true);
                }
            });
        });

        //	Update aria-hidden for the panels when closing a panel.
        this.bind('closePanel:after', (panel: HTMLElement) => {
            sr.aria(panel, 'hidden', true);
        });
    }

    //	Add screenreader text
    if (options.text) {

        //	Add text to the prev-buttons.
        this.bind('initNavbar:after', (panel: HTMLElement) => {
            const navbar = DOM.children(panel, '.mm-navbar')[0];
            console.log(navbar);

            if (navbar) {
                DOM.children(navbar, '.mm-btn--prev')[0]?.append(sr.text(
                    this.i18n(configs.text.closeSubmenu)
                ));
            }
        });

        //	Add text to the next-buttons.
        this.bind('initListview:after', (listview: HTMLElement) => {
            let panel: HTMLElement = listview.closest('.mm-panel');
            let parent: HTMLElement = DOM.find(this.node.pnls, `#${panel.dataset.mmParent}`)[0];
            if (parent) {
                let next = DOM.children(parent, '.mm-btn--next')[0];
                if (next) {
                    let text = this.i18n(
                        configs.text[
                        next.parentElement.matches('.mm-listitem--vertical')
                            ? 'toggleSubmenu'
                            : 'openSubmenu'
                        ]
                    );
                    next.prepend(sr.text(text));
                }
            }
        });
    }
}
