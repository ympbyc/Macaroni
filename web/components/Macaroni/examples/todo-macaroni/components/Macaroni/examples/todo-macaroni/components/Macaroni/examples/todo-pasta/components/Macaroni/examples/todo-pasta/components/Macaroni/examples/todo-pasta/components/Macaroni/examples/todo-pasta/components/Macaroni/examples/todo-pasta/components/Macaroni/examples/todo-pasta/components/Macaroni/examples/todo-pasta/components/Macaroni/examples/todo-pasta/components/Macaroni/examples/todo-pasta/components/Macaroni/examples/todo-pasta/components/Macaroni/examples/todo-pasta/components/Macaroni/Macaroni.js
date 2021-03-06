/*
 * Macaroni.js
 *
 * Pasta Short-circuited
 *
 * 2013 Minori Yamashita <ympbyc@gmail.com>
 */
function Macaroni (initSt) {
    if (typeof WeakMap === "undefined")
        var WeakMap = function () {
            this.get = function (x) { return this[x]; };
            this.set = function (x, v) { this[x] = v; }; };

    var st = initSt || {},
        views = new WeakMap();

    var exported = _.module({}, on, view);

    function on (ev, containa, sel, f) {
        if (_.size(arguments) < 4)
            f = sel, sel = containa, containa = document;

        $(containa).on(ev, sel, function (e) {
            var changes = _.bind(f, this)(e);
            if (changes) st = _.merge(st, _.mapmap(changes, function (change, field) {
                var g = change[0], args = _.slice(change, 1), view = views.get(g);
                if (view && view[field])
                    _.apply(_.partial(view[field], st[field]), args);
                console.log(st[field])
                return _.apply(_.partial(g, st[field]), args);
            }));
        });
    }

    function view (scoreF, field, f) {
        views.set(scoreF, _.assoc((views.get(scoreF) || {}), field, f));
    }

    function shorthand (module, ev) {
        _.extend(module, _.object([[ev, _.partial(on, ev)]]));
    }

    _.each(['click', 'dblclick',
            'focus', 'focusin', 'focusout',
            'keydown', 'keypres', 'keyup',
            'load', 'ready',
            'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
            'resize', 'scroll', 'select', 'submit'], _.partial(shorthand, exported));

    return exported;
}



if (typeof module !== "undefined") module.exports = Macaroni;
else this.Macaroni = Macaroni;



/* //EXAMPLE
 *
 * with (Macaroni())
 *
 * (function () {
 *     //controller*model
 *     click(document, "#submit", function (e) {
 *         return { notes: _.concat('notes', {text: "hello"}) };
 *     });
 *
 *     //view*ui
 *     view(_.concat, function (arr, x) {
 *         $("#notes").append($("<div>").text(x.text));
 *     });
 * }());
 */
