import React  from 'react';
import h from "react-hyperscript"
import hyperscript from "hyperscript-helpers"

const {div, button, span, h1} = hyperscript(h);

export class Hello extends React.Component {
  render() {
    const Component = this;
    const {toWhat} = Component.props;
    return div(`Hello ${toWhat}`)
  }
}

export class Counter extends React.Component {
  render() {
    const Component = this;
    const {count} = Component.props;
    return button(`Count : ${count}`);
  }
}

// TODO : do one with event so I can showcase using trigger
