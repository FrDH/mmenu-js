//	Generic interfaces.
interface mmLooseObject {
	[key: string] 	: any
}
interface mmStringObject {
	[key: string] 	: string
}
interface mmFunctionObject {
	[key: string] 	: Function
}
interface mmJqueryObject {
	[key: string] 	: JQuery
}


//	Class API interface.
//	TODO	add description for each method
interface mmApi {
	bind 			: Function
	initPanels		: Function
	openPanel 		: Function
	closePanel		: Function
	closeAllPanels	: Function
	setSelected		: Function

	//	offCanvas add-on
	open			: Function
	close			: Function
	setPage			: Function

	//	searchfield add-on
	search			: Function
}


//	Class methods interfaces.
interface mmMethodUniqueid {
	 () : string
}
interface mmMethodI18n {
	(
		text		?: string | object,
		language	?: string
	) : string | object
}


//	Class options interfaces.
interface mmOptions {
	hooks 				: mmFunctionObject
	extensions			: string[] | mmOptionsExensions
	wrappers			: string[]
	navbar 				: mmOptionsNavbar
	onClick				: mmOptionsOnclick
	slidingSubmenus		: boolean

	//	Core add-ons
	offCanvas			?: mmOptionsOffcanvas
	screenReader		?: mmOptionsScreenreader
	scrollBugFix		?: mmOptionsScrollbugfix

	//	Add-ons
	autoHeight			?: mmOptionsAutoheight
	backButton			?: mmOptionsBackbutton
	columns				?: mmOptionsColumns
	counters			?: mmOptionsCounters
	dividers 			?: mmOptionsDividers
	drag 				?: mmOptionsDrag
	dropdown			?: mmOptionsDropdown
	iconbar 			?: mmOptionsIconbar
	iconPanels			?: mmOptionsIconpanels
	keyboardNavigation	?: mmOptionsKeyboardnavigation
	lazySubmenus		?: mmOptionsLazysubmenus
	navbars				?: mmOptionsNavbarsNavbar[]
	pageScroll			?: mmOptionsPagescroll
	searchfield			?: mmOptionsSearchfield
	sectionIndexer		?: mmOptionsSectionindexer
	setSelected			?: mmOptionsSetselected
	sidebar				?: mmOptionsSidebar

	//	Make it "loose" so add-ons can extend it.
	[key: string] 		: any
}
interface mmOptionsExensions {
	[key: string] 		: string[] | mmOptionsExensions
}
interface mmOptionsNavbar {
	add 				: boolean
	title				: string | Function
	titleLink			: string
}
interface mmOptionsOnclick {
	close				: boolean
	preventDefault		: boolean
	setSelected			: boolean
}


//	Class configs interface.
interface mmConfigs {
	classNames			: mmLooseObject
	clone				: boolean
	language			: string
	openingInterval		: number
	panelNodetype		: string
	transitionDuration	: number

	//	Core add-ons
	offCanvas 			?: mmConfigsOffcanvas
	screenReader		?: mmConfigsScreenreader

	//	Add-ons
	drag 				?: mmConfigsDrag
	dropdown			?: mmConfigsDropdown
	fixedElements		?: mmConfigsFixedelements
	navbars				?: mmConfigsNavbars
	pageScroll			?: mmConfigsPagescroll
	searchfield			?: mmConfigsSearchfield

	//	Make it "loose" so add-ons can extend it.
	[key: string] 		: any
}


//	Click arguments interface.
interface mmClickArguments {
	inMenu 				: boolean
	inListview 			: boolean
	toExternal			: boolean
}
