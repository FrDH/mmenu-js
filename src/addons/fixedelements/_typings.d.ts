/**	Configuration for the fixedElements add-on. */
interface mmConfigsFixedelements {

	/** Fixed configuration. */
	fixed ?: mmConfigsFixedelementsFixed

	/** Sticky configuration. */
	sticky ?: mmConfigsFixedelementsSticky
}

/**	Fixed configuration for the fixedElements add-on. */
interface mmConfigsFixedelementsFixed {

	/** How to insert the fixed element to the DOM. */
	insertMethod ?: 'prepend' | 'append'

	/** Query selector for the element the fixed element should be inserted in. */
	insertSelector ?: string
}

/**	Sticky configuration for the fixedElements add-on. */
interface mmConfigsFixedelementsSticky {
	offset ?: number
}
