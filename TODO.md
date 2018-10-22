- README
- bug when cancel is clicked, but the search is performed and we do not cancel the incoming 
result, so we have event sent with no items which erase the screen
  - so problem for actually really cancelling a request in the air... to investigate
  - also keep that version and run tests on it (good example to test with React)
  - !!! bug might be concurrency issues : terrific for testing!!
    - request is executed then cancelled -> machine is in loading
    - another search starts -> and the previous search returns with empty -> machine display 
    empty results
    - the second search results arrive and its results are discarded
    - put a counter in the SEARCH_SUCECSS emission to check it!!
    - basically the solution is to keep a record of which request answer is expected!!
    - note that this can be proven by testing BUT! SEARCH_SUCCESS can occur at any time, so I 
    would need to extend my machine testing to in any state, send any async event
      - so generate paths, then add a SEARCH_SUCCESS anywhere in the middle of those paths
      - this also checks that the machine does not react to event it should not, that is also 
      part of the specs.
      - add that to the machine demo testing repertory
      - then at some point write a docs specializing on state machine testing
- update terminology and types :
  - action : {updates, outputs}
  - command : element from outputs
- try with a state machine from statecharts gitter
- try with state machine demo (maybe use some react ui library)
- write doc
- publish to the world!!

# Later
- cycle possibility to replicate this architecture with
  - react hyperscript : portability
  - one command driver
  - having events directly in the hyperscript!!
    - will be different from react probably
    - controlled component thing to analyze : how to in this case?
    - event handler on next tick by default?
    - what about testing? should still work same with global eventHandler passed as source
    - will need to pass scope to command driver so it emits for the right destination
- also general problem of cancelling actions... 
  - here we change state and the event does not trigger anything so good
  - but if we were in the same state we would have a problem

# react-hyperscripts
h(componentOrTag, properties, children)
Returns a React element.

componentOrTag Object|String - Can be a React component OR tag string with optional css class names/id in the format h1#some-id.foo.bar. If a tag string, it will parse out the tag name and change the id and className properties of the properties object.
properties Object (optional) - An object containing the properties you'd like to set on the element.
children Array|String (optional) - An array of h() children or a string. This will create child elements or a text node, respectively.
listOfElements Array - An array of React elements that will be wrapped with React.Fragment.
