/*	
 * WordPress wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default WordPress support.
 */


(function( $ ) {

	const _PLUGIN_ = 'mmenu';

	$[ _PLUGIN_ ].configuration.classNames.selected = 'current-menu-item';

	$("#wpadminbar")
		.css( 'position', 'fixed' )
		.addClass( 'mm-slideout' );

})( jQuery );