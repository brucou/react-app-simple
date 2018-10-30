import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { Machine } from './Machine'; // NOTE : shortcut to have the machine locally
import * as serviceWorker from './serviceWorker';
import { machines, xstateMachines } from "./fixtures/sample-machines"
import { applyJSONpatch } from "./helpers"
import Rx from 'rxjs/Rx'
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";
import { create_state_machine, decorateWithEntryActions, INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { xstateReactInterpreter } from "xstate-interpreter"
import { Machine as xstateMachineFactory } from "xstate"
import { Machine } from "./Machine"

const { div, button, span, input, form, section, img, h1 } = hyperscript(h);
const noop = () => {};

const showMachine = machine => {
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });

  return React.createElement(Machine, {
    subjectFactory: Rx,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null)
};

const showXstateMachine = machine => {
  const interpreterConfig = {
    updateState: machine.updateState,
    mergeOutputs: machine.mergeOutputs,
    actionFactoryMap: machine.actionFactoryMap,
  };
  const fsm = xstateReactInterpreter(xstateMachineFactory, machine.config, interpreterConfig);

  return React.createElement(Machine, {
    subjectFactory: Rx,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null)
};

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
    showXstateMachine(xstateMachines.xstateImageGallery)
  ]),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
