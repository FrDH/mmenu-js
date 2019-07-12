/**	Options for the sidebar add-on. */
interface mmOptionsSidebar {
    /** Collapsed options */
    collapsed?: mmOptionsSidebarCollapsed;

    /** Expanded options */
    expanded?: mmOptionsSidebarExpanded;
}

/**	Collapsed options for the searchfield add-on. */
interface mmOptionsSidebarCollapsed {
    /** Whether or not to enable the collapsed menu.  */
    use?: boolean | string | number;

    /** Whether or not to block the collapsed menu from interaction. */
    blockMenu?: boolean;

    /** Whether or not to hide dividers in a collapsed menu, showing only the listitems. */
    hideDivider?: boolean;

    /** Whether or not to hide navbars in a collapsed menu, showing only the listviews. */
    hideNavbar?: boolean;
}

/**	"expanded" options for the searchfield add-on. */
interface mmOptionsSidebarExpanded {
    /** Whether or not to enable the expanded menu.  */
    use?: boolean | string | number;

    /** The initial state */
    initial?: 'open' | 'closed' | 'remember';
}
