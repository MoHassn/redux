const Context = React.createContext();

function Provider({ value, children }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function connect(mapStateToProps) {
  return (Component) => {
    class Receiver extends React.Component {
      componentDidMount() {
        const { store } = this.props;

        this.unsubscribe = store.subscribe(() => this.forceUpdate());
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const { dispatch, getState } = this.props.store;
        const state = getState();
        const neededState = mapStateToProps(state);

        return <Component {...neededState} dispatch={dispatch} />;
      }
    }

    function ConnectedComponent() {
      return (
        <Context.Consumer>
          {(store) => <Receiver store={store} />}
        </Context.Consumer>
      );
    }

    return ConnectedComponent;
  };
}

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(handleInitialData());
  }

  render() {
    if (this.props.loading === true) {
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

const TodosContainer = connect((state) => ({ todos: state.todos }))(Todos);
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

const GoalsContainer = connect((state) => ({ goals: state.goals }))(Goals);

const AppContainer = connect((state) => ({ loading: state.loading }))(App);

ReactDOM.render(
  <Provider value={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("app")
);
