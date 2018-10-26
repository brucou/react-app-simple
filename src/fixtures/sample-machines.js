import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import {
  Counter, GalleryApp, Hello, Input, InputWithExplicitRef, InputWithImplicitRef, TextMessage
} from './sample-components';
import {
  BUTTON_CLICKED, COMMAND_SEARCH, ENTER_KEY_PRESSED, INPUT_CHANGED, KEY_ENTER, KEY_PRESSED, NO_ACTIONS, NO_INTENT,
  NO_STATE_UPDATE
} from "../properties";
import { destructureEvent, renderAction } from "react-state-driven";
import { getEventData, getEventName, renderCommandFactory, renderGalleryApp, runSearchQuery } from "../helpers";
import h from "react-hyperscript";
import React from 'react';
import Flipping from 'flipping';

export const machines = {
  initWithRender: {
    states: { A: '' },
    events: [],
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          return {
            outputs: renderCommandFactory(Hello, { toWhat: extendedState.name }),
            updates: NO_STATE_UPDATE
          }
        }
      }
    ],
    initialExtendedState: { name: 'Paul' }
  },
  initWithRenderAndEvent: {
    // NOTE : only one event so not much to do
    preprocessor: rawEventSource => rawEventSource.map(ev => ({ [getEventName(ev)]: getEventData(ev) })),
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
    preprocessor: rawEventSource => rawEventSource.map(ev => {
      const { rawEventName, rawEventData } = destructureEvent(ev);

      if (rawEventName === INPUT_CHANGED) {
        return { [INPUT_CHANGED]: rawEventData.target.value }
      }
      else if (rawEventName === KEY_PRESSED) {
        return rawEventData.key === KEY_ENTER
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
    preprocessor: rawEventSource => rawEventSource
      .map(ev => {
        const { rawEventName, rawEventData, ref } = destructureEvent(ev);

        if (rawEventName === KEY_PRESSED) {
          return rawEventData.key === KEY_ENTER
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
    preprocessor: rawEventSource => rawEventSource
      .map(ev => {
        const { rawEventName, rawEventData } = destructureEvent(ev);

        if (rawEventName === KEY_PRESSED) {
          return rawEventData.key === KEY_ENTER
            ? { [ENTER_KEY_PRESSED]: rawEventData.value }
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
  imageGallery: {
    initialExtendedState: { query: '', items: [], photo: undefined, gallery: '' },
    states: { start: '', loading: '', gallery: '', error: '', photo: '' },
    events: ['SEARCH', 'SEARCH_SUCCESS', 'SEARCH_FAILURE', 'CANCEL_SEARCH', 'SELECT_PHOTO', 'EXIT_PHOTO'],
    preprocessor: rawEventSource => rawEventSource
      .map(ev => {
        const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);

        // Form raw events
        if (rawEventName === 'onSubmit') {
          e.persist();
          e.preventDefault();
          return { SEARCH: ref.current.value }
        }
        else if (rawEventName === 'onCancelClick') {
          return { CANCEL_SEARCH: void 0 }
        }
        // Gallery
        else if (rawEventName === 'onGalleryClick') {
          const item = e;
          return { SELECT_PHOTO: item }
        }
        // Photo detail
        else if (rawEventName === 'onPhotoClick') {
          return { EXIT_PHOTO: void 0 }
        }
        // System events
        else if (rawEventName === 'SEARCH_SUCCESS') {
          const items = e;
          return { SEARCH_SUCCESS: items }
        }
        else if (rawEventName === 'SEARCH_FAILURE') {
          return { SEARCH_FAILURE: void 0 }
        }

        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'start', action: NO_ACTIONS },
      { from: 'start', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
      {
        from: 'loading', event: 'SEARCH_SUCCESS', to: 'gallery', action: (extendedState, eventData, fsmSettings) => {
          const items = eventData;

          return {
            updates: [{ op: 'add', path: '/items', value: items }],
            outputs: NO_OUTPUT
          }
        }
      },
      { from: 'loading', event: 'SEARCH_FAILURE', to: 'error', action: NO_ACTIONS },
      { from: 'loading', event: 'CANCEL_SEARCH', to: 'gallery', action: NO_ACTIONS },
      { from: 'error', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
      { from: 'gallery', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
      {
        from: 'gallery', event: 'SELECT_PHOTO', to: 'photo', action: (extendedState, eventData, fsmSettings) => {
          const item = eventData;

          return {
            updates: [{ op: 'add', path: '/photo', value: item }],
            outputs: NO_OUTPUT
          }
        }
      },
      { from: 'photo', event: 'EXIT_PHOTO', to: 'gallery', action: NO_ACTIONS },
    ],
    entryActions: {
      loading: (extendedState, eventData, fsmSettings) => {
        const { items, photo } = extendedState;
        const query = eventData;
        const searchCommand = {
          command: COMMAND_SEARCH,
          params: query
        };
        const renderGalleryAction = renderAction(trigger =>
          h(GalleryApp, { query, items, trigger, photo, gallery: 'loading' }, [])
        );

        return {
          outputs: [searchCommand, renderGalleryAction.outputs],
          updates: NO_STATE_UPDATE
        }
      },
      photo: renderGalleryApp('photo'),
      gallery: renderGalleryApp('gallery'),
      error: renderGalleryApp('error'),
      start: renderGalleryApp('start'),
    },
    commandHandlers: {
      [COMMAND_SEARCH]: (trigger, query) => {
        runSearchQuery(query)
          .then(data => {
            trigger('SEARCH_SUCCESS')(data.items)
          })
          .catch(error => {
            trigger('SEARCH_FAILURE')(void 0)
          });
      }
    },
    inject: new Flipping(),
    componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) => {flipping.read();},
    componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) => {flipping.flip();}
  }
};

// TODO : test demo with xstate (imageGallery)
// TODO : do my state machine demo with react instead of cyclejs
// TODO : testing async responses
