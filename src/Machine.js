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
    // DOC : by convention, [eventName, eventData, ref (optional), ...anything else]
    // DOC : eventData is generally the raw event passed by the event handler
    // DOC : `ref` here is :: React.Ref and is generally used to pass `ref`s for uncontrolled component
    return function eventHandler(...args) {
      return eventSource.next([eventName].concat(args));
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
        // ...except in the infrequent case when we want to
        return component.setState({ render: params(trigger) })
      }

      const execFn = actionExecutorSpecs[command];
      if (!execFn || typeof execFn !== 'function') {
        throw new Error(ERR_ACTION_EXECUTOR_COMMAND_EXEC(command))
      }
      // NOTE :we choose this form to allow for currying down the road
      return execFn(trigger, params)
    })
  }
}

/**
 * Class implementing a reactive system modelled by a state machine (fsm).
 * The system behaviour is determined by properties passed at construction time :
 * - `intentSourceFactory` : translate user events and system events into machine events
 * - `fsmSpecs` : configuration of the fsm
 * - `settings` : optional settings to be passed to the fsm. This allow for parameterization of the
 * behaviour of the machine
 * - `entryActions` : action factories that are executed on entry of control states of the fsm
 * - `actionExecutorSpecs` : maps commands output by the fsm to the function executing those commands
 * - componentWillUpdate : a function for customizing `componentWillUpdate` for a class instance. That function
 * however has a different signature, and incorporates the fsm's settings as parameters
 * - componentDidUpdate : a function for customizing `componentDidUpdate` for a class instance. That function
 * however has a different signature, and incorporates the fsm's settings as parameters
 */
export class Machine extends Component {
  constructor(props) {
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

  componentDidUpdate(prevProps, prevState, snapshot){
    // called after the render method.
    const machineComponent = this;
    const { componentDidUpdate:cdu, settings} = machineComponent.props;
    cdu.call(null, machineComponent, prevProps, prevState, snapshot, settings );
  }

  componentWillUpdate(nextProps, nextState){
    // perform any preparations for an upcoming update
    const machineComponent = this;
    const { componentWillUpdate:cwu, settings } = machineComponent.props;
    cwu.call(null, machineComponent, nextProps, nextState, settings);
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
