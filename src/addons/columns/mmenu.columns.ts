import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options.
Mmenu.options.columns = options;

export default function (this: Mmenu) {
    var options = extendShorthandOptions(this.opts.columns);
    this.opts.columns = extend(options, Mmenu.options.columns);

    //	Add the columns
    if (options.add) {
        options.visible.min = Math.max(1, Math.min(6, options.visible.min));
        options.visible.max = Math.max(
            options.visible.min,
            Math.min(6, options.visible.max)
        );

        /** Columns related clasnames for the menu. */
        var colm = [];

        /** Columns related clasnames for the panels. */
        var colp = [];

        /** Classnames to remove from panels in favor of showing columns. */
        var rmvc = [
            'mm-panel_opened',
            'mm-panel_opened-parent',
            'mm-panel_highest',
        ];

        for (var i = 0; i <= options.visible.max; i++) {
            colm.push('mm-menu_columns-' + i);
            colp.push('mm-panel_columns-' + i);
        }
        rmvc.push(...colp);

        //	Close all later opened panels
        this.bind('openPanel:before', (panel: HTMLElement) => {
            /** The parent panel. */
            let parent: HTMLElement;

            if (panel) {
                parent = panel['mmParent'];
            }

            if (!parent) {
                return;
            }

            if (parent.classList.contains('mm-listitem_vertical')) {
                return;
            }

            parent = parent.closest('.mm-panel') as HTMLElement;
            if (!parent) {
                return;
            }

            var classname = parent.className;
            if (!classname.length) {
                return;
            }
            classname = classname.split('mm-panel_columns-')[1];
            if (!classname) {
                return;
            }

            var colnr = parseInt(classname.split(' ')[0], 10) + 1;

            while (colnr > 0) {
                panel = DOM.children(
                    this.node.pnls,
                    '.mm-panel_columns-' + colnr
                )[0];
                if (panel) {
                    colnr++;
                    panel.classList.add('mm-hidden');

                    //  IE11:
                    rmvc.forEach((classname) => {
                        panel.classList.remove(classname);
                    });

                    //  Better browsers:
                    // panel.classList.remove(...rmvc);
                } else {
                    colnr = -1;
                    break;
                }
            }
        });

        this.bind('openPanel:start', (panel: HTMLElement) => {
            if (panel) {
                /** The parent panel. */
                let parent = panel['mmParent'];

                if (
                    parent &&
                    parent.classList.contains('mm-listitem_vertical')
                ) {
                    return;
                }
            }

            var columns = DOM.children(
                this.node.pnls,
                '.mm-panel_opened-parent'
            ).length;
            if (!panel.matches('.mm-panel_opened-parent')) {
                columns++;
            }
            columns = Math.min(
                options.visible.max,
                Math.max(options.visible.min, columns)
            );

            //  IE11:
            colm.forEach((classname) => {
                this.node.menu.classList.remove(classname);
            });

            //  Better browsers:
            // this.node.menu.classList.remove(...colm);

            this.node.menu.classList.add('mm-menu_columns-' + columns);

            var panels: HTMLElement[] = [];
            DOM.children(this.node.pnls, '.mm-panel').forEach((panel) => {
                //  IE11:
                colp.forEach((classname) => {
                    panel.classList.remove(classname);
                });

                //  Better browsers:
                // panel.classList.remove(...colp);

                if (panel.matches('.mm-panel_opened-parent')) {
                    panels.push(panel);
                }
            });

            panels.push(panel);
            panels.slice(-options.visible.max).forEach((panel, p) => {
                panel.classList.add('mm-panel_columns-' + p);
            });
        });
    }
}
