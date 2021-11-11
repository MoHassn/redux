import { Component } from "react";
import { connect } from "react-redux";
import { handleInitialData } from "../actions/shared";
import TodosContainer from "./Todos";
import GoalsContainer from "./Goals";

class App extends Component {
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

export default connect((state) => ({ loading: state.loading }))(App);
