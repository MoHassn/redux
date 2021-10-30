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

// reducers
function todos(state = [], action) {
  switch (action.type) {
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
    case ADD_GOAL:
      return state.concat(action.goal);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

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
        next(action);
      }
    };
  };
}

const store = Redux.createStore(
  Redux.combineReducers({ todos, goals }),
  Redux.applyMiddleware(checker)
);
store.subscribe(() => console.log(`the new state is`, store.getState()));
store.subscribe(() => {
  const { todos, goals } = store.getState();

  // clear the DOM
  document.getElementById("todos").innerHTML = "";
  document.getElementById("goals").innerHTML = "";

  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
});

// DOM code
function addTodo() {
  const input = document.getElementById("todo");
  const text = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      id: generateId(),
      done: false,
      text,
    })
  );
}
function addGoal() {
  const input = document.getElementById("goal");
  const text = input.value;
  input.value = "";

  store.dispatch(
    addGoalAction({
      id: generateId(),
      text,
    })
  );
}

document.getElementById("todoBtn").addEventListener("click", addTodo);

document.getElementById("goalBtn").addEventListener("click", addGoal);

function createRemoveButton(onClickHandler) {
  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click", onClickHandler);
  return button;
}

function addTodoToDOM(todo) {
  const node = document.createElement("li");
  node.innerText = todo.text;
  if (todo.done) {
    node.classList.add("done");
  }

  const removeButton = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });
  node.addEventListener("click", (e) => {
    store.dispatch(toggleTodoAction(todo.id));
  });
  node.appendChild(removeButton);
  document.getElementById("todos").appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement("li");
  node.innerText = goal.text;
  const removeButton = createRemoveButton(() =>
    store.dispatch(removeGoalAction(goal.id))
  );
  node.appendChild(removeButton);
  document.getElementById("goals").appendChild(node);
}
