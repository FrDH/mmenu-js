import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import OPTIONS from './options';
import CONFIGS from './configs';
import translate from './translations';

import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
import options from '../../core/oncanvas/options';

//  Add the translations.
translate();

export default function (this: Mmenu) {
    this.opts.searchfield = this.opts.searchfield || {};
    this.conf.searchfield = this.conf.searchfield || {};

    //	Extend options.
    const options = extend(this.opts.searchfield, OPTIONS);
    const configs = extend(this.conf.searchfield, CONFIGS);

    if (!options.add) {
        return;
    }

    switch (options.addTo) {
        case 'panels':
            options.addTo = '.mm-panel';
            break;

        case 'searchpanel':
            options.addTo = '.mm-panel--search';
            break;
    }

    switch (options.searchIn) {
        case 'panels':
            options.searchIn = '.mm-panel';
            break;
    }

    //  Add a searchfield to panels matching the "addTo" querySelector.
    this.bind('initPanel:after', (panel: HTMLElement) => {
        if (panel.matches(options.addTo) &&
            !panel.closest('.mm-listitem--vertical')
        ) {
            initPanel.call(this, panel);
        }
    });

    this.bind('initMenu:after', () => {
        //  Create the resultspanel.
        const resultspanel = createResultsPanel.call(this);
        initPanel.call(this, resultspanel);
    
        //  Add a searchfield to anything other than a panel (most likely a navbar).
        DOM.find(this.node.menu, options.addTo).forEach(wrapper => {
            if (!wrapper.matches('.mm-panel')) {
                
                /** The searchform. */
                const form = createSearchfield.call(this);
                
                //  Add the form to the panel.
                wrapper.prepend(form);

                /** The input node. */
                const input = DOM.find(form, 'input')[0] as HTMLInputElement;
                
                // With a splash: open on focus...
                if (options.splash.length) {
                    input.addEventListener('focusin', () => {
                        //  TODO: focus moet in input blijven, extra param??                        
                        this.openPanel(resultspanel);
                        //  TODO: cancel zichtbaar maken
                    });
                    
                    // ...without splash.
                } else {
                    
                    //  Open resultspanel when searching.
                    input.addEventListener('mm.searching', (e) => {
                        //  TODO: focus moet in input blijven, extra param??                        
                        this.openPanel(resultspanel, false);
                    });
                    
                    //  Close resultspanel when resetting.
                    input.addEventListener('mm.clearing', () => {
                        console.log('clear');
                        
                        // TODO: close
                        this.closePanel(resultspanel);
                    });
                }
                
                //  Initialize searching.
                initSearch.call(this, form);
            }
        });
    });
   

    //	Blur searchfield
    this.bind('close:before', () => {
        DOM.find(this.node.menu, '.mm-searchfield input').forEach((input) => {
            input.blur();
        });
    });
}

/**
 * Create the searchpanel.
 * @param this {Mmenu}
 */
const createResultsPanel = function (
    this: Mmenu
) {

    /** Options for the searchfield. */
    const options = this.opts.searchfield;
    
    /** Configs for the searchfield. */
    const configs = this.conf.searchfield;

    /** The panel. */
    let panel = DOM.children(this.node.pnls, '.mm-panel--search')[0];

    //	Only once
    if (panel) {
        return panel;
    }

    panel = DOM.create('div.mm-panel--search');

    //	Add attributes to the panel.
    _addAttributes(panel, configs.panel);

    //  Add a title to the panel.
    if (options.title.length) {
        panel.dataset.mmTitle = this.i18n(options.title);
    }

    //  Add a listview to the panel.
    panel.append(DOM.create('ul'));

    this._initPanel(panel);

    return panel;
};

/**
 * Add a searchfield, splash message and no-results message to a panel.
 * @param this {Mmenu}
 * @param panel {HTMLElement} The panel to initialise.
 */
const initPanel = function(
    this: Mmenu, 
    panel: HTMLElement
) {
    /** Options for the searchfield. */
    const options = this.opts.searchfield;

    //	Create the searchfield.
    if (panel.matches(options.addTo) ) {

        //  Only one per panel.
        if (!DOM.find(panel, '.mm-searchfield').length) {

            /** The searchform. */
            const form = createSearchfield.call(this);

            //  Add the form to the panel.
            panel.prepend(form);

            //  Initialize searching.
            initSearch.call(this, form);
        }
    }

    //	Create the splash content.
    if (options.splash.length &&
        panel.matches('.mm-panel--search')
    ) {
        
        //  Only one per panel.
        if (!DOM.find(panel, '.mm-panel__splash').length) {

            /** The splash content node. */
            const splash = DOM.create('div.mm-panel__splash');
            splash.innerHTML = this.i18n(options.splash);

            panel.append(splash);
        }
    }

    //  Add no results message.
    if (options.noResults.length) {

        //	Only once per panel.
        if (!DOM.find(panel, '.mm-panel__noresults').length) {
            
            /** The no results message node. */
            const message = DOM.create('div.mm-panel__noresults');
            message.innerHTML = this.i18n(options.noResults);
            
            panel.append(message);
        }
    }

};

