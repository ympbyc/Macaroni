(ns web.index
  (require [hiccup.core :as h]
           [hiccup.util :as hu])
  (:gen-class))

(def sample-js "
var M = Macaroni({ todos: [] });



M.keyup('#new-todo', function (e) {
    if (e.which !== 13) return;

    var title = e.target.value;
    return { todos: [_.concat, {title: title, completed: false}] }
});



M.before(_.concat, 'todos', function (todos, todo) {
    $('#new-todo').val('');
    $('<li>').text(todo.title)
             .appendTo('#todo-list');
});



M.after('todos', function (state) {
    $('#todo-count').text(_.size(state.todos));
});
")

(def on-sample "
M.on('click', '#new-todo', function (e) {
     //       field: [function, arguments]
     return { todos: [_.concat, 'Say hello'] };
});
")

(def before-sample "
M.before(_.concat, 'todos', function (todos, todo) {
     //do something with todo
});
")

(def after-sample "
M.after('todos', function (state, old_todo) {
     //do something with new state
});
")

(def menu
  [:div#menu])

(defn html-head []
  [:head
   [:meta {:charset "utf-8"}]
   [:title "Macaroni"]
   [:link {:rel  "stylesheet"
           :href "components/kraken/kraken.css"}]
   [:link {:rel "stylesheet"
           :href "components/google-code-prettify/prettify.css"}]
   [:link {:rel  "stylesheet"
           :href "css/style.css"}]
   [:script {:src "components/jquery/jquery.min.js"}]
   [:script {:src "components/google-code-prettify/prettify.js"}]
   [:script {:src "components/underscore/underscore-min.js"}]
   [:script {:src "components/underscore-fix/underscore-fix.js"}]
   [:script {:src "components/Macaroni/Macaroni.js"}]])

(defn html-body []
  [:body {:onload "prettyPrint()"}
   [:header
    [:h1 "Macaroni"]
    [:i "Pasta Short-circuited"]
    menu]
   [:div#content
    [:section
     [:pre.prettyprint (hu/escape-html sample-js)]
     [:div.demo
      [:input#new-todo {:placeholder "What needs to be done?"}]
      [:ul#todo-list]
      [:script sample-js]]]
    [:section
     [:h2 "API"]
     [:section
       [:h3 "Macaroni"]
       [:div.type [:span.grey "Macaroni :: {} -> Macaroni"]]
       [:pre.prettyprint "var M = Macaroni({ todos: [] });"]]
      [:section
       [:h3 "on"]
       [:div.type
        [:span.grey "on :: String * jQuerySelector * jQuerySelector * (Event -> {[]}) -> undefined"] [:br]
        [:span.grey "on :: String * jQuerySelector * (Event -> {[]}) -> undefined"]]
       [:pre.prettyprint on-sample]]
      [:section
       [:h3 "before"]
       [:div.type
        [:span.grey "before :: Function * String * Function -> undefined"]]
       [:pre.prettyprint before-sample]]
      [:section
       [:h3 "after"]
       [:div.type
        [:span.grey "after :: String * ({} * {} -> a) -> undefined"]]
       [:pre.prettyprint after-sample]]]]])

(defn main-html []
  (h/html
   [:html
    (html-head)
    (html-body)]))
