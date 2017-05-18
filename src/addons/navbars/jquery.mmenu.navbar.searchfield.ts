/*	
 * jQuery mmenu navbar add-on searchfield content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'searchfield';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		var _c = $[ _PLUGIN_ ]._c;

		var $srch = $('<div class="' + _c.search + '" />')
			.appendTo( $navbar );

		if ( typeof this.opts.searchfield != 'object' )
		{
			this.opts.searchfield = {};
		}
		this.opts.searchfield.add = true;
		this.opts.searchfield.addTo = $srch;


		//	Maintain content count
		return 0;
	};

})( jQuery );