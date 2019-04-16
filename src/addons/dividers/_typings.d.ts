/**	Options for the dividers add-on. */
interface mmOptionsDividers {
    /** Whether or not to automatically add dividers to the menu (dividing the listitems alphabetically). */
    add?: boolean;

    /** Where to add the dividers. */
    addTo?: string;

    /** The style of the dividers. */
    type?: 'compact' | 'light';
}
