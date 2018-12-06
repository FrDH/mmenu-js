//	Add-on options interfaces.
interface mmOptionsSearchfield {
	add 			: boolean
	addTo			: string | JQuery
	cancel			: boolean
	noResults		: string
	placeholder		: string
	panel 			: mmOptionsSearchfieldPanel
	search			: boolean
	showTextItems	: boolean
	showSubPanels	: boolean
}
interface mmOptionsSearchfieldPanel {
	add 			: boolean
	dividers		: boolean
	fx 				: string | boolean
	id				: string
	splash			: string
	title			: string
}

//	Add-on configs interface.
interface mmConfigsSearchfield {
	form			: mmLooseObject | boolean
	input			: mmLooseObject | boolean
	clear			: boolean
	submit			: boolean
}
