/*	
 * AngularJS wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default AngularJS route support.
 */


(function( $ ) {

	const _PLUGIN_ = 'mmenu';

	$[ _PLUGIN_ ].defaults.onClick.close			= true;
	$[ _PLUGIN_ ].defaults.onClick.preventDefault	= false;
	$[ _PLUGIN_ ].defaults.onClick.setSelected		= true;

})( jQuery );