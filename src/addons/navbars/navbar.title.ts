import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';

export default function (this: Mmenu, navbar: HTMLElement) {
    /** The title node in the navbar. */
    let title = DOM.create('a.mm-navbar__title') as HTMLAnchorElement;

    //	Add title to the navbar.
    navbar.append(title);

    //	Update the title to the opened panel.
    this.bind('openPanel:before', (panel: HTMLElement) => {

        //	Do nothing in a vertically expanding panel.
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }

        /** Original title in the panel. */
        const original = panel.querySelector('.mm-navbar__title') as HTMLAnchorElement;
        if (original) {

            /** Clone of the original title in the panel. */
            const clone = original.cloneNode(true) as HTMLAnchorElement;
            title.after(clone);
            title.remove();
            title = clone;
        }
    });
}
