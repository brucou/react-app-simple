import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { Counter, Hello } from './sample-components'
import { BUTTON_CLICKED, NO_MODEL_UPDATE } from "../properties"
import { getEventData, getEventName, renderAction, renderCommandFactory } from "../helpers"
import h from "react-hyperscript"
import React from 'react';

const r = (...args) => React.createElement.apply(React, args)

/** @type {Object.<String, FSM_Def>} */
export const machines = {
  initWithRender: {
    states: { A: '' },
    events: [],
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          return {
            outputs: renderCommandFactory(Hello, { toWhat: extendedState.name }),
            updates: NO_MODEL_UPDATE
          }
        }
      }
    ],
    initialExtendedState: { name: 'Paul' }
  },
  initWithRenderAndEvent: {
    // NOTE : only one event so not much to do
    intentSourceFactory: eventSource => eventSource.map(ev => ({ [getEventName(ev)]: getEventData(ev).type })),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { count } = extendedState;
        const { type } = eventData;

        return renderAction(trigger => h(Counter, { count, type, onClick: trigger(BUTTON_CLICKED) }))
      }
    },
    states: { A: '' },
    events: [BUTTON_CLICKED],
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          return {
            outputs: NO_OUTPUT,
            updates: NO_MODEL_UPDATE
          }
        }
      },
      {
        from: 'A', event: BUTTON_CLICKED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/count', value: count + 1 }]
          }
        }
      },
    ],
    initialExtendedState: { count: 0, type: 'none' }
  },
};

// TODO : showcase usage of settigns to parametrize the state machine for outside
// at the end, with a linked summary of all examples. The parameter will be which state machine to run? NO
// or just display a parameter that is passed in settings
// TODO : showcase intent factory with several events
// TODO : showcase intent factory with several events and rxjs logic
// TODO : showcase reading value from uncontrolled component !!
