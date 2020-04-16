import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';

//	Add the options.
Mmenu.options.lazySubmenus = options;

export default function (this: Mmenu) {
    var options = extendShorthandOptions(this.opts.lazySubmenus);
    this.opts.lazySubmenus = extend(options, Mmenu.options.lazySubmenus);

    if (options.load) {
        //	Prevent all sub panels from being initialized.
        this.bind('initPanels:before', () => {
            var panels: HTMLElement[] = [];

            //	Find all potential subpanels.
            DOM.find(this.node.pnls, 'li').forEach((listitem) => {
                panels.push(
                    ...DOM.children(
                        listitem,
                        this.conf.panelNodetype.join(', ')
                    )
                );
            });

            //	Filter out all non-panels and add the lazyload classes
            panels
                .filter((panel) => !panel.matches('.mm-listview_inset'))
                .filter((panel) => !panel.matches('.mm-nolistview'))
                .filter((panel) => !panel.matches('.mm-nopanel'))
                .forEach((panel) => {
                    var classnames = [
                        'mm-panel_lazysubmenu',
                        'mm-nolistview',
                        'mm-nopanel',
                    ];

                    //  IE11:
                    classnames.forEach((classname) => {
                        panel.classList.add(classname);
                    });

                    //  Better browsers:
                    // panel.classList.add(...classnames);
                });
        });

        //	re-enable the default opened panel to be initialized.
        this.bind('initPanels:before', () => {
            var panels: HTMLElement[] = [];
            DOM.find(
                this.node.pnls,
                '.' + this.conf.classNames.selected
            ).forEach((listitem) => {
                panels.push(...DOM.parents(listitem, '.mm-panel_lazysubmenu'));
            });

            if (panels.length) {
                panels.forEach((panel) => {
                    console.log(panel);
                    let classnames = [
                        'mm-panel_lazysubmenu',
                        'mm-nolistview',
                        'mm-nopanel',
                    ];

                    //  IE11:
                    classnames.forEach((classname) => {
                        panel.classList.remove(classname);
                    });

                    //  Better browsers:
                    // panel.classList.remove(...classnames);
                });
            }
        });

        //	initPanel for current- and sub panels before openPanel
        this.bind('openPanel:before', (panel: HTMLElement) => {
            let panels = DOM.find(panel, '.mm-panel_lazysubmenu').filter(
                (panel) =>
                    !panel.matches(
                        '.mm-panel_lazysubmenu .mm-panel_lazysubmenu'
                    )
            );

            if (panel.matches('.mm-panel_lazysubmenu')) {
                panels.unshift(panel);
            }

            panels.forEach((panel) => {
                const classnames = [
                    'mm-panel_lazysubmenu',
                    'mm-nolistview',
                    'mm-nopanel',
                ];

                //  IE11:
                classnames.forEach((classname) => {
                    panel.classList.remove(classname);
                });

                //  Better browsers:
                // child.classList.remove(...classnames);

                this.initPanel(panel);
            });
        });
    }
}
