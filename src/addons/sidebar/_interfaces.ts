//	Add-on options interfaces.
interface mmOptionsSidebar {
	collapsed 	: mmOptionsSidebarCollapsed
	expanded 	: mmOptionsSidebarExpanded
}
interface mmOptionsSidebarCollapsed {
	use 		: boolean | string
	blockMenu	: boolean
	hideDivider	: boolean
	hideNavbar	: boolean
}
interface mmOptionsSidebarExpanded {
	use			: boolean | string
}
