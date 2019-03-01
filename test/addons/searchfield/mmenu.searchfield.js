import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import configs from './_configs';
Mmenu.options.searchfield = options;
Mmenu.configs.searchfield = configs;
export default function () {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Extend shorthand options.
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (typeof options.panel == 'boolean') {
        options.panel = {
            add: options.panel
        };
    }
    if (typeof options.panel != 'object') {
        options.panel = {};
    }
    //	/Extend shorthand options.
    if (!options.add) {
        return;
    }
    //	Extend logical options.
    if (options.addTo == 'panel') {
        options.panel.add = true;
    }
    if (options.panel.add) {
        options.showSubPanels = false;
        if (options.panel.splash) {
            options.cancel = true;
        }
    }
    //	/Extend logical options.
    this.opts.searchfield = Mmenu.extend(options, Mmenu.options.searchfield);
    //	Blur searchfield
    this.bind('close:start', () => {
        Mmenu.DOM.find(this.node.menu, '.mm-searchfield')
            .forEach((input) => {
            input.blur();
        });
    });
    this.bind('initPanels:after', (panels) => {
        var searchpanel = null;
        //	Add the search panel
        if (options.panel.add) {
            searchpanel = this._initSearchPanel(panels);
        }
        //	Add the searchfield
        var addTo = null;
        switch (options.addTo) {
            case 'panels':
                addTo = panels;
                break;
            case 'panel':
                addTo = [searchpanel];
                break;
            default:
                if (typeof options.addTo == 'string') {
                    addTo = Mmenu.DOM.find(this.node.menu, options.addTo);
                }
                else if (Mmenu.typeof(options.addTo) == 'array') {
                    addTo = options.addTo;
                }
                break;
        }
        addTo.forEach((form) => {
            form = this._initSearchfield(form);
            if (options.search && form) {
                this._initSearching(form);
            }
        });
        //	Add the no-results message
        if (options.noResults) {
            (options.panel.add ? [searchpanel] : panels).forEach((panel) => {
                this._initNoResultsMsg(panel);
            });
        }
    });
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor
    this.clck.push((anchor, args) => {
        if (args.inMenu) {
            if (anchor.matches('.mm-searchfield__btn')) {
                //	Clicking the clear button
                if (anchor.matches('.mm-btn_close')) {
                    let form = anchor.closest('.mm-searchfield'), input = Mmenu.DOM.find(form, 'input')[0];
                    input.value = '';
                    this.search(input);
                    return true;
                }
                //	Clicking the submit button
                if (anchor.matches('.mm-btn_next')) {
                    let form = anchor.closest('form');
                    if (form) {
                        form.submit();
                    }
                    return true;
                }
            }
        }
    });
}
;
Mmenu.prototype._initSearchPanel = function (panels) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Only once
    if (Mmenu.DOM.children(this.node.pnls, '.mm-panel_search').length) {
        return null;
    }
    var searchpanel = Mmenu.DOM.create('div.mm-panel_search'), listview = Mmenu.DOM.create('ul');
    searchpanel.append(listview);
    this.node.pnls.append(searchpanel);
    if (options.panel.id) {
        searchpanel.id = options.panel.id;
    }
    if (options.panel.title) {
        searchpanel.setAttribute('data-mm-title', options.panel.title);
    }
    switch (options.panel.fx) {
        case false:
            break;
        case 'none':
            searchpanel.classList.add('mm-panel_noanimation');
            break;
        default:
            searchpanel.classList.add('mm-panel_fx-' + options.panel.fx);
            break;
    }
    //	Add splash content
    if (options.panel.splash) {
        let splash = Mmenu.DOM.create('div.mm-panel__searchsplash');
        splash.innerHTML = options.panel.splash;
        searchpanel.append(splash);
    }
    this._initPanels([searchpanel]);
    return searchpanel;
};
Mmenu.prototype._initSearchfield = function (wrapper) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	No searchfield in vertical submenus	
    if (wrapper.parentElement.matches('.mm-listitem_vertical')) {
        return null;
    }
    //	Only one searchfield per panel
    var form = Mmenu.DOM.find(wrapper, '.mm-searchfield')[0];
    if (form) {
        return form;
    }
    function addAttributes(element, attr) {
        if (attr) {
            for (var a in attr) {
                element.setAttribute(a, attr[a]);
            }
        }
    }
    var form = Mmenu.DOM.create((configs.form ? 'form' : 'div') + '.mm-searchfield'), field = Mmenu.DOM.create('div.mm-searchfield__input'), input = Mmenu.DOM.create('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = this.i18n(options.placeholder);
    field.append(input);
    form.append(field);
    wrapper.prepend(form);
    if (wrapper.matches('.mm-panel')) {
        wrapper.classList.add('mm-panel_has-searchfield');
    }
    //	Add attributes to the input
    addAttributes(input, configs.input);
    //	Add the clear button
    if (configs.clear) {
        let anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_close.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    //	Add attributes and submit to the form
    addAttributes(form, configs.form);
    if (configs.form && configs.submit && !configs.clear) {
        let anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    if (options.cancel) {
        let anchor = Mmenu.DOM.create('a.mm-searchfield__cancel');
        anchor.setAttribute('href', '#');
        anchor.textContent = this.i18n('cancel');
        form.append(anchor);
    }
    return form;
};
Mmenu.prototype._initSearching = function (form) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    var data = {};
    //	In the searchpanel.
    if (form.closest('.mm-panel_search')) {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [form.closest('.mm-panel')];
        //	In a panel
    }
    else if (form.closest('.mm-panel')) {
        data.panels = [form.closest('.mm-panel')];
        data.noresults = data.panels;
        //	Not in a panel, global
    }
    else {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [this.node.menu];
    }
    //	Filter out vertical submenus
    data.panels = data.panels.filter(panel => !panel.parentElement.matches('.mm-listitem_vertical'));
    //	Filter out search panel
    data.panels = data.panels.filter(panel => !panel.matches('.mm-panel_search'));
    var listitems = [];
    data.panels.forEach((panel) => {
        listitems.push(...Mmenu.DOM.find(panel, '.mm-listitem'));
    });
    data.listitems = listitems.filter(listitem => !listitem.matches('.mm-listitem_divider'));
    data.dividers = listitems.filter(listitem => listitem.matches('.mm-listitem_divider'));
    var searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0], input = Mmenu.DOM.find(form, 'input')[0], cancel = Mmenu.DOM.find(form, '.mm-searchfield__cancel')[0];
    input['mmSearchfield'] = data;
    //	Open the splash panel when focussing the input.
    if (options.panel.add && options.panel.splash) {
        //	Remove the focus eventlistener from the input.
        if (this.evnt.inputFocusSearchfieldSplash) {
            input.removeEventListener('focus', this.evnt.inputFocusSearchfieldSplash);
        }
        //	Create the eventlistener.
        this.evnt.inputFocusSearchfieldSplash = (evnt) => {
            this.openPanel(searchpanel);
        };
        //	Add the focus eventlistener to the input..
        input.addEventListener('focus', this.evnt.inputFocusSearchfieldSplash);
    }
    //	Handle the cancel button.
    if (options.cancel) {
        //	Remove the focus eventlistener from the input.
        if (this.evnt.inputFocusSearchfieldCancel) {
            input.removeEventListener('focus', this.evnt.inputFocusSearchfieldCancel);
        }
        //	Create the eventlistener.	
        this.evnt.inputFocusSearchfieldCancel = (evnt) => {
            cancel.classList.add('mm-searchfield__cancel-active');
        };
        //	Add the focus eventlistener to the input.
        input.addEventListener('focus', this.evnt.inputFocusSearchfieldCancel);
        //	Remove the focus eventlistener from the input.
        if (this.evnt.cancelClickSearchfieldSplash) {
            cancel.removeEventListener('click', this.evnt.cancelClickSearchfieldSplash);
        }
        //	Create the eventlistener.	
        this.evnt.cancelClickSearchfieldSplash = (evnt) => {
            evnt.preventDefault();
            cancel.classList.remove('mm-searchfield__cancel-active');
            if (searchpanel.matches('.mm-panel_opened')) {
                let parents = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened-parent');
                if (parents.length) {
                    this.openPanel(parents[parents.length - 1]);
                }
            }
        };
        //	Add the focus eventlistener to the input.
        cancel.addEventListener('click', this.evnt.cancelClickSearchfieldSplash);
    }
    if (options.panel.add && options.addTo == 'panel') {
        this.bind('openPanel:finish', (panel) => {
            if (panel === searchpanel) {
                input.focus();
            }
        });
    }
    //	Remove the focus eventlistener from the input.
    if (this.evnt.inputInputSearchfieldSearch) {
        input.removeEventListener('input', this.evnt.inputInputSearchfieldSearch);
    }
    //	Create the eventlistener.	
    this.evnt.inputInputSearchfieldSearch = (evnt) => {
        switch (evnt.keyCode) {
            case 9: //	tab
            case 16: //	shift
            case 17: //	control
            case 18: //	alt
            case 37: //	left
            case 38: //	top
            case 39: //	right
            case 40: //	bottom
                break;
            default:
                this.search(input);
                break;
        }
    };
    //	Add the focus eventlistener to the input.
    input.addEventListener('input', this.evnt.inputInputSearchfieldSearch);
    //	Fire once initially
    this.search(input);
};
Mmenu.prototype._initNoResultsMsg = function (wrapper) {
    if (!wrapper) {
        return;
    }
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    //	Not in a panel
    if (!wrapper.closest('.mm-panel')) {
        wrapper = Mmenu.DOM.children(this.node.pnls, '.mm-panel')[0];
    }
    //	Only once
    if (Mmenu.DOM.children(wrapper, '.mm-panel__noresultsmsg').length) {
        return;
    }
    //	Add no-results message
    var message = Mmenu.DOM.create('div.mm-panel__noresultsmsg.mm-hidden');
    message.innerHTML = this.i18n(options.noResults);
    wrapper.prepend(message);
};
Mmenu.prototype.search = function (input, query) {
    var options = this.opts.searchfield, configs = this.conf.searchfield;
    query = query || '' + input.value;
    query = query.toLowerCase().trim();
    var data = input['mmSearchfield'];
    var form = input.closest('.mm-searchfield'), buttons = Mmenu.DOM.find(form, '.mm-btn'), searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0];
    var panels = data.panels, noresults = data.noresults, listitems = data.listitems, dividers = data.dividers;
    //	Reset previous results
    listitems.forEach((listitem) => {
        listitem.classList.remove('mm-listitem_nosubitems');
    });
    //	TODO: dit klopt niet meer	
    // Mmenu.$(listitems).find( '.mm-btn_fullwidth-search' )
    // .removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );
    if (searchpanel) {
        Mmenu.DOM.children(searchpanel, '.mm-listview')[0].innerHTML = '';
    }
    panels.forEach((panel) => {
        panel.scrollTop = 0;
    });
    //	Search
    if (query.length) {
        //	Initially hide all listitems
        listitems.forEach((listitem) => {
            listitem.classList.add('mm-hidden');
        });
        dividers.forEach((divider) => {
            divider.classList.add('mm-hidden');
        });
        //	Re-show only listitems that match
        listitems.forEach((listitem) => {
            var _search = '.mm-listitem__text'; // 'a'
            if (options.showTextItems || (options.showSubPanels && listitem.querySelector('.mm-btn_next'))) {
                // _search = 'a, span';
            }
            else {
                _search = 'a' + _search;
            }
            let text = Mmenu.DOM.children(listitem, _search)[0];
            if (text && text.textContent.toLowerCase().indexOf(query) > -1) {
                listitem.classList.remove('mm-hidden');
            }
        });
        //	Show all mached listitems in the search panel
        if (options.panel.add) {
            //	Clone all matched listitems into the search panel
            let allitems = [];
            panels.forEach((panel) => {
                let listitems = Mmenu.filterListItems(Mmenu.DOM.find(panel, '.mm-listitem'));
                if (listitems.length) {
                    if (options.panel.dividers) {
                        let divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.innerHTML = panel.querySelector('.mm-navbar__title').innerHTML;
                        listitems.push(divider);
                    }
                    listitems.forEach((listitem) => {
                        allitems.push(listitem.cloneNode(true));
                    });
                }
            });
            //	Remove toggles, checks and open buttons
            allitems.forEach((listitem) => {
                listitem.querySelectorAll('.mm-toggle, .mm-check, .mm-btn')
                    .forEach((element) => {
                    element.remove();
                });
            });
            //	Add to the search panel
            Mmenu.DOM.children(searchpanel, '.mm-listview')[0].append(...listitems);
            //	Open the search panel
            this.openPanel(searchpanel);
        }
        else {
            //	Also show listitems in sub-panels for matched listitems
            if (options.showSubPanels) {
                panels.forEach((panel) => {
                    let listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                    Mmenu.filterListItems(listitems)
                        .forEach((listitem) => {
                        let child = listitem['mmChild'];
                        if (child) {
                            Mmenu.DOM.find(child, '.mm-listitem')
                                .forEach((listitem) => {
                                listitem.classList.remove('mm-hidden');
                            });
                        }
                    });
                });
            }
            //	Update parent for sub-panel
            panels.reverse()
                .forEach((panel, p) => {
                let parent = panel['mmParent'];
                if (parent) {
                    //	The current panel has mached listitems
                    let listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                    if (Mmenu.filterListItems(listitems).length) {
                        //	Show parent
                        if (parent.matches('.mm-hidden')) {
                            parent.classList.remove('mm-hidden');
                            //	TODO: dit klopt niet meer...
                            //	Het idee was een btn tijdelijk fullwidth te laten zijn omdat het zelf geen resultaat is, maar zn submenu wel.
                            // Mmenu.$(parent)
                            // 	.children( '.mm-btn_next' )
                            // 	.not( '.mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth-search' );
                        }
                    }
                    else if (!input.closest('.mm-panel')) {
                        if (panel.matches('.mm-panel_opened') ||
                            panel.matches('.mm-panel_opened-parent')) {
                            //	Compensate the timeout for the opening animation
                            setTimeout(() => {
                                this.openPanel(parent.closest('.mm-panel'));
                            }, (p + 1) * (this.conf.openingInterval * 1.5));
                        }
                        parent.classList.add('mm-listitem_nosubitems');
                    }
                }
            });
            //	Show first preceeding divider of parent
            panels.forEach((panel) => {
                let listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                Mmenu.filterListItems(listitems)
                    .forEach((listitem) => {
                    let divider = Mmenu.DOM.prevAll(listitem, '.mm-listitem_divider')[0];
                    if (divider) {
                        divider.classList.remove('mm-hidden');
                    }
                });
            });
        }
        //	Show submit / clear button
        buttons.forEach(button => button.classList.remove('mm-hidden'));
        //	Show/hide no results message
        noresults.forEach(wrapper => {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')
                .forEach(message => message.classList[listitems.filter(listitem => !listitem.matches('.mm-hidden')).length ? 'add' : 'remove']('mm-hidden'));
        });
        if (options.panel.add) {
            //	Hide splash
            if (options.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')
                    .forEach(splash => splash.classList.add('mm-hidden'));
            }
            //	Re-show original listitems when in search panel
            listitems.forEach(listitem => listitem.classList.remove('mm-hidden'));
            dividers.forEach(divider => divider.classList.remove('mm-hidden'));
        }
        //	Don't search
    }
    else {
        //	Show all items
        listitems.forEach(listitem => listitem.classList.remove('mm-hidden'));
        dividers.forEach(divider => divider.classList.remove('mm-hidden'));
        //	Hide submit / clear button
        buttons.forEach(button => button.classList.add('mm-hidden'));
        //	Hide no results message
        noresults.forEach(wrapper => {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')
                .forEach(message => message.classList.add('mm-hidden'));
        });
        if (options.panel.add) {
            //	Show splash
            if (options.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')
                    .forEach(splash => splash.classList.remove('mm-hidden'));
                //	Close panel 
            }
            else if (!input.closest('.mm-panel_search')) {
                let opened = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened-parent');
                this.openPanel(opened.slice(-1)[0]);
            }
        }
    }
    //	Update for other addons
    this.trigger('updateListview');
};
