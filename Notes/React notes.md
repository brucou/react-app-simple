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

// Controlled vs. uncontrolled
// - for input, if going uncontrolled, DO NOT USE `value` property on react component!!

# react-hyperscripts
h(componentOrTag, properties, children)
Returns a React element.

componentOrTag Object|String - Can be a React component OR tag string with optional css class names/id in the format h1#some-id.foo.bar. If a tag string, it will parse out the tag name and change the id and className properties of the properties object.
properties Object (optional) - An object containing the properties you'd like to set on the element.
children Array|String (optional) - An array of h() children or a string. This will create child elements or a text node, respectively.
listOfElements Array - An array of React elements that will be wrapped with React.Fragment.

# testing
- beware of snapshot vs. ref...
  - cf. https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline

```
import React from 'react';
import MyInput from './MyInput';
import renderer from 'react-test-renderer';

function createNodeMock(element) {
  if (element.type === 'input') {
    return {
      focus() {},
    };
  }
  return null;
}

it('renders correctly', () => {
  const options = {createNodeMock};
  const tree = renderer.create(<MyInput />, options);
  expect(tree).toMatchSnapshot();
});
```

- [Enzyme full rendering for scenario testing](https://itnext.io/learning-to-write-react-tests-on-example-of-react-tic-tac-toe-app-acf7ae2b94b8)
```
it('renders game status correctly', () => {
  const wrapper = mount(<Game/>)
  const firstPlayer = wrapper.find('div.game-info').children().first().text()
  expect(firstPlayer).toEqual('Next player: X')
const button = wrapper.find('button.square').first()
  button.simulate('click')
  const secondPlayer = wrapper.find('div.game-info').children().first().text()
  expect(secondPlayer).toEqual('Next player: O')
//player 2
  const turn2 = wrapper.find('button.square').at(1)
  turn2.simulate('click')
  //player 1
  const turn3 = wrapper.find('button.square').at(4)
  turn3.simulate('click')
  //player 2
  const turn4 = wrapper.find('button.square').at(5)
  turn4.simulate('click')
  //player 1
  const turn5 = wrapper.find('button.square').at(8)
  turn5.simulate('click')
  
  const winner = wrapper.find('div.game-info').children().first().text()
  expect(winner).toEqual('Winner: X')
})
```
 
- investigate testing methodology : what to test, how to test, devtool etc
  - https://github.com/ruanyf/react-testing-demo
  - https://github.com/react-cosmos/react-cosmos
  - https://medium.freecodecamp.org/components-testing-in-react-what-and-how-to-test-with-jest-and-enzyme-7c1cace99de5

