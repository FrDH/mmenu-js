/*	
 * jQuery mmenu Olark wrapper
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'olark';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		this.conf.offCanvas.noPageSelector.push( '#olark' );
	};

})( jQuery );
