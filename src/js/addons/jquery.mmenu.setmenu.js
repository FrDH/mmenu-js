/*	
 * jQuery mmenu setMenu addon
 * Set menu in function of URLs
 * Copyright (c) Anthemis
 */

(function($){

	var _PLUGIN_ = 'mmenu',
		_ADDON_ = 'setMenu';

	$[ _PLUGIN_ ].addons[ _ADDON_ ]	= { 

		setup : function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ];

			var setMenu  = function(url, nbRecursion)
			{
				if(nbRecursion == undefined)
					nbRecursion = 0;

				if(nbRecursion < opts.nbRecursion)
				{
					url = url.split("?")[0].split("#")[0];

					lien = that.$menu.find('a[href="'+ url +'"]');

					if(lien.size() > 0)
					{
						that.setSelected(lien.parent(), true);
					}
					else
					{
						url = url.split('/').slice(0,-2).join('/') + '/';
						setMenu(url, nbRecursion + 1);
					}
				}
			}

			setMenu(window.location.href, 0);		
		},


		add : function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
		},

		clickAnchor: function( $a, inMenu ) {}
	}

	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = { 
		nbRecursion : 3
	};	


	var _c, _d, _e;

})(jQuery);
