class App extends React.Component {
  async componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => this.forceUpdate());
    const { fetchTodos, fetchGoals } = API;
    Promise.all([fetchTodos(), fetchGoals()]).then(([todos, goals]) => {
      this.props.store.dispatch(receiveDataAction(todos, goals));
    });
  }

  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();

    if (loading === true) {
      return <h3>Loading Data</h3>;
    }
    return (
      <div>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
  }
}
function List({ items, remove, toggle }) {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <span
              onClick={() => (toggle ? toggle(item) : null)}
              style={{ textDecoration: item.done ? "line-through" : "none" }}
            >
              {item.text}
            </span>
            <button onClick={(e) => remove(item)}>X</button>
          </li>
        );
      })}
    </ul>
  );
}
class Todos extends React.Component {
  addTodo = (e) => {
    e.preventDefault();
    const text = this.input.value;

    API.saveTodo(text)
      .then((todo) => {
        this.props.store.dispatch(addTodoAction(todo));
        this.input.value = "";
      })
      .catch((e) => alert("An Error occurred, please try again"));
  };

  removeItem = (todo) => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (todo) => {
    this.props.store.dispatch(toggleTodoAction(todo.id));
    API.saveTodoToggle(todo.id).catch((e) => {
      this.props.store.dispatch(toggleTodoAction(todo.id));
      alert("An Error occurred, Please try again");
    });
  };

  render() {
    return (
      <div>
        <h1>Todos</h1>
        <input
          type="text"
          placeholder="Enter Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addTodo}>Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}

class Goals extends React.Component {
  addGoal = (e) => {
    e.preventDefault();
    const text = this.input.value;
    API.saveGoal(text)
      .then((goal) => {
        this.props.store.dispatch(addGoalAction(goal));
        this.input.value = "";
      })
      .catch((e) => alert("An Error occurred, please try again"));
  };

  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
    API.deleteGoal(goal.id).catch((e) => {
      this.props.store.dispatch(addGoalAction(goal));
      alert("An Error occurred, Please try again");
    });
  };

  render() {
    return (
      <div>
        <h1>Goals</h1>
        <input
          type="text"
          placeholder="Enter Goal"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addGoal}>Add Goal</button>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

ReactDOM.render(<App store={store} />, document.getElementById("app"));
