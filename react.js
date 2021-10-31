class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { store } = this.props;
    const { todos, goals } = store.getState();
    return (
      <div>
        {console.log("renders")}
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
    const text = this.input.value;
    this.input.value = "";
    console.log("input", this.input);
    this.props.store.dispatch(
      addTodoAction({
        id: generateId(),
        done: false,
        text,
      })
    );
  };

  removeItem = (todo) => this.props.store.dispatch(removeTodoAction(todo.id));

  toggleItem = (todo) => this.props.store.dispatch(toggleTodoAction(todo.id));

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
    const text = this.input.value;
    this.input.value = "";

    this.props.store.dispatch(
      addGoalAction({
        id: generateId(),
        text,
      })
    );
  };

  removeItem = (goal) => this.props.store.dispatch(removeGoalAction(goal.id));

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
