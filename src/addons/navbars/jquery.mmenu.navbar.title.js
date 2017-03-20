/*	
 * jQuery mmenu navbar add-on title content
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
		var $title = $('<a class="' + _c.title + '" />')
			.appendTo( $navbar );


		//	Update to opened panel
		var _url, _txt;
		var $org;

		this.bind( 'openPanel:start',
			function( $panel )
			{
				if ( $panel.hasClass( _c.vertical ) )
				{
					return;
				}

				$org = $panel.find( '.' + this.conf.classNames[ _ADDON_ ].panelTitle );
				if ( !$org.length )
				{
					$org = $panel.children( '.' + _c.navbar ).children( '.' + _c.title );
				}

				_url = $org.attr( 'href' );
				_txt = $org.html() || opts.title;

				$title[ _url ? 'attr' : 'removeAttr' ]( 'href', _url );
				$title[ _url || _txt ? 'removeClass' : 'addClass' ]( _c.hidden );
				$title.html( _txt );
			}
		);


		//	Add screenreader / aria support
		var $prev;

		this.bind( 'openPanel:start:sr-aria',
			function( $panel )
			{
				if ( this.opts.screenReader.text )
				{
					if ( !$prev )
					{
						$prev = this.$menu
							.children( '.' + _c.navbars + '-top' + ', .' + _c.navbars + '-bottom' )
							.children( '.' + _c.navbar )
							.children( '.' + _c.prev );
					}
					if ( $prev.length )
					{
						var hidden = true;
						if ( this.opts.navbar.titleLink == 'parent' )
						{
							hidden = !$prev.hasClass( _c.hidden );
						}
						this.__sr_aria( $title, 'hidden', hidden );
					}
				}
			}
		);


		//	Maintain content count
		return 0;
	};

	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ].panelTitle = 'Title';

})( jQuery );