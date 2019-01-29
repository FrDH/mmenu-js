Mmenu.addons.setSelected = function () {
    var _this = this;
    var opts = this.opts.setSelected;
    //	Extend shorthand options
    if (typeof opts == 'boolean') {
        opts = {
            hover: opts,
            parent: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	Extend shorthand options
    //opts = this.opts.setSelected = jQuery.extend( true, {}, Mmenu.options.setSelected, opts );
    this.opts.setSelected = Mmenu.extend(opts, Mmenu.options.setSelected);
    //	Find current by URL
    if (opts.current == 'detect') {
        function findCurrent(url) {
            url = url.split("?")[0].split("#")[0];
            var anchor = this.node.menu.querySelector('a[href="' + url + '"], a[href="' + url + '/"]');
            if (anchor) {
                this.setSelected(anchor.parentElement);
            }
            else {
                var arr = url.split('/').slice(0, -1);
                if (arr.length) {
                    findCurrent.call(this, arr.join('/'));
                }
            }
        }
        ;
        this.bind('initMenu:after', function () {
            findCurrent.call(_this, window.location.href);
        });
    }
    //	Remove current selected item
    else if (!opts.current) {
        this.bind('initListview:after', function (panel) {
            Mmenu.DOM.find(panel, '.mm-listitem_selected')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected');
            });
        });
    }
    //	Add :hover effect on items
    if (opts.hover) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-hover');
        });
    }
    //	Set parent item selected for submenus
    if (opts.parent) {
        this.bind('openPanel:finish', function (panel) {
            //	Remove all
            Mmenu.DOM.find(_this.node.pnls, '.mm-listitem_selected-parent')
                .forEach(function (listitem) {
                listitem.classList.remove('mm-listitem_selected-parent');
            });
            //	Move up the DOM tree
            var parent = panel['mmParent'];
            while (parent) {
                if (!parent.matches('.mm-listitem_vertical')) {
                    parent.classList.add('mm-listitem_selected-parent');
                }
                parent = parent.closest('.mm-panel');
                parent = parent['mmParent'];
            }
        });
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu_selected-parent');
        });
    }
};
//	Default options and configuration.
Mmenu.options.setSelected = {
    current: true,
    hover: false,
    parent: false
};
