# challenges
- get the events to the state machine
  - the usual thing, onclick = yield(ev => makeIntent(ev))
  - makeIntent is taking the raw event and turning into a state-machine meaningful event
    - for instance a clickEv => ({target: clickEv.target})
    - as such makeIntent is an event factory, or a translator between event from the UI domain to
     the fsm domain
    - even without state machine, this has to be done anyways, so no cost paid here
    - complex manipulation of raw events can be for instance by associating subject to raw 
    events, and doing some rxjs voodo to get the final events
      - Comp1<onClick = trigger(eventName1)>
      - Comp2<onClick = trigger(eventName2)>
      - and then pass to the machine machineEv = sub1.takeUntil(sub2)
      - OR : pass raw events to the machine, and wrap around the machine an event preprocessor 
      which receives events and format them
        - the preprocessor could be itself a state machine whose outputs are intents
          - we loose however the composability of rxjs/most event (most because we only use events)
          - we need parallel machine as one event could have to be processed in two different ways
          - so best option is probably to do the processing without state machine and using 
          combinators (could also use combinators on generators, or transducers)
          - also can use barebone event emitter + transducers!! 
            - 3K : https://github.com/Olical/EventEmitter/blob/master/docs/guide.md
       - SO the best way is to have one subject for any components controlled by the machine
         - that subject receives all state machine events, and produce intents via transducers 
         which are fed to the actual machine
      - to read fields, do the usual react controlled component thing
        - for each key input, update the component state
        - when click on form button, the makeIntent(ev) should be makeIntent(ev, componentState)
        - the uncontrolled strategy requires ref, and then a method to pass the ref, and know 
        what it refers to...
        - try BOTH approaches to see what's best. IMPORTANT!! this is very frequent
- <Machine intentFactory, machineSpecs, ActionExecutorSpecs/>
- ActionExecuter :: Action -> ()
  - for screen render, ActionManager will update <Machine> state, triggering the render.
  - Machine react state will be a property called render which will be set if action.command = render
  - action.params will be anything in general and for render directly the react component
  - (cf. https://kyleshevlin.com/how-to-dynamically-render-react-components/)
  - (cf. https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9/)
  - CAN ALSO USE React.createElement(Hello, {toWhat: 'World'}, null) !! that is the best syntax
  - CAN ALSO USE https://github.com/mlmorg/react-hyperscript and https://github.com/ohanhi/hyperscript-helpers
    - EVEN BETTER!!!! no jsx
  - action.params = trigger => <Component onClick = trigger(rawEventName)>
    - but then I recompute each time..., could I memoize trigger??
- `trigger` works for user events
- for system events (like responses from actions), the response needs to be fed back to the fsm
  - for instance fetch(url).then(fsm.yield([rawEventName] : {...}))
  - use a subject as event source
- Machine
  - init : 
    - create and initialize fsm -> initial action
    - create event source subject
    - initialize trigger from fsm.yield and event source subject
    - write IntentFactory(rawEventSource).map(fsm.yield).filter(NO_OUTPUTS).startWith(initial action)
    .subscribe(ActionExecuter)
      - or use streamingStateMachine?? LATER
    - create action executer from ActionExecutorSpecs 
    - THE END
  - destroy
    - unMount?
    - maybe I should add a destroy function to fsm? look at memory allocation, in particular Maps
    .  LATER
    - event source subject complete and destroy
      - mmm might generate errors if we have .then(response => trigger...) calls, should put a 
      guard and warning there
    - event handlers will be automatically removed by React
  - state
    - render :
      - if state.render is not null, and is a function, then render(trigger)
      - for instance state.render = Comp1
  - action executor
    - ActionExecutorSpecs :: Map<Command, Exec>
    - ActionExecuter :: Action -> ()
      - command render is reserved
      - for command = render, setState({render: action.params})
        - action.params =  trigger => <Comp1 Click=trigger(rawEventName)> for instance
      - for other commands, lookup command table and run `Run` with Action.params
      - note that this means that actions are stateless, all the state must be in the state 
      machine with the exception of `render` property to trigger rendering

- In this model, machine can only receive events from component inside the machine
  - only those component are passed the trigger function
  - is it necessary to pass events from outside?
  - how to have two machines in different places communicate?
  - is not that a case of inter-component communication (sibling component communication)
  - cf. https://stackoverflow.com/questions/36143767/react-js-communicating-between-sibling-components
  - callback seems to be the way
  - so machine could have a onOutput event
    - which should filter or not the NO_OUTPUT?? preferably not, as this is also information
