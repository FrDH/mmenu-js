/**	Options for the drag add-on. */
interface mmOptionsDrag {
	menu 	: mmOptionsDragMenu
	panels 	: mmOptionsDragPanels
	vendors	: mmLooseObject
}

/**	"menu" options for the drag add-on. */
interface mmOptionsDragMenu {
	open 		: boolean
	node		: string | HTMLElement | Function
	maxStartPos	: number
	threshold	: number
}

/**	"panels" options for the drag add-on. */
interface mmOptionsDragPanels {
	close 	: boolean
}


/**	Configuragion for the drag add-on. */
interface mmConfigsDrag {
	menu : mmConfigsDragMenu
}

/**	"menu" configuragion for the drag add-on. */
interface mmConfigsDragMenu {
	width	: mmConfigsDragMenuDimensions,
	height	: mmConfigsDragMenuDimensions
}

/**	"menu dimensions" configuragion for the drag add-on. */
interface mmConfigsDragMenuDimensions {
	perc	: number
	min		: number
	max		: number
}
