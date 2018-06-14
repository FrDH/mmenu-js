/*
 * jQuery mmenu navbar add-on next content
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'next';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		var $next = $('<a class="' + _c.btn + ' ' + _c.btn + '_next ' + _c.navbar + '__btn" href="#" />')
			.appendTo( $navbar );


		//	Update to opened panel
		var $org;
		var _url, _txt;


		this.bind( 'openPanel:start',
			function( $panel )
			{
				$org = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelNext );

				_url = $org.attr( 'href' );
				_txt = $org.html();

				if ( _url )
				{
					$next.attr( 'href', _url );
				}
				else
				{
					$next.removeAttr( 'href' );
				}
				
				$next[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
				$next.html( _txt );
			}
		);


		//	Add screenreader / aria support
		this.bind( 'openPanel:start:sr-aria',
			function( $panel )
			{
				this.__sr_aria( $next, 'hidden', $next.hasClass( _c.hidden ) );
				this.__sr_aria( $next, 'owns', ( $next.attr( 'href' ) || '' ).slice( 1 ) );
			}
		);
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelNext	= 'Next';

})( jQuery );
