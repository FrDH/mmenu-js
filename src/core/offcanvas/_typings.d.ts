//	Add-on options interface.
interface mmOptionsOffcanvas {
    /** Whether or not (and how) to block the UI while the menu is opened. */
    blockUI?: true | false | 'modal';

    /** Whether or not to have the "page" inherit its background (from its parent element). */
    moveBackground?: boolean;
}

//	Add-on configs interfaces.
interface mmConfigsOffcanvas {
    /** Whether or not the menu should be cloned (and the original menu kept intact). */
    clone?: boolean;

    /** Menu configuration for the off-canvas add-on. */
    menu?: mmConfigsOffcanvasMenu;

    /** Page configuration for the off-canvas add-on. */
    page?: mmConfigsOffcanvasPage;
}
interface mmConfigsOffcanvasMenu {
    /** How to insert the menu into the DOM. */
    insertMethod?: 'prepend' | 'append';

    /** Where to insert the menu into the DOM. */
    insertSelector?: string;
}
interface mmConfigsOffcanvasPage {
    /** The nodetype for the page. */
    nodetype?: string;

    /** The selector for the page. */
    selector?: string;

    /** List of selectors for nodes to exclude from the page. */
    noSelector?: string[];
}
