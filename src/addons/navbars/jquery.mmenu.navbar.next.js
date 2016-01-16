/*	
 * jQuery mmenu navbar addon next content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'next';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		var $next = $('<a class="' + _c.next + ' ' + _c.btn + '" href="#" />').appendTo( $navbar );


		//	Update
		var _url, _txt;

		var update = function( $panel )
		{
			$panel = $panel || this.$pnls.children( '.' + _c.current );

			var $orgn = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelNext );
			
			_url = $orgn.attr( 'href' );
			_txt = $orgn.html();

			$next[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
			$next[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
			$next.html( _txt );
		};

		this.bind( 'openPanel', update );
		this.bind( 'init',
			function()
			{
				update.call( this );
			}
		);

		//	Detract content count
		return -1;
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelNext	= 'Next';

})( jQuery );