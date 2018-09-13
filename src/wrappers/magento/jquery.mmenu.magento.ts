(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'magento';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		this.conf.classNames.selected = 'active';
	};

})( jQuery );
