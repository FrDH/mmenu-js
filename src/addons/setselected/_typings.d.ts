/**	Options for the setSelected add-on. */
interface mmOptionsSetselected {

	/** Whether or not to make the current menu item appear "selected". */
	current ?: boolean | 'detect'

	/** Whether or not to make menu item appear "selected" onMouseOver. */
	hover ?: boolean

	/** Whether or not to make menu item appear "selected" while its subpanel is opened. */
	parent ?: boolean
}
