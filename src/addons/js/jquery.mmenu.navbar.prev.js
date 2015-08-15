/*	
 * jQuery mmenu navbar addon prev content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'prev';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		$navbar.append( '<a class="' + _c.prev + ' ' + _c.btn + '" href="#"></a>' );
		this.bind( 'init',
			function( $panl )
			{
				$panl.removeClass( _c.hasnavbar );
			}
		);

		//	Update
		var update = function()
		{
			var $panl = this.$menu.children( '.' + _c.current );

			var $node = $navbar.find( '.' + _c.prev ),
				$orgn = $panl.find( '.' + this.conf.classNames[ _ADDON_ ].panelPrev );

			if ( !$orgn.length )
			{
				$orgn = $panl.children( '.' + _c.navbar ).children( '.' + _c.prev );
			}
			
			var _url = $orgn.attr( 'href' ),
				_txt = $orgn.html();

			$node[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
			$node[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
			$node.html( _txt );
		};

		this.bind( 'openPanel', update );
		this.bind( 'init', update );
	};

})( jQuery );