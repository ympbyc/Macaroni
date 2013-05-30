(function (window) {
    'use strict';

    var ENTER_KEY = 13;
    var TODO_TEMPLATE = $("#todo-template").html();
    var M = Macaroni({todos: []});

    function todo (title, completed) {
        return { title:     title,
                 completed: completed || false };
    }

    /* Controller*Model */

    M.keyup("#new-todo", function (e) {
        if (e.which !== ENTER_KEY) return {};

        var title = $(e.target).val();
        var trimmed_title = title.trim();

        $(e.target).val("");

        if (_.isEmpty(trimmed_title)) return {};

        return { todos: [_.concat, todo(title)] };
    });

    M.click("#clear-completed", function () {
        return { todos: [_.reject, _.flippar(_.at, "completed")] };
    });

    M.click("#toggle-all", function (e) {
        var stat = $(e.target).is(":checked");
        return { todos: [_.map, _.flippar(_.conj, {completed: stat})] };
    });


    /* View*UI */

    M.view(_.concat, "todos", function (todos, todo) {
        console.log(todos);
        $("<div>").html(_.template(TODO_TEMPLATE, todo))
            .find("li")
            .appendTo("#todo-list");
    });

}(window));
