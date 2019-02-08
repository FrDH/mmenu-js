/**	Configuration for the fixedElements add-on. */
interface mmConfigsFixedelements {
	fixed 	: mmConfigsFixedelementsFixed
	sticky 	: mmConfigsFixedelementsSticky
}

/**	"fixed" configuration for the fixedElements add-on. */
interface mmConfigsFixedelementsFixed {
	insertMethod	: string
	insertSelector	: string
}

/**	"sticky" configuration for the fixedElements add-on. */
interface mmConfigsFixedelementsSticky {
	offset : number
}
