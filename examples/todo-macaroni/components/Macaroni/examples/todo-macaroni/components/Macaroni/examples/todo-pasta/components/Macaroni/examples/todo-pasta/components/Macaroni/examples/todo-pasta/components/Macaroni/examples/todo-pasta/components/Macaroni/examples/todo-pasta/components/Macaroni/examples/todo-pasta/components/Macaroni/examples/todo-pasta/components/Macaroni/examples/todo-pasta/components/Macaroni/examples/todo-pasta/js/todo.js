(function (window) {
    'use strict';

    var ENTER_KEY = 13;
    var TODO_TEMPLATE = $("#todo-template").html();
    var M = Macaroni({todos: [], id:0});

    function todo (id, title, completed) {
        return { title:     title,
                 completed: completed || false };
    }

    /* Controller*Model */

    M.keyup("#new-todo", function (e, st) {
        if (e.which !== ENTER_KEY) return {};

        var title = $(e.target).val();
        var trimmed_title = title.trim();

        $(e.target).val("");

        if (_.isEmpty(trimmed_title)) return {};

        return { todos:  [_.concat, todo(st.id + 1, title)],
                 id:     [_["+"], 1] };
    });



    M.click("#clear-completed", function () {
        return { todos: [_.reject, _.flippar(_.at, "completed")] };
    });



    M.click("#toggle-all", function (e) {
        var stat = $(e.target).is(":checked");
        return { todos: [_.just_map, _.flippar(_.conj, {completed: stat})] };
    });



    M.dblclick("#todo-list", "label", function (e) {
        $(e.target).parents("li")
            .addClass("editing")
            .find(".edit").focus();
    });



    M.keyup("#todo-list", ".edit", function (e) {
        if (e.which !== ENTER_KEY) return {};

        var edit = $(e.target).parents("li").removeClass("editing").find(".edit"),
            title = edit.val(),
            id    = parseInt(edit.attr("data-id"));
        if (_.isEmpty(title.trim()))
            return { todos: [_.reject, function (x) { return x.id === id; }] };
        return { todos: [update, _.flippar(_.conj, {title: title})] };
    });



    M.on("blur", "#todo-list", ".edit", function () {
        //to implement
    });



    M.click("#todo-list", ".toggle", function (e) {
        return { update: _.flippar(_.conj, {completed: $(e.target).is(":checked")}) };
    });



    M.click("#todo-list", ".destroy", function (e) {
        var id = parseInt($(e.target).parents("li").removeClass("editing").find(".edit").attr("data-id"));

        return { todos: [_.reject, function (x) { return x.id === id; }] };
    });





    /* View*UI */

    M.view(_.concat, "todos", function (todos, todo) {
        console.log(todo);
        $("<div>").html(_.template(TODO_TEMPLATE, todo))
            .find("li")
            .appendTo("#todo-list");
    });


    M.view(_.reject, "todos", function (todos, f) {
        _.each(todos, function (todo) {
            if (f(todo))
                $("#todo-list [data-id="+ todo.id + "]").remove();
        });
    });


    function update (xs, id, f) {
        return _.just_map(xs, function (x) {
            if (x.id === id) return f(x);
            return x;
        });
    }

}(window));
