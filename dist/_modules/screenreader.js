var attr = function (element, attr, value) {
    element[attr] = value;
    if (value) {
        element.setAttribute(attr, value.toString());
    }
    else {
        element.removeAttribute(attr);
    }
};
/**
 * Add aria (property and) attribute to a HTML element.
 *
 * @param {HTMLElement} 	element	The node to add the attribute to.
 * @param {string}			name	The (non-aria-prefixed) attribute name.
 * @param {string|boolean}	value	The attribute value.
 */
export var aria = function (element, name, value) {
    attr(element, "aria-" + name, value);
};
/**
 * Add role attribute to a HTML element.
 *
 * @param {HTMLElement}		element	The node to add the attribute to.
 * @param {string|boolean}	value	The attribute value.
 */
export var role = function (element, value) {
    attr(element, 'role', value);
};
/**
 * Wrap a text in a screen-reader-only node.
 *
 * @param 	{string} text	The text to wrap.
 * @return	{string}		The wrapped text.
 */
export var text = function (text) {
    return "<span class=\"mm-sronly\">" + text + "</span>";
};
