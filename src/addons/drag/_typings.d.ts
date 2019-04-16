/**	Options for the drag add-on. */
interface mmOptionsDrag {

	/** Map of options for the menu. */
	menu ?: mmOptionsDragMenu

	/** Map of options for the panels. */
	panels ?: mmOptionsDragPanels

	/** Map of options for vendor scripts. */
	vendors ?: mmLooseObject
}

/**	"menu" options for the drag add-on. */
interface mmOptionsDragMenu {

	/** Whether or not to open the menu when dragging the page. */
	open ?: boolean

	/** The element on which the user can drag to open the menu. */
	node ?: string | HTMLElement | Function

	/** The maximum x-position to start dragging the page. */
	maxStartPos ?: number

	/** The minimum amount of pixels to drag before actually opening the menu, less than 50 is not advised. */
	threshold ?: number
}

/**	"panels" options for the drag add-on. */
interface mmOptionsDragPanels {

	/** Whether or not to close a panel when swiping it out. */
	close ?: boolean
}


/**	Configuragion for the drag add-on. */
interface mmConfigsDrag {

	/** Map of confgis for the menu. */
	menu ?: mmConfigsDragMenu
}

/**	"menu" configuragion for the drag add-on. */
interface mmConfigsDragMenu {

	/** Map of width options. */
	width ?: mmConfigsDragMenuDimensions,

	/** Map of height options. */
	height ?: mmConfigsDragMenuDimensions
}

/**	"menu dimensions" configuragion for the drag add-on. */
interface mmConfigsDragMenuDimensions {

	/** The size of the menu as a percentage. From 0.0 (fully hidden) to 1.0 (fully opened). */
	perc ?: number

	/** The minimum size of the menu. */
	min ?: number

	/** The maximum size of the menu. */
	max ?: number
}
