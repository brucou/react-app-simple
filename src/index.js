import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { Machine } from './Machine'; // NOTE : shortcut to have the machine locally
import { Machine } from "react-state-driven";
import * as serviceWorker from './serviceWorker';
import { machines } from "./fixtures/sample-machines"
import { applyJSONpatch } from "./helpers"
import Rx from 'rxjs/Rx'
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";

const { div, button, span, input, form, section, img, h1 } = hyperscript(h);
const noop = () => {};

const showMachine = machine => React.createElement(Machine, {
  subjectFactory: Rx,
  entryActions: machine.entryActions,
  preprocessor: machine.preprocessor,
  fsmSpecs: machine,
  commandHandlers: machine.commandHandlers,
  settings: { updateState: applyJSONpatch },
  componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
  componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
}, null);

// Displays all machines (not very beautifully, but this is just for testing)
ReactDOM.render(
  div(
    Object.keys(machines).map(machine => {
      return div([
        span(machine),
        showMachine(machines[machine])
      ])
    })
  ),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
