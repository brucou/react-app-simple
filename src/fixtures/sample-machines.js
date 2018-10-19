import { INIT_EVENT, INIT_STATE } from "state-transducer";
import { Counter, Hello } from './sample-components'
import { NO_MODEL_UPDATE } from "../properties"
import { renderCommandFactory } from "../helpers"

/** @type {Object.<String, FSM_Def>} */
export const machines = {
  initWithRender: {
    states : { A:''},
    events : [],
    transitions : [
      {from : INIT_STATE, event:INIT_EVENT, to : 'A', action : (extendedState, eventData, fsmSettings) => {
        return {
          outputs : renderCommandFactory(Hello, {toWhat : extendedState.name}),
          updates : NO_MODEL_UPDATE
        }
        }}
    ],
    initialExtendedState : {name : 'Paul'}
  },
  initWithRenderAndEvent: {
    states : { A:''},
    events : [],
    transitions : [
      {from : INIT_STATE, event:INIT_EVENT, to : 'A', action : (extendedState, eventData, fsmSettings) => {
        const {count} = extendedState;
        return {
          // TODO : use hyperscript now
          outputs : trigger => <Counter count={count}/>,
          updates : NO_MODEL_UPDATE
        }
        }}
    ],
    initialExtendedState : {name : 'Paul', count: 0}
  },
};
// TODO : do one with event so I can showcase using trigger
