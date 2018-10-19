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
    const {count, type, onClick} = Component.props;

    return div([
      button({onClick},`Count : ${count}`),
      span(` -- Type : ${type || 'none'}`)
      ]);
  }
}
