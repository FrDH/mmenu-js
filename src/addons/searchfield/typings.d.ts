/**	Options for the searchfield add-on. */
interface mmOptionsSearchfield {

	/** Whether or not to automatically prepend a searchfield to the menu or (some of the) panels. */
	add?: boolean

	/** QuerySelector for the panels to add a searchfield to, or "searchpanel". */
	addTo?: string

	/** The text to show when no results are found.  */
	noResults?: string

	/** The placeholder text for the searchfield. */
	placeholder?: string

	/** QuerySelector for the panels to search in. */
	searchIn?: string

	/** Text or HTML to add as splash content. */
	splash?: string

	/** Title for the searchpanel. */
	title?: string
}

/**	Configuration for the searchfield add-on. */
interface mmConfigsSearchfield {
	/** Whether or not to add a cancel button to the searchfield. */
	cancel?: boolean

	/** Whether or not to add a clear button to the searchfield. */
	clear?: boolean

	/** Adds the specified keys/values as attributes to fhe form. */
	form?: mmLooseObject

	/** Adds the specified keys/values as attributes to the input. */
	input?: mmLooseObject
	
	/** Adds the specified keys/values as attributes to the panel. */
	panel?: mmLooseObject

	/** Whether or not to add a submit button to the searchfield. */
	submit?: boolean
}
