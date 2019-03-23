import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.iconbar = options;
export default function () {
    var options = this.opts.iconbar;
    //	Extend shorthand options
    if (Mmenu.typeof(options) == 'array') {
        options = {
            use: true,
            top: options
        };
    }
    if (Mmenu.typeof(options) != 'object') {
        options = {};
    }
    if (typeof options.use == 'undefined') {
        options.use = true;
    }
    if (typeof options.use == 'boolean' && options.use) {
        options.use = true;
    }
    if (typeof options.use == 'number') {
        options.use = '(min-width: ' + options.use + 'px)';
    }
    //	/Extend shorthand options
    if (!options.use) {
        return;
    }
    var iconbar;
    ['top', 'bottom'].forEach((position, n) => {
        var ctnt = options[position];
        //	Extend shorthand options
        if (Mmenu.typeof(ctnt) != 'array') {
            ctnt = [ctnt];
        }
        //	Create node
        var part = Mmenu.DOM.create('div.mm-iconbar__' + position);
        //	Add content
        for (let c = 0, l = ctnt.length; c < l; c++) {
            if (typeof ctnt[c] == 'string') {
                part.innerHTML += ctnt[c];
            }
            else {
                part.append(ctnt[c]);
            }
        }
        if (part.children.length) {
            if (!iconbar) {
                iconbar = Mmenu.DOM.create('div.mm-iconbar');
            }
            iconbar.append(part);
        }
    });
    //	Add to menu
    if (iconbar) {
        this.bind('initMenu:after', () => {
            this.node.menu.classList.add('mm-menu_iconbar-' + options.position);
            this.node.menu.prepend(iconbar);
        });
        //	Tabs
        if (options.type == 'tabs') {
            iconbar.classList.add('mm-iconbar_tabs');
            iconbar.addEventListener('click', (evnt) => {
                var anchor = evnt.target;
                if (!anchor.matches('a')) {
                    return;
                }
                if (anchor.matches('.mm-iconbar__tab_selected')) {
                    evnt.stopImmediatePropagation();
                    return;
                }
                try {
                    var panel = this.node.menu.querySelector(anchor.getAttribute('href'))[0];
                    if (panel && panel.matches('.mm-panel')) {
                        evnt.preventDefault();
                        evnt.stopImmediatePropagation();
                        this.openPanel(panel, false);
                    }
                }
                catch (err) { }
            });
            const selectTab = (panel) => {
                Mmenu.DOM.find(iconbar, 'a')
                    .forEach((anchor) => {
                    anchor.classList.remove('mm-iconbar__tab_selected');
                });
                var anchor = Mmenu.DOM.find(iconbar, '[href="#' + panel.id + '"]')[0];
                if (anchor) {
                    anchor.classList.add('mm-iconbar__tab_selected');
                }
                else {
                    let parent = panel['mmParent'];
                    if (parent) {
                        selectTab(parent.closest('.mm-panel'));
                    }
                }
            };
            this.bind('openPanel:start', selectTab);
        }
        //	En-/disable the iconbar for media queries.
        if (typeof options.use != 'boolean') {
            this.matchMedia(options.use, () => {
                this.node.menu.classList.add('mm-menu_iconbar-' + options.position);
            }, () => {
                this.node.menu.classList.remove('mm-menu_iconbar-' + options.position);
            });
        }
    }
}
;
