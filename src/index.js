import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Machine } from './Machine';
import * as serviceWorker from './serviceWorker';
import { machines } from "./fixtures/sample-machines"

const App = machine => React.createElement(Machine, {
  entryActions: machine.entryActions,
  intentSourceFactory: machine.intentSourceFactory,
  fsmSpecs: machine,
  actionExecutorSpecs: machine.actionExecutorSpecs,
  settings: {},
  componentWillUpdate : machine.componentWillUpdate( machine.inject),
  componentDidUpdate: machine.componentDidUpdate(machine.inject)
}, null);

ReactDOM.render(
  App(machines.imageGallery),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
