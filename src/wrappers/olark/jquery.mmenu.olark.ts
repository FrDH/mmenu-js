(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'olark';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		this.conf.offCanvas.page.noSelector.push( '#olark' );
	};

})( jQuery );
