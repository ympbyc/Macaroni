(function (window) {
    'use strict';

    var ENTER_KEY = 13;
    var TODO_TEMPLATE = $("#todo-template").html();
    var M = Macaroni({todos: [], id:0, show_mode: "show_all"});

    function todo (id, title, completed) {
        return { title:     title,
                 completed: completed || false,
                 id: id };
    }

    function update (xs, id, f) {
        return _.just_map(xs, function (x) {
            if (x.id === id) return f(x);
            return x;
        });
    }

    function toggle_complete (xs, id, bool) {
        return update(xs, id, _.flippar(_.conj, {completed: bool}));
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
        return { todos: [update, id, _.flippar(_.conj, {title: title})] };
    });



    M.on("blur", "#todo-list", ".edit", function () {
        //to implement
    });



    M.click("#todo-list", ".toggle", function (e, st) {
        var id = parseInt($(e.target).parents("li").find(".edit").attr("data-id"));
        return { todos: [toggle_complete, id, $(e.target).is(":checked")] };
    });



    M.click("#todo-list", ".destroy", function (e) {
        var id = parseInt($(e.target).parents("li").removeClass("editing").find(".edit").attr("data-id"));

        return { todos: [_.reject, function (x) { return x.id === id; }] };
    });



    M.on("routechange", document, function (e, route) {
        console.log(route);
    });



    /* View*UI */

    M.view(_.concat, "todos", function (todos, todo) {
        console.log(todo);
        $("<li>").addClass(todo.completed ? "completed" : "")
            .attr("data-id", todo.id)
            .html(_.template(TODO_TEMPLATE, todo))
            .appendTo("#todo-list");
    });



    M.view(_.reject, "todos", function (todos, f) {
        _.each(todos, function (todo) {
            if (f(todo))
                $("#todo-list [data-id="+ todo.id + "]").remove();
        });
    });



    M.view(update, "todos", function (todos, id, patcher) {
        var todo = patcher(_.find(todos, function (td) { return td.id === id; }));
        var $el = $("#todo-list [data-id=" + id + "]")
                .html(_.template(TODO_TEMPLATE, todo));
    });


    M.view(toggle_complete, "todos", function (todos, id, bool) {
        var $el = $("#todo-list [data-id=" + id + "]");
        if (bool)
            $el.addClass("completed");
        else $el.removeClass("completed");
    });


    /* Router */
    Router({
        "/":          function () { $(document).trigger("routechange", ["/"]); },
        "/active":    function () { $(document).trigger("routechange", ["/active"]); },
        "/completed": function () { $(document).trigger("routechange", ["/completed"]); }
    }).init();

}(window));
