/** An object with any value. */
interface mmLooseObject {
    [key: string]: any;
}

/** An object with string values. */
interface mmStringObject {
    [key: string]: string;
}

/** An object with boolean values. */
interface mmBooleanObject {
    [key: string]: boolean;
}

/** An object with function values. */
interface mmFunctionObject {
    [key: string]: Function;
}

/** An object with even listeners. */
interface mmEventObject {
    [key: string]: EventListener;
}

/** An object with HTMLElement values. */
interface mmHtmlObject {
    [key: string]: HTMLElement;
}

/** The menu API. */
interface mmApi {
    bind: Function;
    initPanel: Function;
    openPanel: Function;
    closePanel: Function;
    setSelected: Function;

    //	offCanvas add-on
    open: Function;
    close: Function;
    setPage: Function;

    //	searchfield add-on
    search: Function;
}

//	Class methods interfaces.
interface mmMethodUniqueid {
    (): string;
}
interface mmMethodI18n {
    (text?: object, language?: string): object;
    (text?: string, language?: string): string;
    (text?: undefined, language?: string): object;
}

/**	Options for the menu. */
interface mmOptions {
    /** A collection of extensions to enable for the menu. */
    extensions?: mmOptionsExensions | string[];

    /** A collection of functions to hook into the API methods before the menu is initialised. */
    hooks?: mmFunctionObject;

    /** Options for the navbar. */
    navbar?: mmOptionsNavbar;

    /** Whether or not submenus should come sliding in from the right. */
    slidingSubmenus?: boolean;

    //	Core add-ons

    /** Options for the off-canvas add-on. */
    offCanvas?: mmOptionsOffcanvas;

    /** Options for the scroll bug fix add-on. */
    scrollBugFix?: mmOptionsScrollbugfix;

    //	Add-ons

    /** Options for the back button add-on. */
    backButton?: mmOptionsBackbutton;

    /** Options for the counters add-on. */
    counters?: mmOptionsCounters;

    /** Options for the iconbar add-on. */
    iconbar?: mmOptionsIconbar;

    /** Options for the icon panels add-on. */
    iconPanels?: mmOptionsIconpanels;

    /** List of navbar options for the navbars add-on. */
    navbars?: mmOptionsNavbarsNavbar[];

    /** Options for the page scroll add-on. */
    pageScroll?: mmOptionsPagescroll;

    /** Options for the searchfield add-on. */
    searchfield?: mmOptionsSearchfield;

    /** Options for the section indexer add-on. */
    sectionIndexer?: mmOptionsSectionindexer;

    /** Options for the set selected add-on. */
    setSelected?: mmOptionsSetselected;

    /** Options for the sidebar add-on. */
    sidebar?: mmOptionsSidebar;
}

/**	Extensions for the menu. */
interface mmOptionsExensions {
    [key: string]: mmOptionsExensions | string[];
}

/**	Navbar options for the menu. */
interface mmOptionsNavbar {
    /** Whether or not to add a navbar above the panels. */
    add?: boolean;

    /** The title above the panels. */
    title?: string;

    /** The type of link to set for the title. */
    titleLink?: 'parent' | 'anchor' | 'none';
}

/**	Configuration for the menu. */
interface mmConfigs {
    /** Object with classnames to refactor. */
    classNames?: mmLooseObject;

    /** The language to translate the menu to. */
    language?: string;

    /** List of possible node-type of panels. */
    panelNodetype?: string[];

    /** Configuration for the screen reader add-on. */
    screenReader?: mmConfigsScreenreader;

    //	Core add-ons

    /** Configuration for the off-canvas add-on. */
    offCanvas?: mmConfigsOffcanvas;

    //	Add-ons

    /** Configuration for the navbars add-on. */
    navbars?: mmConfigsNavbars;

    /** Configuration for the page scroll add-on. */
    pageScroll?: mmConfigsPagescroll;

    /** Configuration for the searchfield add-on. */
    searchfield?: mmConfigsSearchfield;
}

//  ScreenReader configs interfaces.
interface mmConfigsScreenreader {
	closeMenu ?: string
	closeSubmenu ?: string
	openMenu ?: string
	openSubmenu ?: string
	toggleSubmenu ?: string
}