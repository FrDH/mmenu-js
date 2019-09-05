/**	Configuration for the fixedElements add-on. */
interface mmConfigsFixedelements {
    /** How to insert the fixed element to the DOM. */
    insertMethod?: 'prepend' | 'append';

    /** Query selector for the element the fixed element should be inserted in. */
    insertSelector?: string;
}
