import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { Machine } from './App';
import * as serviceWorker from './serviceWorker';
import { machines } from "./fixtures/sample-machines"

const MachineElement = React.createElement(Machine, {
  intentFactory: null,
  fsmSpecs: machines.initWithRender,
  actionExecutorSpecs: {},
  settings: {}
}, null);

ReactDOM.render(
  MachineElement,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
