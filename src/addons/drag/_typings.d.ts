/**	Options for the drag add-on. */
interface mmOptionsDrag {
    /** Map of options for the menu. */
    menu?: mmOptionsDragMenu;

    /** Map of options for the panels. */
    panels?: mmOptionsDragPanels;
}

/**	"menu" options for the drag add-on. */
interface mmOptionsDragMenu {
    /** Whether or not to open the menu when dragging the page. */
    open?: boolean;

    /** The element on which the user can drag to open the menu. */
    node?: HTMLElement;
}

/**	"panels" options for the drag add-on. */
interface mmOptionsDragPanels {
    /** Whether or not to close a panel when swiping it out. */
    close?: boolean;
}
