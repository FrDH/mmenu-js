Mmenu.wrappers.wordpress = function(
	this : Mmenu
) {
	this.conf.classNames.selected = 'current-menu-item';

	var wpadminbar = document.getElementById( 'wpadminbar' );
	wpadminbar.style.position = 'fixed';
	wpadminbar.classList.add( 'mm-slideout' );
};
