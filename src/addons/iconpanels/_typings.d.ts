/**	Options for the iconPanels add-on. */
interface mmOptionsIconpanels {

	/** Whether or not a small part of parent panels should be visible. */
	add ?: boolean

	/** Whether or not to block the parent panels from interaction. */
	blockPanel ?: boolean

	/** Whether or not to hide dividers in parent panels, showing only the listitems. */
	hideDivider ?: boolean

	/** Whether or not to hide navbars in parent panels, showing only the listviews. */
	hideNavbar ?: boolean

	/** The number of visible parent panels. */
	visible ?: number | 'first'
}
