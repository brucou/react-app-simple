import React from 'react';
import h from "react-hyperscript"
import hyperscript from "hyperscript-helpers"
import { wrapWithRef } from "../helpers"

const { div, button, span, input, h1 } = hyperscript(h);

export class Hello extends React.Component {
  render() {
    const Component = this;
    const { toWhat } = Component.props;
    return div(`Hello ${toWhat}`)
  }
}

export class Counter extends React.Component {
  render() {
    const Component = this;
    const { count, type, onClick } = Component.props;

    return div([
      button({ onClick }, `Count : ${count}`),
      span(` -- Type : ${type || 'none'}`)
    ]);
  }
}

export class Input extends React.Component {
  render() {
    const Component = this;
    const { value, onKeyPress, onChange, placeHolder } = Component.props;

    return input({ placeholder: placeHolder, type: "text", value, onChange, onKeyPress }, [])
  }
}

export class InputWithExplicitRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const Component = this;
    const { onKeyPress, placeHolder } = Component.props;
    const onKeyPressWithRef = ev => onKeyPress(ev, this.inputRef);

    return input({ ref: this.inputRef, placeholder: placeHolder, type: "text", onKeyPress: onKeyPressWithRef }, [])
  }
}

export class InputWithImplicitRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const Component = this;
    const { onKeyPress, placeHolder } = Component.props;
    const onKeyPressWithRef = ev => onKeyPress({ key: ev.key, value: this.inputRef.current.value });

    return input({ ref: this.inputRef, placeholder: placeHolder, type: "text", onKeyPress: onKeyPressWithRef }, [])
  }
}

export class TextMessage extends React.Component {
  render() {
    const Component = this;
    const { text } = Component.props;

    return span(`You entered ${text}!`)
  }
}