/**
 * Create the searchfield.
 * @param this {Mmenu}
 */
const createSearchfield = function(this: Mmenu) {
    /** Options for the searchfield. */
    const options = this.opts.searchfield;
    
    /** Configs for the searchfield. */
    const configs = this.conf.searchfield;

     /** The form node. */
     const form = DOM.create('form.mm-searchfield');
 
     //	Add attributes to the form
     _addAttributes(form, configs.form);

     /** The fieldset node. */
     const field = DOM.create('div.mm-searchfield__input');
     form.append(field);

     
     /** The input node. */
     const input = DOM.create('input') as HTMLInputElement;
     field.append(input);
     
     //	Add attributes to the input
     input.type = 'text';
     input.autocomplete = 'off';
     input.placeholder = this.i18n(options.placeholder);
     input.setAttribute('aria-label', this.i18n(options.placeholder));
     _addAttributes(input, configs.input);
 
    //	Add a button to submit to the form.
    if (configs.submit) {

        /** The submit button. */
        const submit = DOM.create('button.mm-btnreset.mm-btn.mm-btn--next.mm-searchfield__btn') as HTMLButtonElement;
        submit.type = 'submit';

        field.append(submit);
    }

    //	Add a button to clear the searchfield.
    else if (configs.clear) {

        /** The reset button. */
        const reset = DOM.create('button.mm-btnreset.mm-btn.mm-btn--close.mm-searchfield__btn') as HTMLButtonElement;
        reset.type = 'reset';

        field.append(reset);

        //  Apparently, resetting a form doesn't trigger any event on the input,
        //  so we manually dispatch the event, one frame later :/
        form.addEventListener('reset', () => {
            window.requestAnimationFrame(() => {
                input.dispatchEvent(new Event('change'));
            });
        });
    }
 
     // Add a button to close the searchpanel.
     if ( configs.cancel ) {
 
         /** The cancel button. */
         const cancel = DOM.create('a.mm-searchfield__cancel') as HTMLAnchorElement;
         cancel.textContent = this.i18n('cancel');
 
         form.append(cancel);
 
         // Update the href attribute so it opens the last opened panel.
         this.bind('openPanel:before', panel => {
             if (!panel.matches('.mm-panel--search')) {
                 cancel.href = `#${panel.id}`;
             }
         });
     }

     return form;
};

/**
 * Initialize the searching.
 * @param this {Mmenu}
 * @param form {HTMLElement} The searchform.
 */
const initSearch = function (
    this: Mmenu, 
    form: HTMLElement
) {

    /** Options for the searchfield. */
    const options = this.opts.searchfield;

    /** The panel the results will be in. */
    const resultspanel = form.closest('.mm-panel') as HTMLElement || DOM.find(this.node.pnls, '.mm-panel--search')[0];

    /** The input node. */
    const input = DOM.find(form, 'input')[0] as HTMLInputElement;

    /** Where to search. */
    let searchIn = resultspanel.matches('.mm-panel--search') 
        ? DOM.find(this.node.pnls, options.searchIn)
        : [resultspanel];
    
    //  Filter out the resultspanel
    searchIn = searchIn.filter(panel => !panel.matches('.mm-panel--search'));

    /** Search */
    const search = () => {

        /** The searchquery */
        const query = input.value.toLowerCase().trim();
        
        /** All listitems */
        const listitems = [];

        searchIn.forEach(panel => {
            //  Scroll all panels to top.
            panel.scrollTop = 0;

            //  Find listitems.
            listitems.push(...DOM.find(panel, '.mm-listitem'));
        });

        //	Search
        if (query.length) {
            
            form.classList.add('mm-searchfield--searching');
            resultspanel.classList.add('mm-panel--searching');
            
            //	Add data attribute to the matching listitems.
            listitems.forEach((listitem) => {
                const text = DOM.children(listitem, '.mm-listitem__text')[0];
                if (!text || DOM.text(text).toLowerCase().indexOf(query) > -1) {
                    listitem.dataset.mmSearchresult = query;
                }
            });
            
            /** The number of matching results. */
            let count = 0;
            
            //  Resultspanel: Copy results to resultspanel.
            if (resultspanel.matches('.mm-panel--search') ) {
                count = _searchResultsPanel(resultspanel, query, searchIn);
                
                //  Search per panel: Hide the non-matching listitems.
            } else {
                count = _searchPerPanel(query, searchIn);
            }
            
            resultspanel.classList[count == 0 ? 'add' : 'remove' ]('mm-panel--noresults');

            // Dispatch searching event.
            input.dispatchEvent(new Event('mm.searching'));
            
        //  Don't search, reset all.
        } else {
            
            form.classList.remove('mm-searchfield--searching');
            resultspanel.classList.remove('mm-panel--searching');
            resultspanel.classList.remove('mm-panel--noresults');
            
            //  Resultspanel.
            if (resultspanel.matches('.mm-panel--search') ) {
                _resetResultsPanel(resultspanel);
                
                //  Searchfield outside of resultspanel.
                if (options.addTo !== '.mm-panel--search') {
                    //  Close the resultspanel if there is no splash page.
                    if (!options.splash.length) {
                        
                        this.closePanel(resultspanel);
                    }
                }
                
                //  Search per panel: Show all listitems and dividers.
            } else {
                _resetPerPanel(searchIn);
            }

            // Dispatch clearing event.
            input.dispatchEvent(new Event('mm.clearing'));
        }
    };

    input.addEventListener('input', search);
    input.addEventListener('change', search);
    search();
}

