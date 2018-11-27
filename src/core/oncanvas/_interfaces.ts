//	Generic interfaces.
interface mmLooseObject {
	[key: string] 	: any
}
interface mmStringObject {
	[key: string] 	: string
}
interface mmFunctionsObject {
	[key: string] 	: Function
}


//	Class options interfaces.
interface mmOptions {
	hooks 			: mmFunctionsObject
	extensions		: string[] | mmOptionsExensions
	wrappers		: string[]
	navbar 			: mmOptionsNavbar
	onClick			: mmOptionsOnclick
	slidingSubmenus	: boolean

	//	Make it "loose" so add-ons and wrappers can extend it.
	[key: string] 	: any
}
interface mmOptionsExensions {
	[key: string] 	: string[] | mmOptionsExensions
}
interface mmOptionsNavbar {
	add 			: boolean
	title			: string | Function
	titleLink		: string
}
interface mmOptionsOnclick {
	close			: boolean
	preventDefault	: boolean
	setSelected		: boolean
}


//	Class configs interface.
interface mmConfigs {
	classNames			: mmLooseObject
	clone				: boolean
	language			: string
	openingInterval		: number
	panelNodetype		: string
	transitionDuration	: number

	//	Make it "loose" so add-ons and wrappers can extend it.
	[key: string] 	: any
}


//	Click arguments interface.
interface mmClickArguments {
	inMenu 			: boolean
	inListview 		: boolean
	toExternal		: boolean
}
