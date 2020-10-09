/**	Options for the iconPanels add-on. */
interface mmOptionsIconpanels {

	/** Whether or not a small part of parent panels should be visible. */
	add?: boolean

	/** Whether or not to block the parent panels from interaction. */
	blockPanel?: boolean

	/** The number of visible parent panels. */
	visible?: number | 'first'
}
