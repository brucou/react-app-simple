import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { getStateTransducerRxAdapter, Machine } from './Machine'; // NOTE : shortcut to have the machine locally
// import { Machine } from "react-state-driven"
import * as serviceWorker from './serviceWorker';
import { machines, xstateMachines } from "./fixtures/sample-machines"
import { applyJSONpatch } from "./helpers"
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { filter, flatMap, map, shareReplay, startWith } from "rxjs/operators";
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";
import { createStateMachine, decorateWithEntryActions, INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { xstateReactInterpreter } from "xstate-interpreter"
import { Machine as xstateMachineFactory } from "xstate"

const { div, button, span } = hyperscript(h);
const noop = () => {};
const stateTransducerRxAdapter = getStateTransducerRxAdapter({Subject, Observable, filter, map});

const showMachine = machine => {
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = createStateMachine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch, debug : {console} });

  return React.createElement(Machine, {
    eventHandler: stateTransducerRxAdapter,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    effectHandlers : machine.effectHandlers,
    options : machine.options
  }, null)
};

// const showXstateMachine = machine => {
//   const interpreterConfig = {
//     updateState: machine.updateState,
//     mergeOutputs: machine.mergeOutputs,
//     actionFactoryMap: machine.actionFactoryMap,
//   };
//   const fsm = xstateReactInterpreter(xstateMachineFactory, machine.config, interpreterConfig);
//
//   return React.createElement(Machine, {
//     eventHandler: xStateRxAdapter,
//     preprocessor: machine.preprocessor,
//     fsm: fsm,
//     commandHandlers: machine.commandHandlers,
//     componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
//     componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
//   }, null)
// };

// Displays all machines (not very beautifully, but this is just for testing)
ReactDOM.render(
  div([
    div(
      Object.keys(machines).map(machine => {
        return div([
          span(machine),
          showMachine(machines[machine])
        ])
      })
    ),
    // showXstateMachine(xstateMachines.xstateImageGallery)
  ]),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
