import * as DOM from './dom';
const attr = (element, attr, value) => {
    element[attr] = value;
    element.setAttribute(attr, value.toString());
};
/**
 * Add aria (property and) attribute to a HTML element.
 *
 * @param {HTMLElement} 	element	The node to add the attribute to.
 * @param {string}			name	The (non-aria-prefixed) attribute name.
 * @param {string|boolean}	value	The attribute value.
 */
export const aria = (element, name, value) => {
    attr(element, `aria-${name}`, value);
};
/**
 * Add role attribute to a HTML element.
 *
 * @param {HTMLElement}		element	The node to add the attribute to.
 * @param {string|boolean}	value	The attribute value.
 */
export const role = (element, value) => {
    attr(element, 'role', value);
};
/**
 * Wrap a text in a screen-reader-only node.
 *
 * @param 	{string} text	The text to wrap.
 * @return	{string}		The wrapped text.
 */
export const text = (text) => {
    const span = DOM.create('span.mm-sronly');
    span.innerHTML = text;
    return span;
};
