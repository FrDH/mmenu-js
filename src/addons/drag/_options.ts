const options: mmOptionsDrag = {
    open: false,
    node: null
};
export default options;

/**
 * Extend shorthand options.
 *
 * @param  {object} options The options to extend.
 * @return {object}			The extended options.
 */
export function extendShorthandOptions(options: mmOptionsDrag): mmOptionsDrag {
    if (typeof options == 'boolean') {
        options = {
            open: options
        };
    }

    if (typeof options != 'object') {
        options = {};
    }

    return options;
}
