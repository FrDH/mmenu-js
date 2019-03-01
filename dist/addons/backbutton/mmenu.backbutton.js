import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.backButton = options;
export default function () {
    if (!this.opts.offCanvas) {
        return;
    }
    var options = this.opts.backButton;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            close: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.backButton = Mmenu.extend(options, Mmenu.options.backButton);
    var _menu = '#' + this.node.menu.id;
    //	Close menu
    if (options.close) {
        var states = [];
        const setStates = () => {
            states = [_menu];
            Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened, .mm-panel_opened-parent')
                .forEach((panel) => {
                states.push('#' + panel.id);
            });
        };
        this.bind('open:finish', () => {
            history.pushState(null, document.title, _menu);
        });
        this.bind('open:finish', setStates);
        this.bind('openPanel:finish', setStates);
        this.bind('close:finish', () => {
            states = [];
            history.back();
            history.pushState(null, document.title, location.pathname + location.search);
        });
        window.addEventListener('popstate', (evnt) => {
            if (this.vars.opened) {
                if (states.length) {
                    states = states.slice(0, -1);
                    var hash = states[states.length - 1];
                    if (hash == _menu) {
                        this.close();
                    }
                    else {
                        this.openPanel(this.node.menu.querySelector(hash));
                        history.pushState(null, document.title, _menu);
                    }
                }
            }
        });
    }
    if (options.open) {
        window.addEventListener('popstate', (evnt) => {
            if (!this.vars.opened && location.hash == _menu) {
                this.open();
            }
        });
    }
}
;
