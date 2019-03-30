const listeners: mmLooseObject = {};

var windowData = {};
var uniqueId = 1;

/**
 * Find the dataset for an element. Basically a simple fallback for the lack of a dataset on the Window.
 * @param {HTMLElement} element The element.
 */
function dataset(element: HTMLElement | Window) {
    if (element === window) {
        return windowData;
    }
    return (element as HTMLElement).dataset;
}

/**
 * Get the IDs for an event on an element.
 * @param {HTMLElement} element The element.
 * @param {string}      evnt    The event.
 */
function getIDs(element: HTMLElement | Window, evnt: string) {
    var ids = dataset(element)[evnt] || '';
    if (ids.length) {
        return ids.split(',');
    }
    return [];
}

/**
 * Set the IDs for an event on an element.
 * @param {HTMLElement} element The element.
 * @param {string}      evnt    The event.
 * @param {array}       ids     The IDs.
 */
function setIDs(element: HTMLElement | Window, evnt: string, ids: string[]) {
    dataset(element)[evnt] = ids.join(',');
}

/**
 * Bind an event listener to an element.
 * @param {HTMLElement} element     The element to bind the event listener to.
 * @param {string}      evnt        The event to listen to.
 * @param {funcion}     handler     The function to invoke.
 */
export function on(
    element: HTMLElement | Window,
    evnt: string,
    handler: EventListenerOrEventListenerObject
) {
    //  Extract the event name from the event (the event can include a namespace (click.foo)).
    var evntName = evnt.split('.')[0];

    //  Add a new ID to the list of IDs for the event for the element.
    var id = uniqueId;
    var ids = getIDs(element, evnt);
    ids.push('' + id);
    setIDs(element, evnt, ids);

    //  Store the handler so it can be removed with the "off" function.
    listeners[id] = handler;

    //  Add the event listener.
    element.addEventListener(evntName, handler);

    // Keep the ID unique.
    uniqueId++;
}

/**
 * Remove an event listener from an element.
 * @param {HTMLElement} element The element to remove the event listeners from.
 * @param {string}      evnt    The event to remove.
 */
export function off(element: HTMLElement | Window, evnt: string) {
    //  Extract the event name from the event (the event can include a namespace (click.foo)).
    var evntName = evnt.split('.')[0];

    //  Get the list of IDs for the event for the element.
    var ids = getIDs(element, evnt);
    ids.forEach(id => {
        //  Remove the event listener.
        element.removeEventListener(evntName, listeners[id]);

        //  Delete the stored handler.
        delete listeners[id];
    });

    //  Delete the list of IDs for the event for the element.
    delete dataset(element)[evnt];
}

/**
 * Trigger the bound event listeners on an element.
 * @param {HTMLElement} element     The element of which to trigger the event listeners from.
 * @param {string}      evnt        The event to trigger.
 * @param {object}      [options]   Options to pass to the handler.
 */
export function trigger(
    element: HTMLElement | Window,
    evnt: string,
    options?: mmLooseObject
) {
    var ids = getIDs(element, evnt);
    ids.forEach(id => {
        //  Invoke the stored handler.
        listeners[id](options || {});
    });
}
