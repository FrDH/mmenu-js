/**	Options for the dividers add-on. */
interface mmOptionsDividers {
	/** Whether or not to automatically add dividers to the menu (dividing the listitems alphabetically). */
	add	?: boolean

	/** Where to add the dividers. */
	addTo ?: string

	/** Whether or not to keep the divider of the currently viewed section fixed at the top. */
	fixed ?: boolean

	/** The style of the dividers. */
	type ?: 'compact' | 'light'
}
