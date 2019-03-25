/**
 * Create an element with classname.
 *
 * @param 	{string}		selector	The nodeName and classnames for the element to create.
 * @return	{HTMLElement}				The created element.
 */
export function create(
	selector : string
) : HTMLElement {
	var elem : HTMLElement;
	selector.split( '.' ).forEach(( arg, a ) => {
		if ( a == 0 ) {
			elem = document.createElement( arg );
		} else {
			elem.classList.add( arg );
		}
	});
	return elem;
};

/**
 * Find all elements matching the selector.
 * Basically the same as element.querySelectorAll() but it returns an actuall array.
 *
 * @param 	{HTMLElement} 	element Element to search in.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of elements that match the filter.
 */
export function find(
	element	: HTMLElement | Document,
	filter	: string
) : HTMLElement[] {
	return Array.prototype.slice.call( element.querySelectorAll( filter ) );
};

/**
 * Find all child elements matching the (optional) selector.
 *
 * @param 	{HTMLElement} 	element Element to search in.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of child elements that match the filter.
 */
export function children(
	element	 : HTMLElement,
	filter	?: string
) : HTMLElement[] {
	var children : HTMLElement[] = Array.prototype.slice.call( element.children );
	return filter
		? children.filter( child => child.matches( filter ) )
		: children;
};

/**
 * Find all preceding elements matching the selector.
 *
 * @param 	{HTMLElement} 	element Element to start searching from.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of preceding elements that match the selector.
 */
export function parents (
	element	 : HTMLElement,
	filter	?: string
) : HTMLElement[] {

	/** Array of preceding elements that match the selector. */
	var parents : HTMLElement[] = [];

	/** Array of preceding elements that match the selector. */
	var parent = element.parentElement;
	while ( parent )  {
		parents.push( parent );
		parent = parent.parentElement;
	}

	return filter
		? parents.filter( parent => parent.matches( filter ) )
		: parents;
};

/**
 * Find all previous siblings matching the selecotr.
 *
 * @param 	{HTMLElement} 	element Element to start searching from.
 * @param 	{string}		filter	The filter to match.
 * @return	{array}					Array of previous siblings that match the selector.
 */
export function prevAll(
	element	 : HTMLElement,
	filter  ?: string
) : HTMLElement[] {

	/** Array of previous siblings that match the selector. */
	var previous : HTMLElement[] = [];

	/** Current element in the loop */
	var current = (element.previousElementSibling as HTMLElement);

	while ( current ) {
		if ( !filter || current.matches( filter ) ) {
			previous.push( current );
		}
		current = (current.previousElementSibling as HTMLElement);
	}

	return previous;
};

/**
 * Get an element offset relative to the document.
 *
 * @param 	{HTMLElement}	 element 			Element to start measuring from.
 * @param 	{string}		 [direction=top] 	Offset top or left.
 * @return	{number}							The element offset relative to the document.
 */
export function offset(
	element 	 : HTMLElement,
	direction	?: string
) : number {

	return element.getBoundingClientRect()[ direction ] + document.body[ ( direction === 'left' ) ? 'scrollLeft' : 'scrollTop' ];
};
