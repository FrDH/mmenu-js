Mmenu.wrappers.turbolinks = function () {
    var classnames, html;
    Mmenu.$(document)
        //	Store the HTML classnames onDocumentReady
        .on('turbolinks:before-visit', function () {
        html = document.documentElement;
        classnames = html.getAttribute('class');
        classnames = Mmenu.$.grep(classnames.split(/\s+/), function (name) {
            return !/mm-/.test(name);
        }).join(' ');
    })
        //	Reset the HTML classnames when changing pages
        .on('turbolinks:load', function () {
        if (typeof html === 'undefined') {
            return;
        }
        html.setAttribute('class', classnames);
    });
};
