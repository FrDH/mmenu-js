/**
 * Make the first letter in a word uppercase.
 * @param {string} word The word.
 */
function ucFirst(word) {
    if (!word) {
        return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
}
/**
 * Bind an event listener to an element.
 * @param {HTMLElement} element     The element to bind the event listener to.
 * @param {string}      evnt        The event to listen to.
 * @param {funcion}     handler     The function to invoke.
 */
export var on = function (element, evnt, handler) {
    //  Extract the event name and space from the event (the event can include a namespace (click.foo)).
    var evntParts = evnt.split('.');
    evnt = 'mmEvent' + ucFirst(evntParts[0]) + ucFirst(evntParts[1]);
    element[evnt] = element[evnt] || [];
    element[evnt].push(handler);
    element.addEventListener(evntParts[0], handler);
};
/**
 * Remove an event listener from an element.
 * @param {HTMLElement} element The element to remove the event listeners from.
 * @param {string}      evnt    The event to remove.
 */
export var off = function (element, evnt) {
    //  Extract the event name and space from the event (the event can include a namespace (click.foo)).
    var evntParts = evnt.split('.');
    evnt = 'mmEvent' + ucFirst(evntParts[0]) + ucFirst(evntParts[1]);
    (element[evnt] || []).forEach(function (handler) {
        element.removeEventListener(evntParts[0], handler);
    });
};
/**
 * Trigger the bound event listeners on an element.
 * @param {HTMLElement} element     The element of which to trigger the event listeners from.
 * @param {string}      evnt        The event to trigger.
 * @param {object}      [options]   Options to pass to the handler.
 */
export var trigger = function (element, evnt, options) {
    var evntParts = evnt.split('.');
    evnt = 'mmEvent' + ucFirst(evntParts[0]) + ucFirst(evntParts[1]);
    (element[evnt] || []).forEach(function (handler) {
        handler(options || {});
    });
};
