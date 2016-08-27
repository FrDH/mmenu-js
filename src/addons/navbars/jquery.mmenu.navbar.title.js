/*	
 * jQuery mmenu navbar addon title content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ 	= 'mmenu',
		_ADDON_  	= 'navbars',
		_CONTENT_	= 'title';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		var $title = $('<a class="' + _c.title + '" />').appendTo( $navbar );


		//	Update
		var _url, _txt;

		var update = function( $panel )
		{
			$panel = $panel || this.$pnls.children( '.' + _c.current );
			if ( $panel.hasClass( _c.vertical ) )
			{
				return;
			}

			var $orgn = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelTitle );
			if ( !$orgn.length )
			{
				$orgn = $panel.children( '.' + _c.navbar ).children( '.' + _c.title );
			}

			_url = $orgn.attr( 'href' );
			_txt = $orgn.html() || opts.title;

			$title[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
			$title[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
			$title.html( _txt );
		};

		this.bind( 'openPanel', update );
		this.bind( 'initPanels',
			function( $panels )
			{
				update.call( this );
			}
		);


		//	Maintain content count
		return 0;
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelTitle = 'Title';

})( jQuery );