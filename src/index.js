import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'
import * as serviceWorker from './serviceWorker';

// Redux
// actions are usually defined using variables to avoid quotes and spelling issues
const INCREMENT = "canBeAnything";
const DECREMENT = "thisAlsoDecrament";

// action creator
// actions are objects with `type`
// new state is obtained using type of action
const incrementActionCreator = () => ({type: INCREMENT});
const decrementActionCreator = () => ({type: DECREMENT});

// reducer
// takes previous state and action to
// give new state
function counterReducer(pState = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return pState + 1;
    case DECREMENT:
      return pState - 1;
    default:
      return pState;
  }
}

// store
// single source of truth
// needs reducer to infer state type
const store = createStore(counterReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// React
// display net score
// state comes from redux
class ScoreBoard extends React.Component {
	render() {
    	return (
    	  <div>
    	  <h1>{this.props.count}</h1>
    	  </div>
    	);
	}
}

// controller
// displays + and - clicks
// using local state
class Controller extends React.Component {
  constructor(props) {
    super(props);
    
    // state
    this.state = {
      increments: 0,
      decrements: 0
    }
    
    // binds
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    
  }
  
  // local function to update
  // local state and dispatch
  increment() {
    this.setState((state) => ({
      increments: state.increments + 1,
      decrements: state.decrements
    }));
    // send increment to redux
    this.props.sendIncrement();
  }
  
  // local function to update
  // local state and dispatch
  decrement() {
    this.setState((state) => ({
      increments: state.increments,
      decrements: state.decrements + 1
    }));
    // send decrement to redux
    this.props.sendDecrement();
  }
  
  // shows number of increments
  // and decrements based on local
  // and buttons to alter these
  // along with global state
  render() {
    return (
      <div>
      <h2>Increments: {this.state.increments}</h2>
      <h2>Decrements: {this.state.decrements}</h2>
      <button onClick={this.increment}>+</button>
      <button onClick={this.decrement}>-</button>
      </div>
    );
  }
}

// React-Redux
// map ScoreBoard state to redux state
// redux state accessible in ScoreBoard using props.count
function mapStateToProps(state) {
  return {
    count: state
  };
}
// only state is connected for this component
const ScoreBoardContainer = connect(mapStateToProps)(ScoreBoard);

// controller
// dispatching needs to be available inside Controller
// props.sendIncrement or sendDecrement does that for us
// dispatch function takes action as argument and that comes from action-creator
function mapDispatchToProps(dispatch) {
  return {
    sendIncrement: () => dispatch(incrementActionCreator()),
    sendDecrement: () => dispatch(decrementActionCreator())
  }
}
// state is not connected but actions are dispatch from this component
const ControllerContainer = connect(null, mapDispatchToProps)(Controller);

// app
// just combines ScoreBoard
// and Controller
const App = () => {
    return (
      <div>
        <ScoreBoardContainer />
        <ControllerContainer />
      </div>
    );
}

// render
// finally render to DOM!
ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
