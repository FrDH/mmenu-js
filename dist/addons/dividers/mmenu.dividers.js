import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import * as DOM from '../../core/_dom';
import { extendShorthandOptions } from './_options';
import { extend } from '../../core/_helpers';
//	Add the options.
Mmenu.options.dividers = options;
export default function () {
    var options = extendShorthandOptions(this.opts.dividers);
    this.opts.dividers = extend(options, Mmenu.options.dividers);
    //	Add classname to the menu to specify the type of the dividers
    if (options.type) {
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu_dividers-' + options.type);
        });
    }
    //	Add dividers
    if (options.add) {
        this.bind('initListview:after', (panel) => {
            if (!panel.matches(options.addTo)) {
                return;
            }
            DOM.find(panel, '.mm-listitem_divider').forEach(divider => {
                divider.remove();
            });
            DOM.find(panel, '.mm-listview').forEach(listview => {
                var lastletter = '', listitems = DOM.children(listview);
                Mmenu.filterListItems(listitems).forEach(listitem => {
                    let letter = DOM.children(listitem, '.mm-listitem__text')[0]
                        .textContent.trim()
                        .toLowerCase()[0];
                    if (letter.length && letter != lastletter) {
                        lastletter = letter;
                        let divider = DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.textContent = letter;
                        listview.insertBefore(divider, listitem);
                    }
                });
            });
        });
    }
}
