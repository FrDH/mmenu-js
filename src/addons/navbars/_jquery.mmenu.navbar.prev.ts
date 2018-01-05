/*
 * jQuery mmenu navbar add-on prev content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ 	= 'mmenu';
	const _ADDON_  	= 'navbars';
	const _CONTENT_	= 'prev';

	$[ _PLUGIN_ ].addons[ _ADDON_ ][ _CONTENT_ ] = function( $navbar, opts )
	{
		//	Get vars
		var _c = $[ _PLUGIN_ ]._c;


		//	Add content
		var $prev = $('<a class="' + _c.btn + ' ' + _c.btn + '_prev ' + _c.navbar + '__btn" href="#" />')
			.appendTo( $navbar );

		
		this.bind( 'initNavbar:after',
			function( $panel )
			{
				$panel.removeClass( _c.panel + '_has-navbar' );
			}
		);


		//	Update to opened panel
		var $org;
		var _url, _txt;

		this.bind( 'openPanel:start', 
			function( $panel )
			{
				if ( $panel.parent( '.' + _c.listitem + '_vertical' ).length )
				{
					return;
				}

				$org = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelPrev );
				if ( !$org.length )
				{
					$org = $panel.children( '.' + _c.navbar ).children( '.' + _c.btn + '_prev' );
				}

				_url = $org.attr( 'href' );
				_txt = $org.html();

				if ( _url )
				{
					$prev.attr( 'href', _url );
				}
				else
				{
					$prev.removeAttr( 'href' );
				}

				$prev[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
				$prev.html( _txt );
			}
		);


		//	Add screenreader / aria support
		this.bind( 'initNavbar:after:sr-aria',
			function( $panel )
			{
				var $navbar = $panel.children( '.' + _c.navbar );
				this.__sr_aria( $navbar, 'hidden', true );
			}
		);
		this.bind( 'openPanel:start:sr-aria',
			function( $panel )
			{
				this.__sr_aria( $prev, 'hidden', $prev.hasClass( _c.hidden ) );
				this.__sr_aria( $prev, 'owns', ( $prev.attr( 'href' ) || '' ).slice( 1 ) );
			}
		);
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelPrev = 'Prev';

})( jQuery );
