- write a machine with only one transition to a state with an initial render action with dummy 
component
  - check it renders
- add another transition to another state with only internal state update, and no output
- add another transition to another state with internal state update, and dummy action not render
- try with a state machine from statecharts gitter
- try with state machine demo (maybe use some react ui library)
- write doc
- publish to the world!!
 
# Later

# react-hyperscripts
h(componentOrTag, properties, children)
Returns a React element.

componentOrTag Object|String - Can be a React component OR tag string with optional css class names/id in the format h1#some-id.foo.bar. If a tag string, it will parse out the tag name and change the id and className properties of the properties object.
properties Object (optional) - An object containing the properties you'd like to set on the element.
children Array|String (optional) - An array of h() children or a string. This will create child elements or a text node, respectively.
listOfElements Array - An array of React elements that will be wrapped with React.Fragment.
