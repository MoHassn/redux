import API from "goals-todos-api";

export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";

function addTodo(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}
function removeTodo(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}
function toggleTodo(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

export function handleDeleteTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodo(todo.id));
    API.deleteTodo(todo.id).catch((e) => {
      dispatch(addTodo(todo));
      alert("An Error occurred, Please try again");
    });
  };
}

export function handleAddTodo(name, cb) {
  return (dispatch) => {
    API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodo(todo));
        cb();
      })
      .catch((e) => {
        alert("An Error occurred, please try again");
        console.log(e);
      });
  };
}

export function handleToggleTodo(id) {
  return (dispatch) => {
    dispatch(toggleTodo(id));
    API.saveTodoToggle(id).catch((e) => {
      dispatch(toggleTodo(id));
      alert("An Error occurred, Please try again");
    });
  };
}
