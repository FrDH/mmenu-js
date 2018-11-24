Mmenu.wrappers.wordpress = function(
	this : Mmenu
) {
	this.conf.classNames.selected = 'current-menu-item';

	jQuery("#wpadminbar")
		.css( 'position', 'fixed' )
		.addClass( 'mm-slideout' );
};
