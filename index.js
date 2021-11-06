// helper functions
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// app code

// actions
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

// action creators

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}
function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}
function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}
function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}
function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  };
}

function handleDeleteTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id));
    API.deleteTodo(todo.id).catch((e) => {
      dispatch(addTodoAction(todo));
      alert("An Error occurred, Please try again");
    });
  };
}

function handleAddTodo(name, cb) {
  return (dispatch) => {
    API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo));
        cb();
      })
      .catch((e) => {
        alert("An Error occurred, please try again");
      });
  };
}

function handleAddGoal(name, cb) {
  return (dispatch) => {
    API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoalAction(goal));
        cb();
      })
      .catch((e) => alert("An Error occurred, please try again"));
  };
}

function handleDeleteGoal(goal) {
  return (dispatch) => {
    dispatch(removeGoalAction(goal.id));
    API.deleteGoal(goal.id).catch((e) => {
      dispatch(addGoalAction(goal));
      alert("An Error occurred, Please try again");
    });
  };
}

function handleToggleTodo(id) {
  return (dispatch) => {
    dispatch(toggleTodoAction(id));
    API.saveTodoToggle(id).catch((e) => {
      dispatch(toggleTodoAction(id));
      alert("An Error occurred, Please try again");
    });
  };
}

function handleInitialData() {
  return (dispatch) => {
    const { fetchTodos, fetchGoals } = API;
    Promise.all([fetchTodos(), fetchGoals()]).then(([todos, goals]) => {
      dispatch(receiveDataAction(todos, goals));
    });
  };
}
// reducers
function todos(state = [], action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.todos;
    case ADD_TODO:
      return state.concat(action.todo);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id ? todo : { ...todo, done: !todo.done }
      );
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.goals;
    case ADD_GOAL:
      return state.concat(action.goal);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// Middleware
function checker(store) {
  return function (next) {
    return function (action) {
      if (
        action.type === ADD_TODO &&
        action.todo.text.toLowerCase().includes("bitcoin")
      ) {
        alert("That is a bad idea");
      } else if (
        action.type === ADD_GOAL &&
        action.goal.text.toLowerCase().includes("bitcoin")
      ) {
        alert("That is a bad idea");
      } else {
        return next(action);
      }
    };
  };
}

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log(action);
  const result = next(action);
  console.log(store.getState());
  console.groupEnd();
  return result;
};

const store = Redux.createStore(
  Redux.combineReducers({ todos, goals, loading }),
  Redux.applyMiddleware(ReduxThunk.default, checker, logger)
);
store.subscribe(() => console.log(`the new state is`, store.getState()));
