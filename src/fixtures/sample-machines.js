import { INIT_EVENT, INIT_STATE } from "state-transducer";
import { Counter, Hello } from './sample-components'
import { BUTTON_CLICKED, NO_MODEL_UPDATE } from "../properties"
import { renderCommandFactory, renderAction } from "../helpers"
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
    intentSource: eventSource => eventSource.map(ev => ({ [BUTTON_CLICKED]: {} })),
    states: { A: '' },
    events: [BUTTON_CLICKED],
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          const { count } = extendedState;

          return {
            outputs: renderAction(trigger => r(Counter, { count, onClick: trigger(BUTTON_CLICKED) }, [])),
            updates: NO_MODEL_UPDATE
          }
        }
      },
      {
        from: 'A', event: BUTTON_CLICKED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          const { count } = extendedState;

          return {
            outputs: renderAction(trigger => r(Counter, { count, onClick: trigger(BUTTON_CLICKED) }, [])),
            updates: [{ op: 'add', path: '/count', value: count + 1 }]
          }
        }
      },
    ],
    initialExtendedState: { count: 0 }
  },
};
// TODO : do one with event so I can showcase using trigger
