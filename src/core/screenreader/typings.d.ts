//	Add-on options interface.
interface mmOptionsScreenreader {
	aria ?: boolean
	text ?: boolean
}

//	Add-on configs interfaces.
interface mmConfigsScreenreader {
	text ?: mmConfigsScreenreaderText
}
interface mmConfigsScreenreaderText {
	closeMenu ?: string
	closeSubmenu ?: string
	openSubmenu ?: string
	toggleSubmenu ?: string
}
