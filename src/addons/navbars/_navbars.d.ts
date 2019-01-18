/**	"navbar" options for the navbars add-on. */
interface mmOptionsNavbarsNavbar {
	content : string[] | HTMLElement[]
	height	: number
	position: string
	type 	: string
}


/**	Configuration for the navbars add-on. */
interface mmConfigsNavbars {
	breadcrumbs : mmConfigsNavbarsBreadcrumbs
}

/**	"breadcrumbs" configuration for the navbars add-on. */
interface mmConfigsNavbarsBreadcrumbs {
	separator 	: string
	removeFirst : boolean
}
