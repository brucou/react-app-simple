import { INIT_EVENT, INIT_STATE } from "state-transducer";
import {Hello} from './sample-components'
import { NO_MODEL_UPDATE } from "../properties"
import { renderCommandFactory } from "../helpers"

/** @type {Object.<String, FSM_Def>} */
export const machines = {
  initWithRender: {
    states : { A:''},
    events : [],
    transitions : [
      {from : INIT_STATE, event:INIT_EVENT, action : (extendedState, eventData, fsmSettings) => {
        return {
          outputs : renderCommandFactory(Hello, {toWhat : extendedState.name}),
          updates : NO_MODEL_UPDATE
        }
        }}
    ],
    initialExtendedState : {name : 'Paul'}
  }
};
// TODO : do one with event so I can showcase using trigger
