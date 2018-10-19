import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Machine } from './Machine';
import * as serviceWorker from './serviceWorker';
import { machines } from "./fixtures/sample-machines"


const App = React.createElement(Machine, {
  entryActions: machines.initWithRenderAndEvent.entryActions,
  intentSourceFactory: machines.initWithRenderAndEvent.intentSourceFactory,
  fsmSpecs: machines.initWithRenderAndEvent,
  actionExecutorSpecs: {},
  settings: {}
}, null);

ReactDOM.render(
  App,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
