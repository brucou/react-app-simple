import React  from 'react';
import h from "react-hyperscript"
import hyperscript from "hyperscript-helpers"

const {div, span, h1} = hyperscript(h);

export class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

export class Counter extends React.Component {
  render() {
    return <button>{this.props.count}</button>;
  }
}

// TODO : do one with event so I can showcase using trigger
