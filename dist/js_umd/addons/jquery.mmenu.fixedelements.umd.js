(function ( factory ) {
    if ( typeof define === 'function' && define.amd )
    {
        // AMD. Register as an anonymous module.
        define( [ 'jquery' ], factory );
    }
    else if ( typeof exports === 'object' )
    {
        // Node/CommonJS
        factory( require( 'jquery' ) );
    }
    else
    {
        // Browser globals
        factory( jQuery );
    }
}( function ( jQuery ) {


/*	
 * jQuery mmenu fixedElements addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(i){var s="mmenu",n="fixedElements";i[s].addons[n]={setup:function(){if(this.opts.offCanvas){this.opts[n],this.conf[n],o=i[s].glbl;var a=function(i){var s=this.conf.classNames[n].fixed;this.__refactorClass(i.find("."+s),s,"slideout").appendTo(o.$body)};a.call(this,o.$page),this.bind("setPage",a)}},add:function(){a=i[s]._c,t=i[s]._d,e=i[s]._e,a.add("fixed")},clickAnchor:function(){}},i[s].configuration.classNames[n]={fixed:"Fixed"};var a,t,e,o}(jQuery);
}));