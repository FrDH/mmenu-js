/**	Options for the columns add-on. */
interface mmOptionsColumns {

	/** Whether or not a to split up the panels in multiple columns. */
	add ?: boolean

	/** Map for the visible columns. */
	visible	?: mmOptionsColumnsVisible
}

/**	Map for the visible columns. */
interface mmOptionsColumnsVisible {

	/** The minimum number of visible columns. */
	min	?: number

	/** The maximum number of visible columns. */
	max	?: number
}
