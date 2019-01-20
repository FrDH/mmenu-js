Mmenu.addons.navbars.close = function (navbar) {
    var _this = this;
    //	Add content
    var close = Mmenu.DOM.create('a.mm-btn.mm-btn_close.mm-navbar__btn');
    navbar.append(close);
    //	Update to page node
    this.bind('setPage:after', function (page) {
        close.setAttribute('href', '#' + page.id);
    });
    //	Add screenreader / text support
    this.bind('setPage:after:sr-text', function () {
        close.innerHTML = Mmenu.sr_text(_this.i18n(_this.conf.screenReader.text.closeMenu));
        Mmenu.sr_aria(close, 'owns', close.getAttribute('href').slice(1));
    });
};
