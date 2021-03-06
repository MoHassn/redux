import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from "../actions/todos";
import { RECEIVE_DATA } from "../actions/shared";

export function todos(state = [], action) {
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
