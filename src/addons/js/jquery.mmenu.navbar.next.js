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
		$navbar.append( '<a class="' + _c.next + ' ' + _c.btn + '" href="#"></a>' );


		//	Update
		var update = function( $panel )
		{
			$panel = $panel || this.$menu.children( '.' + _c.current );

			var $node = $navbar.find( '.' + _c.next ),
				$orgn = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelNext );
			
			var _url = $orgn.attr( 'href' ),
				_txt = $orgn.html();

			$node[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
			$node[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
			$node.html( _txt );
		};

		this.bind( 'openPanel', update );
		this.bind( 'init',
			function()
			{
				update.call( this );
			}
		);
	};

})( jQuery );