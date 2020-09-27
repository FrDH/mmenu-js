import * as DOM from '../../_modules/dom';
/**
 * Open a vertical panel.
 * @param {HTMLElement} panel				Panel to open.
 * @param {boolean}     [openParents=false] Whether or nog to also open all parent panels.
 */
export var vertical = function (panel, openParents) {
    //  Open only current
    if (!openParents) {
        panel.parentElement.classList.add('mm-listitem_opened');
        panel.classList.remove('mm-hidden');
        //	Open current and all vertical parent panels.
    }
    else {
        DOM.parents(panel, '.mm-listitem_vertical').forEach(function (listitem) {
            listitem.classList.add('mm-listitem_opened');
            DOM.children(listitem, '.mm-panel').forEach(function (panel) {
                panel.classList.remove('mm-hidden');
            });
        });
        //	Open first horizontal parent panel.
        var parents = DOM.parents(panel, '.mm-panel').filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); });
        if (parents.length) {
            horizontal(parents[0], false);
        }
    }
};
/**
 * Open a horizontal panel.
 * @param {HTMLElement} panel				Panel to open.
 * @param {boolean}		[animation=true]	Whether or not to open the panel with an animation.
 */
export var horizontal = function (panel, animation) {
    if (animation === void 0) { animation = true; }
    // 
};
