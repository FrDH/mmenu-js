/**	Options for the sidebar add-on. */
interface mmOptionsSidebar {
	collapsed 	: mmOptionsSidebarCollapsed
	expanded 	: mmOptionsSidebarExpanded
}

/**	"collapsed" options for the searchfield add-on. */
interface mmOptionsSidebarCollapsed {
	use 		: boolean | string
	blockMenu	: boolean
	hideDivider	: boolean
	hideNavbar	: boolean
}

/**	"expanded" options for the searchfield add-on. */
interface mmOptionsSidebarExpanded {
	use			: boolean | string
}
