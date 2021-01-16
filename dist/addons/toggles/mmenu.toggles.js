// import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
//	Add the classnames.
// Mmenu.configs.classNames.toggles = {
//     toggle: 'Toggle',
//     check: 'Check'
// };
export default function () {
    this.bind('initListitem:after', (listitem) => {
        //	Refactor toggle classes
        DOM.find(listitem, 'input').forEach(input => {
            DOM.reClass(input, this.conf.classNames.toggles.toggle, 'mm-toggle');
            DOM.reClass(input, this.conf.classNames.toggles.check, 'mm-check');
        });
    });
}
