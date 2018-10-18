import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { create_state_machine, NO_OUTPUT } from "state-transducer";
import { applyJSONpatch, identity } from "./helpers";
import Rx from 'rxjs/Rx'
import { COMMAND_RENDER, ERR_ACTION_EXECUTOR_COMMAND_EXEC } from "./properties"
import { machines } from "./fixtures/sample-machines"

// const $ = Rx.Observable;

// Machine helpers
// NOTE: they are declared out of the Machine component as they do not depend on the Machine
// They are declared here for cohesiveness purposes
// Declaring them inside did not seem to work anyways :
// the functions are not in scope of the constructor?
export function triggerFnFactory(eventSource) {
  return eventName => {
    return function (...args) {
      return eventSource.next({ [eventName]: args })
    }
  }
}

export function actionExecuterFactory(component, trigger, actionExecutorSpecs) {
  return action => {
    if (action === NO_OUTPUT) {}

    const { command, params } = action;
    const execFn = actionExecutorSpecs[command];
    if (!execFn || typeof execFn !== 'function') {
      throw new Error(ERR_ACTION_EXECUTOR_COMMAND_EXEC(command))
    }

    if (command === COMMAND_RENDER) {
      // render actions are :: trigger -> Component
      // and close over the extended state of the machine
      component.setState({ render: params(trigger) })
    }
    else {
      return execFn(params)
    }
  }
}

class Machine extends Component {
  constructor(props) {
    // NOTE : initialization has to be done in the constructor
    // componentDidMount is invoked **after** the component is rendered
    // and here the first render should happen only if a rendering action
    // is configured on the INIT transition of the machine

    super(props);

    const machineComponent = this;
    const { intentFactory, fsmSpecs, actionExecutorSpecs, settings } = props;
    this.eventSource = new Rx.Subject();
    // NOTE: we put settings last. this way `updateState` can be overridden in settings
    const fsm = create_state_machine(fsmSpecs, { updateState: applyJSONpatch, ...settings });
    const trigger = triggerFnFactory(this.eventSource);
    const actionExecuter = actionExecuterFactory(machineComponent, trigger, actionExecutorSpecs);
    const initialAction = fsm.start();

    (intentFactory || identity)(this.eventSource)
      .map(fsm.yield)
      .startWith(initialAction)
      .subscribe(actionExecuter)
    ;

    this.state = { render: null };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.eventSource.complete();
  }

  render(state) {
    return state.render
  }
}

const App = React.createElement(Machine, {
  intentFactory: null,
  fsmSpecs: machines.initWithRender,
  actionExecutorSpecs: {},
  settings: {}
}, null);

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo"/>
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

export default App;
