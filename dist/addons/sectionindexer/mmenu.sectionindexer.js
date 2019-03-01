import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.sectionIndexer = options;
export default function () {
    var options = this.opts.sectionIndexer;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    //	/Extend shorthand options
    this.opts.sectionIndexer = Mmenu.extend(options, Mmenu.options.sectionIndexer);
    if (!options.add) {
        return;
    }
    this.bind('initPanels:after', (panels) => {
        //	Set the panel(s)
        if (options.addTo != 'panels') {
            //	TODO addTo kan ook een HTML element zijn?
            panels = Mmenu.DOM.find(this.node.menu, options.addTo)
                .filter(panel => panel.matches('.mm-panel'));
        }
        panels.forEach((panel) => {
            Mmenu.DOM.find(panel, '.mm-listitem_divider')
                .forEach((listitem) => {
                listitem.closest('.mm-panel').classList.add('mm-panel_has-sectionindexer');
            });
        });
        //	Add the indexer, only if it does not allready excists
        if (!this.node.indx) {
            let buttons = '';
            'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter) => {
                buttons += '<a href="#">' + letter + '</a>';
            });
            let indexer = Mmenu.DOM.create('div.mm-sectionindexer');
            indexer.innerHTML = buttons;
            this.node.menu.prepend(indexer);
            this.node.indx = indexer;
            //	Prevent default behavior when clicking an anchor
            this.node.indx.addEventListener('click', (evnt) => {
                var anchor = evnt.target;
                if (anchor.matches('a')) {
                    evnt.preventDefault();
                }
            });
            //	Scroll onMouseOver / onTouchStart
            let mouseOverEvent = (evnt) => {
                if (!evnt.target.matches('a')) {
                    return;
                }
                var letter = evnt.target.textContent, panel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
                var newTop = -1, oldTop = panel.scrollTop;
                panel.scrollTop = 0;
                Mmenu.DOM.find(panel, '.mm-listitem_divider')
                    .filter(divider => !divider.matches('.mm-hidden'))
                    .forEach((divider) => {
                    if (newTop < 0 &&
                        letter == divider.textContent.trim().slice(0, 1).toLowerCase()) {
                        newTop = divider.offsetTop;
                    }
                });
                panel.scrollTop = newTop > -1 ? newTop : oldTop;
            };
            this.node.indx.addEventListener('mouseover', mouseOverEvent);
            if (Mmenu.support.touch) {
                this.node.indx.addEventListener('touchstart', mouseOverEvent);
            }
        }
        //	Show or hide the indexer
        function update(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            this.node.menu.classList[panel.matches('.mm-panel_has-sectionindexer') ? 'add' : 'remove']('mm-menu_has-sectionindexer');
        }
        ;
        this.bind('openPanel:start', update);
        this.bind('initPanels:after', update); // TODO panel argument is an array
    });
}
;
