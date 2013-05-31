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
    if (typeof Object.freeze === "undefined")
        Object.freeze = _.identity;

    var st     = Object.freeze(initSt || {}),
        views  = new WeakMap(),
        views2 = new WeakMap();

    var exported = _.module({}, on, before, after);

    function on (ev, containa, sel, f) {
        if (_.size(arguments) < 4)
            f = sel, sel = containa, containa = document;

        $(containa).on(ev, sel, _.optarg(function (es) {
            var changes = _.apply(f, es.concat(st), this);
            if (changes) st = _.merge(st, _.mapmap(changes, function (change, field) {
                var g = change[0], args = _.slice(change, 1), view = views.get(g);
                if (view && view[field])
                    _.apply(_.partial(view[field], st[field]), args);
                var v = _.apply(_.partial(g, st[field]), args);
                if (_.isObject(v)) Object.freeze(v);
                if (views2[field])
                    views2[field](_.assoc(st, field, v), st[field]);
                return v;
            }));
            Object.freeze(st);
        }));
    }

    function before (scoreF, field, f) {
        views.set(scoreF, _.assoc((views.get(scoreF) || {}), field, f));
    }

    function after (field, f) {
        views2.set(field, f);
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
