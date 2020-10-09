import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options.
Mmenu.options.iconPanels = options;

export default function (this: Mmenu) {
    var options = extendShorthandOptions(this.opts.iconPanels);
    this.opts.iconPanels = extend(options, Mmenu.options.iconPanels);

    var keepFirst = false;

    if (options.visible == 'first') {
        keepFirst = true;
        options.visible = 1;
    }

    options.visible = Math.min(3, Math.max(1, options.visible));
    options.visible++;

    //	Add the iconpanels
    if (options.add) {
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu--iconpanel');
        });

        let classnames = [];
        if (!keepFirst) {
            for (let i = 0; i <= options.visible; i++) {
                classnames.push('mm-panel--iconpanel-' + i);
            }
        }

        this.bind('openPanel:before', (panel?: HTMLElement) => {
            var panels = DOM.children(this.node.pnls, '.mm-panel');
            panel = panel || panels[0];

            if (panel.parentElement.matches('.mm-listitem--vertical')) {
                return;
            }

            if (keepFirst) {
                panels.forEach((panel, p) => {
                    panel.classList[p == 0 ? 'add' : 'remove'](
                        'mm-panel--iconpanel-first'
                    );
                });
            } else {
                //	Remove the "iconpanel" classnames from all panels.
                panels.forEach((panel) => {
                    panel.classList.remove(...classnames);
                });

                //	Filter out panels that are not opened.
                panels = panels.filter((panel) =>
                    panel.matches('.mm-panel--parent')
                );

                //	Add the current panel to the list.
                let panelAdded = false;
                panels.forEach((elem) => {
                    if (panel === elem) {
                        panelAdded = true;
                    }
                });
                if (!panelAdded) {
                    panels.push(panel);
                }

                //	Remove the "hidden" classname from all opened panels.
                panels.forEach((panel) => {
                    panel.classList.remove('mm-hidden');
                });

                //	Slice the opened panels to the max visible amount.
                panels = panels.slice(-options.visible);

                //	Add the "iconpanel" classnames.
                panels.forEach((panel, p) => {
                    panel.classList.add('mm-panel--iconpanel-' + p);
                });
            }
        });

        this.bind('initPanel:after', (panel: HTMLElement) => {
            if (
                options.blockPanel &&
                !panel.parentElement.matches('.mm-listitem--vertical') &&
                !DOM.children(panel, '.mm-panel__blocker')[0]
            ) {
                let blocker = DOM.create('a.mm-panel__blocker');
                blocker.setAttribute(
                    'href',
                    '#' + panel.closest('.mm-panel').id
                );

                panel.prepend(blocker);
            }
        });
    }
}
