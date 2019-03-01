import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.dividers = options;
export default function () {
    var options = this.opts.dividers;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options,
            fixed: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.addTo == 'panels') {
        options.addTo = '.mm-panel';
    }
    //	/Extend shorthand options
    this.opts.dividers = Mmenu.extend(options, Mmenu.options.dividers);
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
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach((divider) => {
                divider.remove();
            });
            Mmenu.DOM.find(panel, '.mm-listview')
                .forEach((listview) => {
                var lastletter = '', listitems = Mmenu.DOM.children(listview);
                Mmenu.filterListItems(listitems)
                    .forEach((listitem) => {
                    let letter = Mmenu.DOM.children(listitem, '.mm-listitem__text')[0]
                        .textContent.trim().toLowerCase()[0];
                    if (letter.length && letter != lastletter) {
                        lastletter = letter;
                        let divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.textContent = letter;
                        listview.insertBefore(divider, listitem);
                    }
                });
            });
        });
    }
    //	Fixed dividers
    if (options.fixed) {
        //	Add the fixed divider.
        this.bind('initPanels:after', (panels) => {
            if (!this.node.fixeddivider) {
                let listview = Mmenu.DOM.create('ul.mm-listview.mm-listview_fixeddivider'), listitem = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                listview.append(listitem);
                this.node.pnls.append(listview);
                this.node.fixeddivider = listitem;
            }
        });
        //	Set the text for the fixed divider.
        const setValue = () => {
            if (this.opts.offCanvas && !this.vars.opened) {
                return;
            }
            var panel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            if (!panel || panel.matches('.mm-hidden')) {
                return;
            }
            var scrl = panel.scrollTop, text = '';
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach((divider) => {
                if (!divider.matches('.mm-hidden')) {
                    if (divider.offsetTop + scrl < scrl + 1) {
                        text = divider.innerHTML;
                    }
                }
            });
            this.node.fixeddivider.innerHTML = text;
            this.node.pnls.classList[text.length ? 'add' : 'remove']('mm-panels_dividers');
        };
        //	Set correct value when 
        //		1) opening the menu,
        //		2) opening a panel,
        //		3) after updating listviews and
        //		4) after scrolling a panel
        this.bind('open:start', setValue); // 1
        this.bind('openPanel:start', setValue); // 2
        this.bind('updateListview', setValue); // 3
        this.bind('initPanel:after', (panel) => {
            panel.addEventListener('scroll', () => {
                if (panel.matches('.mm-panel_opened')) {
                    setValue.call(this, panel);
                }
            }, { passive: true });
        });
    }
}
;
