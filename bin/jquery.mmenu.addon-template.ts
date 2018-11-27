Mmenu.addons.ADDON = function( 
	this: Mmenu
) {
	var opts = this.opts.ADDON,
		conf = this.conf.ADDON;


	//	Extend shorthand options
	if ( typeof opts != 'object' )
	{
		opts = {};
	}
	opts = this.opts.ADDON = jQuery.extend( true, {}, Mmenu.options.ADDON, opts );

	//	Extend shorthand configuration
	if ( typeof conf != 'object' )
	{
		conf = {};
	}
	conf = this.conf.ADDON = jQuery.extend( true, {}, Mmenu.configs.ADDON, conf );

	//	Add methods to api
	this._api.push( 'fn1', 'fn2' );

	//	Bind functions to update
	this.bind( 'updateListview', 
		function(
			this : Mmenu
		) {
			console.log( 'The listviews were updated.' );
		}
	);


	//	Add click behavior.
	//	Prevents default behavior when clicking an anchor
	this.clck.push(
		function(
			this : Mmenu,
			$a	 : JQuery,
			args : iLooseObject
		) {

			//	Return undefined if the add-on does not need to add behavior for the clicked anchor.
			return;

			//	Return true if the add-on added behavior and no other behavior should be added.
			return true;

			//	Return an object if the add-on only alters the default behavior for the clicked anchor.
			return {
				setSelected 	: true,
				preventDefault	: true,
				close 			: true
			};
		}
	);

};


//	Default options and configuration.
Mmenu.options.ADDON = {
	//	...
};
Mmenu.configs.ADDON = {
	//	...
};
