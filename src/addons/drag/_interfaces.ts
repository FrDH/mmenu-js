//	Add-on options interfaces.
interface mmOptionsDrag {
	menu 	: mmOptionsDragMenu
	panels 	: mmOptionsDragPanels
	vendors	: mmLooseObject
}
interface mmOptionsDragMenu {
	open 		: boolean
	node		: string | JQuery | Function
	maxStartPos	: number
	threshold	: number
}
interface mmOptionsDragPanels {
	close 	: boolean
}

//	Add-on configs interfaces.
interface mmConfigsDrag {
	menu : mmConfigsDragMenu
}
interface mmConfigsDragMenu {
	width	: mmConfigsDragMenuDimensions,
	height	: mmConfigsDragMenuDimensions
}
interface mmConfigsDragMenuDimensions {
	perc	: number
	min		: number
	max		: number
}
