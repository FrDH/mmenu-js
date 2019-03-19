/**	Options for the dropdown add-on. */
interface mmOptionsDropdown {

	/** Whether or not to open the menu as a dropdown from the menu-button. */
	drop ?: boolean
	
	/** The event to open and close the menu. */
	event ?: 'click' | 'hover' | 'click hover' | 'hover click'

	/** Whether or not to fit the menu in the viewport. */
	fitViewport ?: boolean
	
	/** Positioning options. */
	position ?: mmLooseObject
	
	/** Whether or not to prepend the menu with a tip pointing to the menu-button. */
	tip ?: boolean
}

/** Positioning options for the dropdown add-on. */
interface mmOptionsDropdownPosition {

	/**  Query selector for the button to click. */
	of ?: string

	/** How to horizontally position the menu relative to the button. */
	x ?: 'left' | 'right'

	/** How to vertically position the menu relative to the button. */
	y ?: 'top' | 'bottom'
}


/**	Configuration for the dropdown add-on. */
interface mmConfigsDropdown {

	/** Offset confgiuration. */
	offset ?: mmConfigsDropdownOffset

	/** Height confgiuration. */
	height ?: mmConfigsDropdownDimensions

	/** Width confgiuration. */
	width ?: mmConfigsDropdownDimensions
}

/**	Offset configuration for the dropdown add-on. */
interface mmConfigsDropdownOffset {

	/**	Button positioning configuration. */
	button ?: mmConfigsDropdownOffsetPositions

	/**	Viewport positioning configuration. */
	viewport ?: mmConfigsDropdownOffsetPositions
}

/**	Positioning configuration for the dropdown add-on. */
interface mmConfigsDropdownOffsetPositions {

	/** The horizontal offset for the menu. */
	x ?: number

	/** The vertical offset for the menu. */
	y ?: number
}

/**	Dimensions configuration for the dropdown add-on. */
interface mmConfigsDropdownDimensions {

	/** The maximum size of the menu. */
	max ?: number
}
