/**	Options for the pageScroll add-on. */
interface mmOptionsPagescroll {
    /** Whether or not to smoothly scroll to a section on the page after clicking a menu item. */
    scroll?: boolean;

    /** Whether or not to automatically make a menu item appear "selected" when scrolling through the section it is linked to. */
    update?: boolean;
}

/**	Configuration for the pageScroll add-on. */
interface mmConfigsPagescroll {
    /** Amount of pixels to scroll past the top of a section after clicking a menu item. */
    scrollOffset?: number;

    /** Amount of pixels to scroll past the top of a section before its menu item will appear "selected". */
    updateOffset?: number;
}
