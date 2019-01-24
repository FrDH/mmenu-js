Mmenu.addons.fixedElements = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var conf = this.conf.fixedElements;
    var _fixd, _stck, fixed, stick;
    this.bind('setPage:after', function (page) {
        //	Fixed elements
        _fixd = _this.conf.classNames.fixedElements.fixed;
        fixed = Mmenu.DOM.find(page, '.' + _fixd);
        fixed.forEach(function (fxd) {
            Mmenu.refactorClass(fxd, _fixd, 'mm-slideout');
        });
        document.querySelector(conf.fixed.insertSelector)[conf.fixed.insertMethod](fixed);
        //	Sticky elements
        _stck = _this.conf.classNames.fixedElements.sticky;
        Mmenu.DOM.find(page, '.' + _stck)
            .forEach(function (stick) {
            Mmenu.refactorClass(stick, _stck, 'mm-sticky');
        });
        stick = Mmenu.DOM.find(page, '.mm-sticky');
    });
    this.bind('open:start', function () {
        if (stick.length) {
            if (window.getComputedStyle(document.documentElement).overflow == 'hidden') {
                var scrollTop_1 = document.documentElement.scrollTop + conf.sticky.offset;
                stick.forEach(function (element) {
                    element.style.top = (parseInt(window.getComputedStyle(element).top, 10) + scrollTop_1) + 'px';
                });
            }
        }
    });
    this.bind('close:finish', function () {
        stick.forEach(function (element) {
            element.style.top = '';
        });
    });
};
//	Default options and configuration.
Mmenu.configs.fixedElements = {
    fixed: {
        insertMethod: 'append',
        insertSelector: 'body'
    },
    sticky: {
        offset: 0
    }
};
Mmenu.configs.classNames.fixedElements = {
    fixed: 'Fixed',
    sticky: 'Sticky'
};
