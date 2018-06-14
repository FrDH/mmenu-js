/*	
 * jQuery mmenu navbar add-on searchfield content
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'searchfield';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		var _c = $[ _PLUGIN_ ]._c;

		var $srch = $('<div class="' + _c.searchfield + '" />')
			.appendTo( $navbar );

		if ( typeof this.opts.searchfield != 'object' )
		{
			this.opts.searchfield = {};
		}
		this.opts.searchfield.add = true;
		this.opts.searchfield.addTo = $srch;
	};

})( jQuery );