/**	Options for the dropdown add-on. */
interface mmOptionsDropdown {
	drop 		: boolean
	fitViewport	: boolean
	event		: string
	position	: mmLooseObject
	tip			: boolean
}


/**	Configuration for the dropdown add-on. */
interface mmConfigsDropdown {
	offset	: mmConfigsDropdownOffset
	height	: mmConfigsDropdownDimensions
	width	: mmConfigsDropdownDimensions
}

/**	"offset" configuration for the dropdown add-on. */
interface mmConfigsDropdownOffset {
	button	: mmConfigsDropdownOffsetPositions
	viewport: mmConfigsDropdownOffsetPositions
}

/**	"offset positions" configuration for the dropdown add-on. */
interface mmConfigsDropdownOffsetPositions {
	x : number
	y : number
}

/**	"dimensions" configuration for the dropdown add-on. */
interface mmConfigsDropdownDimensions {
	max	: number
}
