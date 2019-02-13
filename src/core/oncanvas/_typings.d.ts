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

/** An object with even listeners. */
interface mmEventObject {
	[key: string]	: EventListener
}

/** An object with HTMLElement values. */
interface mmHtmlObject {
	[key: string] 	: HTMLElement
}

//	TODO	add description for each method
/** The menu API. */
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

/**	Options for the menu. */
interface mmOptions {

	/** Funcitons to invoke in hooks. */
	hooks : mmFunctionObject

	/** List of extensions to use. */
	extensions : mmOptionsExensions | string[]

	/** List of wrappers to use. */
	wrappers : string[]

	/** Options for the navbar. */
	navbar : mmOptionsNavbar

	/** Options for clicking a listitem. */
	onClick : mmOptionsOnclick

	/** Whether or not to use sliding submenus.*/
	slidingSubmenus : boolean



	//	Core add-ons

	/** Optons for the off-canvas add-on. */
	offCanvas ?: mmOptionsOffcanvas

	/** Options for the screen reader add-on. */
	screenReader ?: mmOptionsScreenreader

	/** Options for the scroll bug fix add-on. */
	scrollBugFix ?: mmOptionsScrollbugfix



	//	Add-ons

	/** Optons for the auto height add-on. */
	autoHeight ?: mmOptionsAutoheight

	/** Optons for the back button add-on. */
	backButton ?: mmOptionsBackbutton

	/** Optons for the columns add-on. */
	columns ?: mmOptionsColumns

	/** Optons for the counters add-on. */
	counters ?: mmOptionsCounters

	/** Optons for the dividers add-on. */
	dividers ?: mmOptionsDividers

	/** Optons for the drag add-on. */
	drag ?: mmOptionsDrag

	/** Optons for the dropdown add-on. */
	dropdown ?: mmOptionsDropdown

	/** Optons for the iconbar add-on. */
	iconbar ?: mmOptionsIconbar

	/** Optons for the icon panels add-on. */
	iconPanels ?: mmOptionsIconpanels

	/** Optons for the keyboard navigation add-on. */
	keyboardNavigation ?: mmOptionsKeyboardnavigation

	/** Optons for the lazy submenus add-on. */
	lazySubmenus ?: mmOptionsLazysubmenus

	/** Range of navbar options for the navbars add-on. */
	navbars ?: mmOptionsNavbarsNavbar[]

	/** Optons for the page scroll add-on. */
	pageScroll ?: mmOptionsPagescroll

	/** Optons for the searchfield add-on. */
	searchfield ?: mmOptionsSearchfield

	/** Optons for the section indexer add-on. */
	sectionIndexer ?: mmOptionsSectionindexer

	/** Optons for the set selected add-on. */
	setSelected ?: mmOptionsSetselected

	/** Optons for the sidebar add-on. */
	sidebar ?: mmOptionsSidebar
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

	/** Whether or not to close the menu after clicking a menu item. */
	close : boolean

	/** Whether or not to prevent the default behavior after clicking a menu item. */
	preventDefault : boolean

	/** Whether or not to a clicked menu item selected. */
	setSelected : boolean
}


/**	Configuration for the menu. */
interface mmConfigs {

	/** Object with classnames to refactor. */
	classNames : mmLooseObject

	/** Whether or not to use a clone of the menu node. */
	clone : boolean

	/** The language to translate to. */
	language : 'nl' | 'de' | 'ru' | 'fa'

	/** Interval between the setup and opening the menu. */
	openingInterval : number

	/** List of node-types that are considered to be panels. */
	panelNodetype : string[]

	/** The duration of transitions. */
	transitionDuration : number



	//	Core add-ons

	/** Configuration for the off-canvas add-on. */
	offCanvas ?: mmConfigsOffcanvas

	/** Configuration for the screen reader add-on. */
	screenReader ?: mmConfigsScreenreader



	//	Add-ons

	/** Configuration for the drag add-on. */
	drag ?: mmConfigsDrag

	/** Configuration for the dropdown add-on. */
	dropdown ?: mmConfigsDropdown

	/** Configuration for the fixed elements add-on. */
	fixedElements ?: mmConfigsFixedelements

	/** Configuration for the navbars add-on. */
	navbars ?: mmConfigsNavbars

	/** Configuration for the page scroll add-on. */
	pageScroll ?: mmConfigsPagescroll

	/** Configuration for the searchfield add-on. */
	searchfield	?: mmConfigsSearchfield
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
