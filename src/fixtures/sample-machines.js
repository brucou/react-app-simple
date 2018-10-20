import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { Counter, Hello, Input, InputWithImplicitRef, InputWithExplicitRef, TextMessage } from './sample-components'
import {
  BUTTON_CLICKED, ENTER_KEY_PRESSED, INPUT_CHANGED, KEY_ENTER, KEY_PRESSED, NO_ACTIONS, NO_INTENT, NO_MODEL_UPDATE
} from "../properties"
import { destructureEvent, getEventData, getEventName, renderAction, renderCommandFactory } from "../helpers"
import h from "react-hyperscript"
import React from 'react';

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
    intentSourceFactory: eventSource => eventSource.do(ev => {debugger})
      .map(ev => ({ [getEventName(ev)]: getEventData(ev) })),
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
        from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS
      },
      {
        from: 'A', event: BUTTON_CLICKED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          const { count } = extendedState;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/count', value: count + 1 }]
          }
        }
      },
    ],
    initialExtendedState: { count: 0, type: 'none' }
  },
  controlledForm: {
    intentSourceFactory: eventSource => eventSource.map(ev => {
      const { eventName, eventData } = destructureEvent(ev);

      if (eventName === INPUT_CHANGED) {
        return { [INPUT_CHANGED]: eventData.target.value }
      }
      else if (eventName === KEY_PRESSED) {
        return eventData.key === KEY_ENTER
          ? { [ENTER_KEY_PRESSED]: void 0 }
          : NO_INTENT
      }

      return NO_INTENT
    })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { value, placeHolder } = extendedState;

        return renderAction(trigger => h(Input, {
          value, placeHolder, onKeyPress: trigger(KEY_PRESSED), onChange: trigger(INPUT_CHANGED)
        }))
      },
      B: (extendedState, eventData, fsmSettings) => {
        const { value: text } = extendedState;

        return renderAction(trigger => h(TextMessage, { text }, []))
      }
    },
    states: { A: '', B: '' },
    events: [BUTTON_CLICKED, INPUT_CHANGED, ENTER_KEY_PRESSED],
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
      {
        from: 'A', event: INPUT_CHANGED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          const value = eventData;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/value', value }]
          }
        }
      },
      {
        from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: NO_ACTIONS
      },
    ],
    initialExtendedState: { placeHolder: 'Enter some text', value: '' }
  },
  uncontrolledFormWithExplicitRef: {
    intentSourceFactory: eventSource => eventSource
      .map(ev => {
        const { eventName, eventData, ref } = destructureEvent(ev);

        if (eventName === KEY_PRESSED) {
          return eventData.key === KEY_ENTER
            ? { [ENTER_KEY_PRESSED]: ref.current.value }
            : NO_INTENT
        }
        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { placeHolder } = extendedState;

        return renderAction(trigger => h(InputWithExplicitRef, { placeHolder, onKeyPress: trigger(KEY_PRESSED) }))
      },
      B: (extendedState, eventData, fsmSettings) => {
        const { entered: text } = extendedState;

        return renderAction(trigger => h(TextMessage, { text }, []))
      }
    },
    states: { A: '', B: '' },
    events: [BUTTON_CLICKED, ENTER_KEY_PRESSED],
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
      {
        from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: (extendedState, eventData, fsmSettings) => {
          const value = eventData;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/entered', value }]
          }
        }
      },
    ],
    initialExtendedState: { placeHolder: 'Enter some text', entered: '' }
  },
  uncontrolledFormWithImplicitRef: {
    intentSourceFactory: eventSource => eventSource
      .map(ev => {
        const { eventName, eventData} = destructureEvent(ev);

        if (eventName === KEY_PRESSED) {
          return eventData.key === KEY_ENTER
            ? { [ENTER_KEY_PRESSED]: eventData.value }
            : NO_INTENT
        }
        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { placeHolder } = extendedState;

        return renderAction(trigger => h(InputWithImplicitRef, { placeHolder, onKeyPress: trigger(KEY_PRESSED) }))
      },
      B: (extendedState, eventData, fsmSettings) => {
        const { entered: text } = extendedState;

        return renderAction(trigger => h(TextMessage, { text }, []))
      }
    },
    states: { A: '', B: '' },
    events: [BUTTON_CLICKED, ENTER_KEY_PRESSED],
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
      {
        from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: (extendedState, eventData, fsmSettings) => {
          const value = eventData;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/entered', value }]
          }
        }
      },
    ],
    initialExtendedState: { placeHolder: 'Enter some text', entered: '' }
  },
};

// TODO : showcase usage of settings to parametrize the state machine for outside
// at the end, with a linked summary of all examples. The parameter will be which state machine to run? NO
// or just display a parameter that is passed in settings
// TODO : showcase reading value from uncontrolled component !!
// - same form than
// TODO : use an UI library : AFTER
// TODO : machine with outputs to test the action executer no render command, find some demo with xstate there
