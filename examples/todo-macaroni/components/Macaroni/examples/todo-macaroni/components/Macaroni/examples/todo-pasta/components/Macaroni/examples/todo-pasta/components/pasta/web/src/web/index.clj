(ns web.index
  (require [hiccup.core :as h]
           [hiccup.util :as hu])
  (:gen-class))

(def code-smallest-html (hu/escape-html "
<!doctype html>
<html>
<head>
    <mata charset=\"utf-8\">
    <script src=\"components/underscore/underscore.js\"></script>
    <script src=\"components/underscore-fix/underscore-fix.js\"></script>
    <script src=\"components/Pasta/Pasta.js\"></script>
    <script src=\"components/jquery/jquery.min.js\"></script>
</head>
<body>
    <h1 class=\"message\"></h1>
    <input type=\"text\" id=\"message-input\" />
    <button id=\"message-submit\">Change message</button>
</body>
"))

(def code-smallest-js "(function (window) {
    'use strict';

    /* Model is a collection of functions that are responsible for every data used in an app.
     * Each function takes the current state and returns a diff.
     */
    var Model = {
        change_message: function (state, msg) {
            return { message: 'You said ' + msg + '.'};
        }
    };

    /* View react to changes made to the state and redirects it to the UI */
    var View = {
        message: function (UI, state) {
            UI.render_message(state.message);
        }
    };

    /* UI touches the DOM */
    var UI = {
        render_message: function (msg) {
            $('.message').text(msg);
        }
    };

    /* Pasta the function composes everything and turn them into an application. */
    /* The function returns a function that is used to communicate with the app. */
    var pasta_signal = Pasta(Model, UI, View);

    /* Controllers use the signal function */
    $('#message-submit').click(pasta_signal('change_message', function (e) {
        return $('#message-input').val();
    }));
} (window));")

(def demo-smallest
  [:div#demo-smallest.demo
   [:strong.message "I said hello."]
   [:input#message-input {:type "text"}]
   [:button#message-submit.btn.btn-blue "Change message"]
   [:script code-smallest-js]])

(def code-model-js "
var Model = _.module(
    {},

    //add a new todo entry
    function add_todo (state, title) {
        //check that it's not empty before creating a new todo.
        var trimmed_title = title.trim();
        if (_.isEmpty(trimmed_title)) return {};
        return { todos: state.todos.concat({title: title, completed: false}) };
    },

    //mark a todo either active or complete
    function toggle_status (state, data) {
        return { todos: _.map(state.todos, function (todo) {
            if (todo === data.todo) return _.assoc(todo, 'completed', data.completed);
            return todo;
        }) };
    },

    //clear completed todos
    function clear_completed (state) {
        return { todos: _.reject(state.todos, _.flippar(_.at, 'completed')) };
    },

    function save_app (state) {
        localStorage.setItem('pasta-todo', JSON.stringify(state));
        return {};
    },

    function load_app (state) {
        return localStorage.getItem('pasta-todo')
            || { todos: [] };
    }
);
")

(def code-view-js "
var View = _.module(
    {},

    function todos (UI, state) {
        UI.render_todos(state.todos);
    }
);
")

(def code-ui-js "
var UI = _.module(
    {},

    function render_todos (todos) {
        $('#todos').html(_.template(TODOS_TEMPLATE, todos));
    }
)
")

(def code-controller-js "
$('#new-todo').keyup(function (e) {
    if (e.which === ENTER_KEY) {
        signal('add_todo')($(this).val());
    }
});

$('#clear-completed').click(signal('clear_completed'));
")

(def diagram "
                         <span class=\"yellow\">--------></span>
 User <span class=\"orange\"><--></span> UI <span class=\"orange\">--></span> Signal <span class=\"orange\">--------></span> Model
           <span class=\"orange\">^</span>                       <span class=\"yellow\">/</span> <span class=\"orange\">|</span>
           <span class=\"orange\">|</span>                      <span class=\"yellow\">/</span>  <span class=\"orange\">|</span>
           <span class=\"orange\">|</span>   <span class=\"yellow\">-----</span>  State <span class=\"yellow\"><-----</span>   <span class=\"orange\">|</span>
           <span class=\"orange\">|</span>  <span class=\"yellow\">/</span>                      <span class=\"orange\">|</span>
           <span class=\"orange\">|</span> <span class=\"yellow\">v</span>                       <span class=\"orange\">|</span>
          View <span class=\"orange\"><----------------------</span>


Flow of control: <span class=\"orange\">---------></span>
Flow of data:    <span class=\"yellow\">---------></span>
")

(defn html-head []
  [:head
   [:meta {:charset "utf-8"}]
   [:title "Pasta"]
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
   [:script {:src "components/Pasta/Pasta.js"}]])

(defn html-body []
  [:body {:onload "prettyPrint()"}
   [:header
    [:h1 "Pasta"]
    [:i "Meta Application"]]
   [:div#content
    [:section
     [:h2 "Not Your Daddy's MVC Framework"]
     [:p "In fact, Pasta isn't even a framework, nor a library but a single 35 line function. If you are familier with FP(Functional Programming), Pasta is a higher order function much like " [:span.code "fold"] " and " [:span.code "compose"] " . Just like " [:span.code "fold"] " abstracting the essence of recursion, Pasta abstracts the essence of entire JavaScript application. Just like " [:span.code "compose"] " taking functions to create a function, Patsa takes collections of functions to create an application. If frameworks are tools or guidelines to construct a building, " [:span.important "Pasta is a machine that builds the entire building according to the blueprint you feed it."]]]
    [:section
     [:h2 "Smallest Example"]
     [:p "Let me show you a tiny example. Just note it's a bit overkill to use Pasta for an app of this size."]
     [:pre.prettyprint
      code-smallest-html]
     [:p "Here you can see what Pasta depends on. " [:a {:href "http://underscorejs.org/"} "Underscore"] "(or lodash if you prefer), and " [:a {:href "https://github.com/ympbyc/underscore-fix"} "Underscore-fix"] ". jQuery is optional."]
     [:pre#code-smallest.prettyprint
      code-smallest-js]
     [:p "Here goes the live demo."]
     demo-smallest]
    [:section
     [:h2 "Pasta Is Simple"]
     [:p [:strong "Simple"] " in the sense Rich Hickey told us in his talk " [:a {:href "http://www.infoq.com/presentations/Simple-Made-Easy"} "Simple Made Easy"] ". Pasta lets you treat " [:span.important "data as data"] " and it turns " [:span.important "uncontrolled global state into a concrete first-class value"] ". Pasta is mostly functional. The model is a collection of pure functions. The application itself is a pure function that maps an application state to an UI state."]
     [:p "Pasta is simple because Pasta apps are not object oriented. Objects should be avoided where possible because they introduce implicit global state, makes it hard to inspect data (you know, \"" [:i "information hiding"] "\") and makes it so easy to corrupt data."]
     [:p "Pasta is simple because it doesn't do anything that it isn't supporsed to do. There are good data manipulation libraries already, namely Underscore (or lodash). There are good UI manipulation libraries already, namely jQuery (or Zepto). No point reinventing the wheel is there?"]]
    [:section
     [:h2 "MVC the Pasta way"]
     "With all that in mind, lets see how Pasta effectively forces presentation domain separation, by looking at the classic TodoMVC example. The full source is available " [:a {:href "https://github.com/ympbyc/Pasta/tree/master/examples/todo-pasta"} "here"] "."
     [:section
      [:h3 "Model"]
      [:pre.prettyprint code-model-js]
      [:p "The Model is a hashmap mapping signal names to binary functions. " [:span.code "_.module()"] " provides a nice way to write hashmap-of-functions prettily. Each function receives the current state as its first argument. The second is whatever is passed in via a signal which we will come to later. The state is just a plain hashmap which you mustn't mutate yourself. The role of each function is to return a patch. Patches are, again, just a plain hashmap."]
      [:p "Since it is advised to prefer primitive types over user-defined objects, we can do some crazy stuff like serializing it into JSON and save somewhere and recover it later. Because the state passed is a immutable value, we can store it into the state itself, meaning implementing a full `undo` functionality is easy peasy."]]
     [:section
      [:h3 "View"]
      [:pre.prettyprint code-view-js]
      [:p "The view is a hashmap mapping field names of the state to ternary functions. Each function gets called whenever the field that the function is responsible for. The first argument is the UI module which we will see next. The second is the new state after the change. The last argument is the value of the field before the change. The role of each function is to call functions (uh, ahem) subroutines in the UI module. Although the functions receive the state, mutating it is no use since it is a fresh copy. Don't try."]]
     [:section
      [:h3 "UI"]
      [:pre.prettyprint code-ui-js]
      [:p "No description is needed for the UI module because it isn't really a part of Pasta. Pasta does not care how you manage the UI, making Pasta portable accross different platforms. In fact Pasta initily targeted Titanium Mobile as a platform and it probably runs still."]]
     [:section
      [:h3 "Generation of An App"]
      [:pre.prettyprint "var pasta_signal = Pasta(Model, UI, View);"]
      [:p "Throw all of the above three modules at " [:span.code "Pasta"] " to generate the app. " [:span.code "Pasta"] " leaves a function behind which is the only one connection we have to the running app. We will make heavy use of this function in controllers."]]
     [:section
      [:h3 "Controller"]
      [:pre.prettyprint code-controller-js]
      [:p "Controllers are not grouped into a module because there's no need to. Controllers can be anything that " [:span.code "signal"] "s. A signal invokes a model function and whatever you feed to " [:span.code "signal"] " becomes the second argumentof the functions in the model."]]]
    [:section
     [:h2 "A Diagram"]
     [:pre.tough
      diagram]]]])

(defn main-html []
  (h/html
   [:html
    (html-head)
    (html-body)]))
