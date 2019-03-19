/**	Options for the iconbar add-on. */
interface mmOptionsIconbar {

	/** Whether or not to prepend an iconbar to the menu. */
	add ?: boolean,

	/** An array of strings (for text or HTML) or HTML elements for icons to put in the top of the iconbar. */
	top ?: string[] | HTMLElement[],

	/** An array of strings (for text or HTML) or HTML elements for icons to put in the bottom of the iconbar. */
	bottom ?: string[] | HTMLElement[],

	/** The type of iconbar. */
	type ?: 'default' | 'tabs'
}
