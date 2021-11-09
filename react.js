class App extends React.Component {
  async componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => this.forceUpdate());

    store.dispatch(handleInitialData());
  }

  render() {
    const { store } = this.props;
    const { loading } = store.getState();

    if (loading === true) {
      return <h3>Loading Data</h3>;
    }
    return (
      <div>
        <TodosContainer />
        <GoalsContainer />
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
    this.props.dispatch(
      handleAddTodo(this.input.value, () => (this.input.value = ""))
    );
  };

  removeItem = (todo) => {
    this.props.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (todo) => {
    this.props.dispatch(handleToggleTodo(todo.id));
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

function TodosContainer(props) {
  return (
    <Context.Consumer>
      {(store) => {
        const { todos } = store.getState();
        return <Todos dispatch={store.dispatch} todos={todos} />;
      }}
    </Context.Consumer>
  );
}

class Goals extends React.Component {
  addGoal = (e) => {
    e.preventDefault();
    this.props.dispatch(
      handleAddGoal(this.input.value, () => (this.input.value = ""))
    );
  };

  removeItem = (goal) => {
    this.props.dispatch(handleDeleteGoal(goal));
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

function GoalsContainer() {
  return (
    <Context.Consumer>
      {(store) => {
        const { goals } = store.getState();
        return <Goals dispatch={store.dispatch} goals={goals} />;
      }}
    </Context.Consumer>
  );
}

const Context = React.createContext();

function Provider({ value, children }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
function AppContainer() {
  return (
    <Context.Consumer>{(store) => <App store={store} />}</Context.Consumer>
  );
}

ReactDOM.render(
  <Provider value={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("app")
);