const _searchResultsPanel = (
    resultspanel: HTMLElement, 
    query: string, 
    searchIn: HTMLElement[]
) => {
    /** The listview for the results/ */
    const listview = DOM.find(resultspanel, '.mm-listview')[0];

    //  Clear listview.
    listview.innerHTML = '';

    /** Amount of resutls found. */
    let count = 0;

    searchIn.forEach((panel) => {
        /** The results in this panel. */
        const results = DOM.find(panel, `[data-mm-searchresult="${query}"]`);
        count += results.length;

        if (results.length) {
            /** Title for the panel. */
            const title = DOM.find(panel, '.mm-navbar__title')[0];
            
            //  Add a divider to indicate in what panel the results are.
            if (title) {
                const divider = DOM.create('li.mm-divider');
                divider.innerHTML = title.innerHTML;
                listview.append(divider);
            }

            //  Add the results
            results.forEach((result) => {
                listview.append(result.cloneNode(true) as HTMLElement);
            });
        }
    });

    return count;
}

const _resetResultsPanel = (
    resultspanel: HTMLElement
) => {
    /** The listview for the results. */
    const listview = DOM.find(resultspanel, '.mm-listview')[0];
                
    //  Clear listview.
    listview.innerHTML = '';
};

const _searchPerPanel = (
    query: string, 
    searchIn: HTMLElement[]
) => {
    /** Amount of resutls found. */
    let count = 0;

    searchIn.forEach((panel) => {
        /** The results in this panel. */
        const results = DOM.find(panel, `[data-mm-searchresult="${query}"]`);
        count += results.length;

        if (results.length) {
            
            //  Add first preceeding divider to the results.
            results.forEach(result => {
                const divider = DOM.prevAll(result, '.mm-divider')[0];
                if (divider) {
                    divider.dataset.mmSearchresult = query;
                }
            });

            //  TODO?
            //	Show parent panels of vertical submenus
            // panels.forEach((panel) => {
            //     let listitems = DOM.find(panel, '.mm-listitem');
            //     DOM.filterLI(listitems).forEach((listitem) => {
            //         DOM.parents(listitem, '.mm-listitem--vertical').forEach(
            //             (parent) => {
            //                 if (parent.matches('.mm-hidden')) {
            //                     parent.classList.remove('mm-hidden');
            //                     parent.classList.add(
            //                         'mm-listitem--onlysubitems'
            //                     );
            //                 }
            //             }
            //         );
            //     });
            // });

        }

        DOM.find(panel, '.mm-listitem, .mm-divider').forEach(item => {
            item.classList[ item.dataset.mmSearchresult === query ? 'remove' : 'add']('mm-hidden');
        });
    });

    return count;
}

const _resetPerPanel = (
    searchIn: HTMLElement[]
) => {
    searchIn.forEach((panel) => {
        DOM.find(panel, '.mm-listitem, .mm-divider').forEach(item => {
            item.classList.remove('mm-hidden');
        });
    });
};

/** 
 * Add array of attributes to an element.
 * @param element {HTMLEement} The element to add the attributes to.
 * @param attributes {Object} The attributes to add.
 */
    const _addAttributes = (
    element: HTMLElement,
    attributes: mmLooseObject | boolean
) => {
    if (attributes) {
        Object.keys(attributes).forEach(a => {
            element[a] = attributes[a];
        });
    }
};