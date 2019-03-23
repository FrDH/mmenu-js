/**	"navbar" options for the navbars add-on. */
interface mmOptionsNavbarsNavbar {

	/** An array of HTML elements or strings (for text or HTML or the keywords: "breadcrumbs", "close", "next", "prev", "searchfield", "title"). */
	content ?: string[] | HTMLElement[]

	/** The size of the navbar. */
	height ?: 1 | 2 | 3 | 4

	/** The position for the navbar. */
	position ?: 'top' | 'bottom'

	/** Whether or not to enable the navbar. */
	use ?: boolean | string | number

	/** The type of navbar. */
	type ?: 'tabs'
}


/**	Configuration for the navbars add-on. */
interface mmConfigsNavbars {

	/** Creadcrumbs configuration. */
	breadcrumbs ?: mmConfigsNavbarsBreadcrumbs
}

/**	Breadcrumbs configuration for the navbars add-on. */
interface mmConfigsNavbarsBreadcrumbs {

	/** The separator between two breadcrumbs. */
	separator ?: string

	/** Whether or not to remove the first breadcrumb. */
	removeFirst ?: boolean
}
