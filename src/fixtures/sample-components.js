import React  from 'react';

export class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

// TODO : do one with event so I can showcase using trigger
