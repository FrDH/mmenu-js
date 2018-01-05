/*	
 * jQuery mmenu WordPress wrapper
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'wordpress';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		this.conf.classNames.selected = 'current-menu-item';

		$("#wpadminbar")
			.css( 'position', 'fixed' )
			.addClass( 'mm-slideout' );
	};

})( jQuery );
