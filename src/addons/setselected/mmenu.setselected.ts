import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import OPTIONS from './options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';


export default function (this: Mmenu) {
    this.opts.setSelected = this.opts.setSelected || {};

    //	Extend options.
    const options = extend(this.opts.setSelected, OPTIONS);

    //	Find current by URL
    if (options.current == 'detect') {
        const findCurrent = (url: string) => {
            url = url.split('?')[0].split('#')[0];
            const anchor = this.node.menu.querySelector(
                'a[href="' + url + '"], a[href="' + url + '/"]'
            );
            if (anchor) {
                this.setSelected(anchor.parentElement);
            } else {
                const arr = url.split('/').slice(0, -1);
                if (arr.length) {
                    findCurrent(arr.join('/'));
                }
            }
        };

        this.bind('initMenu:after', () => {
            findCurrent.call(this, window.location.href);
        });

        //	Remove current selected item
    } else if (!options.current) {
        this.bind('initListview:after', (listview: HTMLElement) => {
            DOM.children(listview, '.mm-listitem--selected').forEach(
                (listitem) => {
                    listitem.classList.remove('mm-listitem--selected');
                }
            );
        });
    }

    //	Add :hover effect on items
    if (options.hover) {
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu--selected-hover');
        });
    }

    //	Set parent item selected for submenus
    if (options.parent) {
        this.bind('openPanel:after', (panel: HTMLElement) => {

            //	Remove all
            DOM.find(this.node.pnls, '.mm-listitem--selected-parent').forEach(
                (listitem) => {
                    listitem.classList.remove('mm-listitem--selected-parent');
                }
            );

            //	Move up the DOM tree
            let current = panel;
            while (current) {
                let li = DOM.find(this.node.pnls, `#${current.dataset.mmParent}`)[0];
                current = li?.closest('.mm-panel') as HTMLElement;

                if (li && !li.matches('.mm-listitem--vertical')) {
                    li.classList.add('mm-listitem--selected-parent');
                }
            }
        });

        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu--selected-parent');
        });
    }
}
