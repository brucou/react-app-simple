// TODO : do my state machine demo with react instead of cyclejs
// TODO : testing async responses
- do a sandbox for each example, so I can get rid of this repo
- also check if I did the concurrency thing or not (easy to do with state machines in the end, 
update README)
- try to do a sandbox with one of the sandboxes from https://github.com/GantMan/ReactStateMuseum,
 for instance purestore!!
- implement that with state machine : https://github.com/sarimarton/tmdb-ui-cyclejs
  - IMPL https://github.com/sarimarton/tmdb-ui-cyclejs
  - it is very similar to image gallery but nice css, and simple machine
  - implement it with cyclejs and post it on cycle group
    - mmm could be problems with routing actually which destroys the machine component??
  - implement it with combinators??
- bug when cancel is clicked, but the search is performed and we do not cancel the incoming 
result, so we have event sent with no items which erase the screen
  - so problem for actually really cancelling a request in the air... to investigate
  - also keep that version and run tests on it (good example to test with React)
  - !!! bug might be concurrency issues : terrific for testing!!
    - request is executed then cancelled -> machine is in loading
    - another search starts -> and the previous search returns with empty -> machine display 
    empty results
    - the second search results arrive and its results are discarded
    - put a counter in the SEARCH_SUCCESS emission to check it!!
    - basically the solution is to keep a record of which request answer is expected!!
    - note that this can be proven by testing BUT! SEARCH_SUCCESS can occur at any time, so I 
    would need to extend my machine testing to in any state, send any async event
      - so generate paths, then add a SEARCH_SUCCESS anywhere in the middle of those paths
      - this also checks that the machine does not react to event it should not, that is also 
      part of the specs.
      - add that to the machine demo testing repertory
      - then at some point write a docs specializing on state machine testing
- try with state machine demo (maybe use some react ui library)

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

# Testing
(move to react notes) 
- use inline snapshots, then write factor the snapshots into a function
  - for <Gallery...> would be factored into a function (props) -> HTML NO
  - well factor into as many functions you want, the idea is it has to be fast and correct and 
  lower complexity
- test the fsm as usual
  - include async events
  - don't include those events which are ignored by the machine (total tests would)
- then test intentFactory
- integration tests which include the effectful parts
  - test actions
  - test events
- we are done, if <Machine> itself is correctly tested, we are done
- test the <Machine> then!!!
  - this is where React test utils could be useful
