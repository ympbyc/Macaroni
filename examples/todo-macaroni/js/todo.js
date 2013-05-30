(function (window) {
    'use strict';

    var ENTER_KEY = 13;
    var TODO_TEMPLATE = $("#todo-template").html();
    var M = Macaroni(JSON.parse(localStorage.getItem("macaroni-todo"))
                     || {todos: [], id:0, show_mode: "show_all"});



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
        return { show_mode: [change_mode, route] };
    });






    /* View*UI */

    M.before(_.concat, "todos", function (todos, todo) {
        render_todo(todo);
    });





    M.after("todos", function (st) {
        update_footer(st.todos);
        localStorage.setItem("macaroni-todo", JSON.stringify(st));
    });





    M.before(_.reject, "todos", function (todos, f) {
        _.each(todos, function (todo) {
            if (f(todo))
                $("#todo-list [data-id="+ todo.id + "]").remove();
        });
    });






    M.before(update, "todos", function (todos, id, patcher) {
        var todo = patcher(_.find(todos, function (td) { return td.id === id; }));
        var $el = $("#todo-list [data-id=" + id + "]")
                .html(_.template(TODO_TEMPLATE, todo));
    });






    M.before(toggle_complete, "todos", function (todos, id, bool) {
        var $el = $("#todo-list [data-id=" + id + "]");
        if (bool)
            $el.addClass("completed");
        else $el.removeClass("completed");
    });






    M.after("show_mode", function (st, old_mode) {
        $("#todo-list").html("");
        _.each(_.filter(st.todos, filters[st.show_mode]), function (todo) {
            render_todo(todo);
        });
        $("#" + old_mode).removeClass("selected");
        $("#" + st.show_mode).addClass("selected");
    });






    function render_todo (todo) {
        $("<li>").addClass(todo.completed ? "completed" : "")
            .attr("data-id", todo.id)
            .html(_.template(TODO_TEMPLATE, todo))
            .appendTo("#todo-list");
    }






    function change_mode (st, mode) {
        return mode;
    }






    //adjust numbers
    function update_footer (todos) {
        var nums = _.countBy(todos, function (todo) {
            return todo.completed ? "completed" : "active";
        });
        $("#todo-count strong").text(nums.active || 0);
        if (nums.completed)
            $("#clear-completed").show().text("Clear completed (" + nums.completed + ")");
        else
            $("#clear-completed").hide();
    }






    var filters = {
        "show_all":      function (x) { return true; },
        "show_active":   function (x) { return ! x.completed; },
        "show_complete": function (x) { return x.completed; }
    };





    /* Router */
    Router({
        "/":          function () { $(document).trigger("routechange", ["show_all"]); },
        "/active":    function () { $(document).trigger("routechange", ["show_active"]); },
        "/completed": function () { $(document).trigger("routechange", ["show_complete"]); }
    }).init();

}(window));
