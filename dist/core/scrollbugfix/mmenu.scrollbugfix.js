Mmenu.addons.scrollBugFix = function () {
    var _this = this;
    //	The scrollBugFix add-on fixes a scrolling bug
    //		1) on touch devices
    //		2) in an off-canvas menu 
    //		3) that -when opened- blocks the UI from interaction 
    if (!Mmenu.support.touch || // 1
        !this.opts.offCanvas || // 2
        !this.opts.offCanvas.blockUI // 3
    ) {
        return;
    }
    var opts = this.opts.scrollBugFix;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            fix: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	Extend shorthand options
    this.opts.scrollBugFix = Mmenu.extend(opts, Mmenu.options.scrollBugFix);
    if (!opts.fix) {
        return;
    }
    //	When opening the menu, scroll to the top of the current opened panel.
    this.bind('open:start', function () {
        Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0].scrollTop = 0;
    });
    this.bind('initMenu:after', function () {
        //	Only needs to be done once per page.
        if (!_this.vars.scrollBugFixed) {
            var scrolling_1 = false;
            //	Prevent the body from scrolling.
            document.addEventListener('touchmove', function (evnt) {
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    evnt.preventDefault();
                }
            });
            document.body.addEventListener('touchstart', function (evnt) {
                var panel = evnt.currentTarget;
                console.log(panel);
                if (!panel.matches('.mm-panels > .mm-panel')) {
                    return;
                }
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    if (!scrolling_1) {
                        //	Since we're potentially scrolling the panel in the onScroll event, 
                        //	this little hack prevents an infinite loop.
                        scrolling_1 = true;
                        if (panel.scrollTop === 0) {
                            panel.scrollTop = 1;
                        }
                        else if (panel.scrollHeight === panel.scrollTop + panel.offsetHeight) {
                            panel.scrollTop -= 1;
                        }
                        //	End of infinite loop preventing hack.
                        scrolling_1 = false;
                    }
                }
            });
            document.body.addEventListener('touchmove', function (evnt) {
                var panel = evnt.currentTarget;
                console.log(panel);
                if (!panel.matches('.mm-panels > .mm-panel')) {
                    return;
                }
                if (document.documentElement.matches('.mm-wrapper_opened')) {
                    if (panel.scrollHeight > panel.clientHeight) {
                        evnt.stopPropagation();
                    }
                }
            });
        }
        _this.vars.scrollBugFixed = true;
        //	Fix issue after device rotation change.
        window.addEventListener('orientationchange', function (evnt) {
            var panel = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened')[0];
            panel.scrollTop = 0;
            //	Apparently, changing the overflow-scrolling property triggers some event :)
            panel.style['-webkit-overflow-scrolling'] = 'auto';
            panel.style['-webkit-overflow-scrolling'] = 'touch';
        });
    });
};
//	Default options and configuration.
Mmenu.options.scrollBugFix = {
    fix: true
};
