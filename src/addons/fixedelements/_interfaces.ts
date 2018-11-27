//	Add-on configs interfaces.
interface mmConfigsFixedelements {
	fixed 	: mmConfigsFixedelementsFixed
	sticky 	: mmConfigsFixedelementsSticky
}
interface mmConfigsFixedelementsFixed {
	insertMethod	: string
	insertSelector	: string
}
interface mmConfigsFixedelementsSticky {
	offset : number
}
