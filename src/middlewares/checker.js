import { ADD_TODO } from "../actions/todos";
import { ADD_GOAL } from "../actions/goals";

function checker(store) {
  return function (next) {
    return function (action) {
      if (
        action.type === ADD_TODO &&
        action.todo.name.toLowerCase().includes("bitcoin")
      ) {
        alert("That is a bad idea");
      } else if (
        action.type === ADD_GOAL &&
        action.goal.name.toLowerCase().includes("bitcoin")
      ) {
        alert("That is a bad idea");
      } else {
        return next(action);
      }
    };
  };
}

export default checker;
