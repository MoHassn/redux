import API from "goals-todos-api";

export const ADD_GOAL = "ADD_GOAL";
export const REMOVE_GOAL = "REMOVE_GOAL";

function addGoal(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}
function removeGoal(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

export function handleAddGoal(name, cb) {
  return (dispatch) => {
    API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoal(goal));
        cb();
      })
      .catch((e) => alert("An Error occurred, please try again"));
  };
}

export function handleDeleteGoal(goal) {
  return (dispatch) => {
    dispatch(removeGoal(goal.id));
    API.deleteGoal(goal.id).catch((e) => {
      dispatch(addGoal(goal));
      alert("An Error occurred, Please try again");
    });
  };
}
