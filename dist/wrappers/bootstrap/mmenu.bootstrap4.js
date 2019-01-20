Mmenu.wrappers.bootstrap4 = function () {
    var _this = this;
    //	Create the menu
    if (this.node.menu.matches('.navbar-collapse')) {
        //	No need for cloning the menu...
        this.conf.clone = false;
        //	... We'll create a new menu
        var nav = Mmenu.DOM.create('nav'), $pnl = Mmenu.$('<div />');
        nav.append($pnl[0]);
        Mmenu.$(this.node.menu)
            .children()
            .each(function (i, elem) {
            var $t = Mmenu.$(elem);
            switch (true) {
                case $t.hasClass('navbar-nav'):
                    $pnl.append(cloneNav($t));
                    break;
                case $t.hasClass('dropdown-menu'):
                    $pnl.append(cloneDropdown($t));
                    break;
                case $t.hasClass('form-inline'):
                    _this.conf.searchfield.form = {
                        action: $t[0].getAttribute('action') || null,
                        method: $t[0].getAttribute('method') || null
                    };
                    _this.conf.searchfield.input = {
                        name: $t.find('input')[0].getAttribute('name') || null
                    };
                    _this.conf.searchfield.clear = false;
                    _this.conf.searchfield.submit = true;
                    break;
                default:
                    $pnl.append($t.clone(true));
                    break;
            }
        });
        //	Set the menu
        this.bind('initMenu:before', function () {
            document.body.prepend(nav);
            _this.node.menu = nav;
        });
        //	Hijack the toggler
        var toggler = this.node.menu.parentElement.querySelector('.navbar-toggler');
        toggler.removeAttribute('data-target');
        toggler.removeAttribute('aria-controls');
        Mmenu.$(toggler)
            .off('click')
            .on('click', function (evnt) {
            evnt.preventDefault();
            evnt.stopImmediatePropagation();
            _this[_this.vars.opened ? 'close' : 'open']();
        });
    }
    function cloneLink($a) {
        var $i = Mmenu.$('<a />');
        var attr = ['href', 'title', 'target'];
        for (var a = 0; a < attr.length; a++) {
            if (typeof $a.attr(attr[a]) != 'undefined') {
                $i[0].setAttribute(attr[a], $a[0].getAttribute(attr[a]));
            }
        }
        $i.html($a.html());
        $i.find('.sr-only').remove();
        return $i;
    }
    function cloneDropdown($d) {
        var $ul = Mmenu.$('<ul />');
        $d.children()
            .each(function () {
            var $di = Mmenu.$(this), $li = Mmenu.$('<li />');
            if ($di.hasClass('dropdown-divider')) {
                $li.addClass('Divider');
            }
            else if ($di.hasClass('dropdown-item')) {
                $li.append(cloneLink($di));
            }
            $ul.append($li);
        });
        return $ul;
    }
    function cloneNav($n) {
        var $ul = Mmenu.$('<ul />');
        $n.find('.nav-item')
            .each(function () {
            var $ni = Mmenu.$(this), $li = Mmenu.$('<li />');
            if ($ni.hasClass('active')) {
                $li.addClass('Selected');
            }
            if (!$ni.hasClass('nav-link')) {
                var $dd = $ni.children('.dropdown-menu');
                if ($dd.length) {
                    $li.append(cloneDropdown($dd));
                }
                $ni = $ni.children('.nav-link');
            }
            $li.prepend(cloneLink($ni));
            $ul.append($li);
        });
        return $ul;
    }
};
