//	Add-on options interface.
interface mmOptionsNavbarsNavbar {
	content : string[] | JQuery[]
	height	: number
	position: string
	type 	: string
}

//	Add0on configs interfaces.
interface mmConfigsNavbars {
	breadcrumbs : mmConfigsNavbarsBreadcrumbs
}
interface mmConfigsNavbarsBreadcrumbs {
	separator 	: string
	removeFirst : boolean
}
