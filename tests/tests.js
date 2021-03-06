var se = strictEqual,
    de = deepEqual;

module("pasta");

(function () {

    var P = Macaroni({ notes: ["aaa", "bbb"] });

    P.on('click', document, "#add-note", function (e) {
        test("on", function () {
            se(_.isFunction(e.preventDefault), true, "has access to event object");
        });
        return { notes: [_.concat, "ccc"] };
    });

    P.click("#test-notes", function (e) {
        test("shorthand", function () {
            se(1,1, "shorthand listener works");
        });
        return { notes: [_.identity, "notes"] };
    });

    P.click('body', ".note", function (e, ___) {
        test("live", function () {
            se(1,1, "listeners are live");
        });
    });

    P.before(_.concat, 'notes', function (coll, x) {
        test("before", function () {
            de(coll, ["aaa", "bbb"], "state value is passed in");
            se(x, "ccc", "argument is passed in");
        });
        $('<div class="note">').text(x.text).appendTo("body");
    });

    P.after("notes", _.once(function (st, old_val) {
        test("after", function () {
            de(st.notes, ["aaa", "bbb", "ccc"], "after receives modified state");
            de(old_val, ["aaa", "bbb"], "after receives old value");
        });
    }));

    P.before(_.identity, 'notes', function (coll) {
        test("state", function () {
            de(coll, ["aaa", "bbb", "ccc"], "note successfully appended");
        });
    });

    $("#add-note").click();
    setTimeout(function () {
        $("#test-notes").click();
        $(".note").eq(0).click();
    }, 100);
}());
