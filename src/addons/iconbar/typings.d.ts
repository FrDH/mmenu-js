/**	Options for the iconbar add-on. */
interface mmOptionsIconbar {

	/** Whether or not (and at what breakpoint) to add an iconbar to the menu. */
	use ?: boolean | number | string,

	/** An array of strings (for text or HTML) or HTML elements for icons to put in the top of the iconbar. */
	top ?: string[] | HTMLElement[],

	/** An array of strings (for text or HTML) or HTML elements for icons to put in the bottom of the iconbar. */
	bottom ?: string[] | HTMLElement[],

	/** Where to position the iconbar in the menu. */
	position ?: 'left' | 'right'

	/** The type of iconbar. */
	type ?: 'default' | 'tabs'
}
