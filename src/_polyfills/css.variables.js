/*!
 * css-var-polyfill.js - v1.1.2
 *
 * Copyright (c) 2019 Aaron Barker <http://aaronbarker.net>
 * Released under the MIT license
 *
 * Date: 2019-03-23
 */
let cssVarPoly = {
    init: function() {
        // first lets see if the browser supports CSS variables
        // No version of IE supports window.CSS.supports, so if that isn't supported in the first place we know CSS variables is not supported
        // Edge supports supports, so check for actual variable support
        if (
            window.CSS &&
            window.CSS.supports &&
            window.CSS.supports('(--foo: red)')
        ) {
            // this browser does support variables, abort
            return;
        }

        cssVarPoly.ratifiedVars = {};
        cssVarPoly.varsByBlock = {};
        cssVarPoly.oldCSS = {};

        // start things off
        cssVarPoly.findCSS();
        cssVarPoly.updateCSS();
    },

    // find all the css blocks, save off the content, and look for variables
    findCSS: function() {
        let styleBlocks = document.querySelectorAll(
            'style:not(.inserted),link[rel="stylesheet"],link[rel="import"]'
        );

        // we need to track the order of the style/link elements when we save off the CSS, set a counter
        let counter = 1;

        // loop through all CSS blocks looking for CSS variables being set
        [].forEach.call(styleBlocks, function(block) {
            // console.log(block.nodeName);
            let theCSS;
            if (block.nodeName === 'STYLE') {
                // console.log("style");
                theCSS = block.innerHTML;
                cssVarPoly.findSetters(theCSS, counter);
            } else if (block.nodeName === 'LINK') {
                // console.log("link");
                cssVarPoly.getLink(
                    block.getAttribute('href'),
                    counter,
                    function(counter, request) {
                        cssVarPoly.findSetters(request.responseText, counter);
                        cssVarPoly.oldCSS[counter] = request.responseText;
                        cssVarPoly.updateCSS();
                    }
                );
                theCSS = '';
            }
            // save off the CSS to parse through again later. the value may be empty for links that are waiting for their ajax return, but this will maintain the order
            cssVarPoly.oldCSS[counter] = theCSS;
            counter++;
        });
    },

    // find all the "--variable: value" matches in a provided block of CSS and add them to the master list
    findSetters: function(theCSS, counter) {
        // console.log(theCSS);
        cssVarPoly.varsByBlock[counter] =
            theCSS.match(/(--[^:)]+:[\s]*[^;}]+)/g) || [];
    },

    // run through all the CSS blocks to update the variables and then inject on the page
    updateCSS: function() {
        // first lets loop through all the variables to make sure later vars trump earlier vars
        cssVarPoly.ratifySetters(cssVarPoly.varsByBlock);

        // loop through the css blocks (styles and links)
        for (let curCSSID in cssVarPoly.oldCSS) {
            // console.log("curCSS:", cssVarPoly.oldCSS[curCSSID]);
            let newCSS = cssVarPoly.replaceGetters(
                cssVarPoly.oldCSS[curCSSID],
                cssVarPoly.ratifiedVars
            );
            // put it back into the page
            // first check to see if this block exists already
            if (document.querySelector('#inserted' + curCSSID)) {
                // console.log("updating")
                document.querySelector(
                    '#inserted' + curCSSID
                ).innerHTML = newCSS;
            } else {
                // console.log("adding");
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = newCSS;
                style.classList.add('inserted');
                style.id = 'inserted' + curCSSID;
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }
    },

    // parse a provided block of CSS looking for a provided list of variables and replace the --var-name with the correct value
    replaceGetters: function(curCSS, varList) {
        // console.log(varList);
        for (let theVar in varList) {
            // console.log(theVar);
            // match the variable with the actual variable name
            let getterRegex = new RegExp(
                'var\\(\\s*' + theVar + '\\s*\\)',
                'g'
            );
            // console.log(getterRegex);
            // console.log(curCSS);
            curCSS = curCSS.replace(getterRegex, varList[theVar]);

            // now check for any getters that are left that have fallbacks
            let getterRegex2 = new RegExp(
                'var\\([^\\)]+,\\s*([^\\)]+)\\)',
                'g'
            );
            // console.log(getterRegex);
            // console.log(curCSS);
            let matches = curCSS.match(getterRegex2);
            if (matches) {
                // console.log("matches",matches);
                matches.forEach(function(match) {
                    // console.log(match.match(/var\(.+,\s*(.+)\)/))
                    // find the fallback within the getter
                    curCSS = curCSS.replace(
                        match,
                        match.match(/var\([^\)]+,\s*([^\)]+)\)/)[1]
                    );
                });
            }

            // curCSS = curCSS.replace(getterRegex2,varList[theVar]);
        }
        // console.log(curCSS);
        return curCSS;
    },

    // determine the css variable name value pair and track the latest
    ratifySetters: function(varList) {
        // console.log("varList:",varList);
        // loop through each block in order, to maintain order specificity
        for (let curBlock in varList) {
            let curVars = varList[curBlock];
            // console.log("curVars:",curVars);
            // loop through each var in the block
            curVars.forEach(function(theVar) {
                // console.log(theVar);
                // split on the name value pair separator
                let matches = theVar.split(/:\s*/);
                // console.log(matches);
                // put it in an object based on the varName. Each time we do this it will override a previous use and so will always have the last set be the winner
                // 0 = the name, 1 = the value, strip off the ; if it is there
                cssVarPoly.ratifiedVars[matches[0]] = matches[1].replace(
                    /;/,
                    ''
                );
            });
        }
        // console.log(cssVarPoly.ratifiedVars);
    },

    // get the CSS file (same domain for now)
    getLink: function(url, counter, success) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.overrideMimeType('text/css;');
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                // console.log(request.responseText);
                if (typeof success === 'function') {
                    success(counter, request);
                }
            } else {
                // We reached our target server, but it returned an error
                console.warn('an error was returned from:', url);
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            console.warn('we could not get anything from:', url);
        };

        request.send();
    }
};

cssVarPoly.init();
