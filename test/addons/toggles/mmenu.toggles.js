import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
Mmenu.configs.classNames.toggles = {
    toggle: 'Toggle',
    check: 'Check'
};
export default function () {
    this.bind('initPanels:after', (panels) => {
        //	Refactor toggle classes
        panels.forEach((panel) => {
            Mmenu.DOM.find(panel, 'input')
                .forEach((input) => {
                Mmenu.refactorClass(input, this.conf.classNames.toggles.toggle, 'mm-toggle');
                Mmenu.refactorClass(input, this.conf.classNames.toggles.check, 'mm-check');
            });
        });
        //	Loop over all panels.
        panels.forEach((panel) => {
            //	Loop over all toggles and checks.
            Mmenu.DOM.find(panel, 'input.mm-toggle, input.mm-check')
                .forEach((input) => {
                //	Find the listitem the input is in.
                var parent = input.closest('li');
                //	Get or create an ID for the input.
                var id = input.id || Mmenu.getUniqueId();
                //	Only needs to be done once.
                if (!Mmenu.DOM.children(parent, 'label[for="' + id + '"]').length) {
                    input.id = id;
                    parent.prepend(input);
                    let label = Mmenu.DOM.create('label.mm-' + (input.matches('.mm-toggle') ? 'toggle' : 'check'));
                    label.setAttribute('for', id);
                    let text = Mmenu.DOM.children(parent, '.mm-listitem__text')[0];
                    text.parentElement.insertBefore(label, text.nextSibling);
                }
            });
        });
    });
}
;
