//	Declare global variables jQuery alternatives
declare var Zepto : JQueryStatic
declare var cash  : JQueryStatic


/** An object with any value. */
interface mmLooseObject {
	[key: string] 	: any
}

/** An object with string values. */
interface mmStringObject {
	[key: string] 	: string
}

/** An object with boolean values. */
interface mmBooleanObject {
	[key: string]	: boolean
}

/** An object with function values. */
interface mmFunctionObject {
	[key: string] 	: Function
}

/** An object with jQuery values. */
interface mmJqueryObject {
	[key: string] 	: JQuery
}

/** An object with jQuery values. */
interface mmHtmlObject {
	[key: string] 	: HTMLElement
}

/** Typescript bugfix */
interface ArrayConstructor {
    from(arrayLike: any, mapFn?, thisArg?) : any[];
}

//	TODO	add description for each method
/** API for the menu. */
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


//	TODO	add description for each option
/**	Options for the menu. */
interface mmOptions {
	hooks 				: mmFunctionObject
	extensions			: mmOptionsExensions | string[]
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
}

/**	Extensions for the menu. */
interface mmOptionsExensions {
	[key: string] 		: mmOptionsExensions | string[]
}

/**	Navbar options for the menu. */
interface mmOptionsNavbar {
	add 				: boolean
	title				: string | Function
	titleLink			: string
}

/**	onClick options for the menu. */
interface mmOptionsOnclick {
	close				: boolean
	preventDefault		: boolean
	setSelected			: boolean
}


//	TODO	add description for each option
/**	Configuration for the menu. */
interface mmConfigs {
	classNames			: mmLooseObject
	clone				: boolean
	language			: string
	openingInterval		: number
	panelNodetype		: string[]
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
}


/**	Arguments for the onClick handlers. */
interface mmClickArguments {

	/** Whether or not the anchor is inside the menu. */
	inMenu 				: boolean

	/** Whether or not the anchor is inside a listview. */
	inListview 			: boolean

	/** Whether or not the anchor references to an external page. */
	toExternal			: boolean
}
