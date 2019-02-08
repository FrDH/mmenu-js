/**	Options for the searchfield add-on. */
interface mmOptionsSearchfield {
	add 			: boolean
	addTo			: string | HTMLElement[]
	cancel			: boolean
	noResults		: string
	placeholder		: string
	panel 			: mmOptionsSearchfieldPanel
	search			: boolean
	showTextItems	: boolean
	showSubPanels	: boolean
}

/**	"panel" options for the searchfield add-on. */
interface mmOptionsSearchfieldPanel {
	add 			: boolean
	dividers		: boolean
	fx 				: string | boolean
	id				: string
	splash			: string
	title			: string
}


/**	Configuration for the searchfield add-on. */
interface mmConfigsSearchfield {
	form			: mmLooseObject | boolean
	input			: mmLooseObject | boolean
	clear			: boolean
	submit			: boolean
}
