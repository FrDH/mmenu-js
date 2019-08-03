/** Options for the drag engine. */
interface dragOption {
    area: dragArea;
}

/** How far from the sides the gesture can start. */
interface dragArea {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
}

/** Tresholds for gestures. */
interface dragTreshold {
    start?: number;
    swipe?: number;
}

/** Set of x and y positions. */
interface dragCoordinates {
    x: number;
    y: number;
}
