/**
 * Deep extend an object with the given defaults.
 * Note that the extended object is not a clone, meaning the original object will also be updated.
 *
 * @param 	{object}	orignl	The object to extend to.
 * @param 	{object}	dfault	The object to extend from.
 * @return	{object}			The extended "orignl" object.
 */
export const extend = (orignl: mmLooseObject, dfault: mmLooseObject) => {
    if (type(orignl) != 'object') {
        orignl = {};
    }
    if (type(dfault) != 'object') {
        dfault = {};
    }

    for (let k in dfault) {
        if (!dfault.hasOwnProperty(k)) {
            continue;
        }

        if (typeof orignl[k] == 'undefined') {
            orignl[k] = dfault[k];
        } else if (type(orignl[k]) == 'object') {
            extend(orignl[k], dfault[k]);
        }
    }
    return orignl;
};

/**
 * Detect the touch / dragging direction on a touch device.
 *
 * @param   {HTMLElement} surface   The element to monitor for touch events.
 * @return  {object}                Object with "get" function.
 */
export const touchDirection = (surface) => {
    let direction = '';

    surface.addEventListener('touchmove', (evnt) => {
        direction = '';

        if (evnt.movementY > 0) {
            direction = 'down';
        } else if (evnt.movementY < 0) {
            direction = 'up';
        }
    });

    return {
        get: () => direction,
    };
};

/**
 * Get the type of any given variable. Improvement of "typeof".
 *
 * @param 	{any}		variable	The variable.
 * @return	{string}				The type of the variable in lowercase.
 */
export const type = (variable: any): string => {
    return {}.toString
        .call(variable)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
};

/**
 * Find the value from an option or function.
 * @param 	{HTMLElement} 	element 	Scope for the function.
 * @param 	{any} 			[option] 	Value or function.
 * @param 	{any} 			[dfault] 	Default fallback value.
 * @return	{any}						The given evaluation of the given option, or the default fallback value.
 */
export const valueOrFn = (
    element: HTMLElement,
    option?: any,
    dfault?: any
): any => {
    if (typeof option === 'function') {
        var value = option.call(element);
        if (typeof value != 'undefined') {
            return value;
        }
    }
    if (
        (option === null ||
            typeof option == 'function' ||
            typeof option == 'undefined') &&
        typeof dfault !== 'undefined'
    ) {
        return dfault;
    }
    return option;
};

/**
 * Set and invoke a (single) transition-end function with fallback.
 *
 * @param {HTMLElement} 	element 	Scope for the function.
 * @param {function}		func		Function to invoke.
 */
export const transitionend = (
    element: HTMLElement,
    func: Function
) => {
    var _ended = false,
        _fn = function (evnt) {
            if (typeof evnt !== 'undefined') {
                if (evnt.target !== element) {
                    return;
                }
            }

            if (!_ended) {
                element.removeEventListener('transitionend', _fn);
                func.call(element);
            }
            _ended = true;
        };

    element.addEventListener('transitionend', _fn);
};

/**
 * Get a (page wide) unique ID.
 */
export const uniqueId = () => {
    return `mm-${__id++}`;
};
let __id = 0;

/**
 * Get the original ID from a possibly prefixed ID.
 * @param id The possibly prefixed ID.
 */
export const originalId = (id) => {
    if (id.slice(0, 3) == 'mm-') {
        return id.slice(3);
    }
    return id;
};
