/*	
 * Olark wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default Olark support.
 */


(function( $ ) {

	const _PLUGIN_ = 'mmenu';

	//	Add olark id to the noPageSelector array
	$[ _PLUGIN_ ].configuration.offCanvas.noPageSelector.push( '#olark' );

})( jQuery );