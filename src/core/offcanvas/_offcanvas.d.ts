//	Add-on options interface.
interface mmOptionsOffcanvas {
	blockUI			: boolean | string
	moveBackground	: boolean
}

//	Add-on configs interfaces.
interface mmConfigsOffcanvas {
	menu : mmConfigsOffcanvasMenu
	page : mmConfigsOffcanvasPage
}
interface mmConfigsOffcanvasMenu {
	insertMethod	: string
	insertSelector	: string
}
interface mmConfigsOffcanvasPage {
	nodetype		: string
	selector		: string
	noSelector		: string[]
	wrapIfNeeded	: boolean
}
