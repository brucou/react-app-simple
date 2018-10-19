// NOTE : react state update safe pattern
// this.setState(function(state, props) {
//   return {
//     counter: state.counter + props.increment
//   };
// });
// NOTE : React follows a reducer pattern : State -> StateUpdate -> State'
// 1. this.setState(State -> StateUpdate)
// that is the previous pattern
// 2. this.setState(StateUpdate)
// that is the base update pattern
// State' is computed internally by React
// The reducing function used is object shallow merge
// cf. https://reactjs.org/docs/state-and-lifecycle.html


// NOTE : we do not use jsx, but instead hyperscripts, not to fall into JSX
// syntax gotchas

// NOTE : Event handling
// `preventDefault` must be called, no returning false like in DOM land
// event handler this parameter should be boudn at construction time
// avoid arrow functions for performance reasons
// cf. https://reactjs.org/docs/handling-events.html
// constructor(props) {
//   super(props);
//   this.state = {isToggleOn: true};
//
//   // This binding is necessary to make `this` work in the callback
//   this.handleClick = this.handleClick.bind(this);
// }

// React DOM
// 1. Beware of few changes:
// TextArea use value attribute too
// Select takes array as value attribute
// cf. https://reactjs.org/docs/forms.html
// 2. Prefer uncontrolled components are ref!!!
// cf. https://reactjs.org/docs/uncontrolled-components.html
