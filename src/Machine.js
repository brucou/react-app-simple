import React, { Component } from 'react';
import { create_state_machine, decorateWithEntryActions, NO_OUTPUT } from "state-transducer";
import { applyJSONpatch, identity } from "./helpers";
import Rx from 'rxjs/Rx'
import { COMMAND_RENDER, ERR_ACTION_EXECUTOR_COMMAND_EXEC } from "./properties"

// const $ = Rx.Observable;

// Machine helpers
// NOTE: they are declared out of the Machine component as they do not depend on the Machine
// They are declared here for cohesiveness purposes
// Declaring them inside did not seem to work anyways :
// the functions are not in scope of the constructor?
export function triggerFnFactory(eventSource) {
  return eventName => {
    // NOTE : that assumes all event handlers have only one parameter
    return function (event) {
      return eventSource.next({ [eventName]: event })
    }
  }
}

export function actionExecuterFactory(component, trigger, actionExecutorSpecs) {
  return actions => {
    if (actions === NO_OUTPUT) {return}

    actions.forEach(action => {
      if (action === NO_OUTPUT) {return}

      const { command, params } = action;
      if (command === COMMAND_RENDER) {
        // render actions are :: trigger -> Component
        // and close over the extended state of the machine
        return component.setState({ render: params(trigger) })
      }

      const execFn = actionExecutorSpecs[command];
      if (!execFn || typeof execFn !== 'function') {
        throw new Error(ERR_ACTION_EXECUTOR_COMMAND_EXEC(command))
      }
      return execFn(params)
    })
  }
}

export class Machine extends Component {
  constructor(props) {
    // NOTE : initialization has to be done in the constructor
    // componentDidMount is invoked **after** the component is rendered
    // and here the first render should happen only if a rendering action
    // is configured on the INIT transition of the machine

    super(props);
    this.state = { render: null };
  }

  componentDidMount() {
    const machineComponent = this;
    const { intentSourceFactory, fsmSpecs, actionExecutorSpecs, entryActions, settings } = machineComponent.props;
    this.eventSource = new Rx.Subject();
    // NOTE: we put settings last. this way `updateState` can be overridden in settings
    const fsmSpecsWithEntryActions = decorateWithEntryActions(fsmSpecs, entryActions, null);
    const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch, ...settings });
    const trigger = triggerFnFactory(this.eventSource);
    const actionExecuter = actionExecuterFactory(machineComponent, trigger, actionExecutorSpecs);
    const initialAction = fsm.start();

    (intentSourceFactory || identity)(this.eventSource)
      .map(fsm.yield)
      .startWith(initialAction)
      .subscribe(actionExecuter)
    ;
  }

  componentWillUnmount() {
    this.eventSource.complete();
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null
  }
}

// import './App.css';
// import logo from './logo.svg';
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
//
// export default App;
