/*	
 * jQuery mmenu Angular wrapper
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'angular';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		this.opts.onClick = {
			close			: true,
			preventDefault	: false,
			setSelected		: true
		};
	};

})( jQuery );