//	Add-on options interface.
interface mmOptionsDropdown {
	drop 		: boolean
	fitViewport	: boolean
	event		: string
	position	: mmLooseObject
	tip			: boolean
};

//	Add-on configs interfaces.
interface mmConfigsDropdown {
	offset	: mmConfigsDropdownOffset
	height	: mmConfigsDropdownDimensions
	width	: mmConfigsDropdownDimensions
};
interface mmConfigsDropdownOffset {
	button	: mmConfigsDropdownOffsetPositions
	viewport: mmConfigsDropdownOffsetPositions
}
interface mmConfigsDropdownOffsetPositions {
	x : number
	y : number
}

interface mmConfigsDropdownDimensions {
	max	: number
}
