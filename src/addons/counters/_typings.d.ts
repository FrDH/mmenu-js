/**	Options for the counters add-on. */
interface mmOptionsCounters {

	/** Whether or not to automatically append a counter to each menu item that has a submenu. */
	add	?: boolean

	/** Where to add the counters. */
	addTo ?: string

	/** Whether or not to automatically count the number of items in the submenu. */
	count ?: boolean
}
