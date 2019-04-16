/**	Options for the searchfield add-on. */
interface mmOptionsSearchfield {

	/** Whether or not to automatically prepend a searchfield to the menu or (some of the) panels. */
	add ?: boolean

	/** Where to add the searchfield(s). */
	addTo ?: string | HTMLElement[]

	/** Whether or not to add a cancel button after the searchfield. */
	cancel ?: boolean

	/** The text to show when no results are found.  */
	noResults ?: string

	/** The placeholder text for the searchfield. */
	placeholder ?: string

	/** Panel options */
	panel ?: mmOptionsSearchfieldPanel

	/** Whether or not to immediately search through the listitems while typing. */
	search ?: boolean

	/** Whether or not to show its sub-panels if a listitem matches the search. */
	showTextItems ?: boolean

	/** Whether or not to show listitems without an anchor in the results.  */
	showSubPanels ?: boolean
}

/**	Panel options for the searchfield add-on. */
interface mmOptionsSearchfieldPanel {

	/** Whether or not to add a search panel for showing the search results. */
	add ?: boolean

	/** Whether or not to add dividers to divide the results per panel. */
	dividers ?: boolean

	/** Effect for opening and closing the search panel. */
	fx ?: string | boolean

	/** The ID to add to the search panel. */
	id ?: string

	/** HTML to show in the search panel before searching. */
	splash ?: string

	/** The title in the navbar for the search panel. */
	title ?: string
}


/**	Configuration for the searchfield add-on. */
interface mmConfigsSearchfield {

	/** Wraps the searchfield in a FORM element with the specified keys/values as attributes. */
	form ?: mmLooseObject | boolean

	/** Adds the specified keys/values as attributes to the searchfield. */
	input ?: mmLooseObject | boolean

	/** Whether or not to add a clear button to the searchfield. */
	clear ?: boolean

	/** Whether or not to add a submit button to the searchfield. */
	submit ?: boolean
}
