//	Add-on options interfaces.
interface mmOptionsSearchfield {
	add 			: boolean
	addTo			: string
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
	fx 				: string
	id				: string
	splash			: string
	title			: string
}

//	Add-on configs interface.
interface mmConfigsSearchfield {
	clear			: boolean
	form			: boolean
	input			: boolean
	submit			: boolean
}
