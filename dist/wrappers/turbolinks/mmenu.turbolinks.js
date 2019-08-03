export default function () {
    var classnames;
    var grep = function (items, callback) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (callback(item)) {
                filtered.push(item);
            }
        }
        return filtered;
    };
    document.addEventListener('turbolinks:before-visit', function (evnt) {
        classnames = document.documentElement.className;
        classnames = grep(classnames.split(' '), function (name) {
            return !/mm-/.test(name);
        }).join(' ');
    });
    document.addEventListener('turbolinks:load', function (evnt) {
        if (typeof classnames === 'undefined') {
            return;
        }
        document.documentElement.className = classnames;
    });
}
;
