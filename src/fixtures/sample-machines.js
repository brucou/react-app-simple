import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { GalleryApp, } from './sample-components';
import { COMMAND_RENDER, COMMAND_SEARCH, NO_ACTIONS, NO_INTENT, NO_STATE_UPDATE } from "../properties";
import { destructureEvent, renderAction } from "react-state-driven";
import {
  defaultRenderHandler, immerReducer, mergeOutputs, renderGalleryApp, renderGalleryAppImmer, runSearchQuery
} from "../helpers";
import h from "react-hyperscript";
import React from 'react';
import Flipping from 'flipping';
import { nothing } from "immer"
import { Observable, Subject } from "rxjs"
import { startWith, filter, map  } from "rxjs/operators";
import { getStateTransducerRxAdapter } from "../Machine"

const flipping = new Flipping();
const stateTransducerRxAdapter = getStateTransducerRxAdapter({ Subject, Observable });
const transduce = stateTransducerRxAdapter.transduce;

export const machines = {
  // initWithRender: {
  //   states: { A: '' },
  //   events: [],
  //   preprocessor: rawEventSource => rawEventSource.pipe(map(ev => ({ [getEventName(ev)]: getEventData(ev) }))),
  //   transitions: [
  //     {
  //       from: INIT_STATE, event: INIT_EVENT, to: 'A', action: (extendedState, eventData, fsmSettings) => {
  //         return {
  //           outputs: renderCommandFactory(Hello, { toWhat: extendedState.name }),
  //           updates: NO_STATE_UPDATE
  //         }
  //       }
  //     }
  //   ],
  //   initialExtendedState: { name: 'Paul' }
  // },
  // initWithRenderAndEvent: {
  //   // NOTE : only one event so not much to do
  //   preprocessor: rawEventSource => rawEventSource.pipe(map(ev => ({ [getEventName(ev)]: getEventData(ev) }))),
  //   entryActions: {
  //     A: (extendedState, eventData, fsmSettings) => {
  //       const { count } = extendedState;
  //       const type = eventData && eventData.type || extendedState.type;
  //
  //       return renderAction(trigger => h(Counter, { count, type, onClick: trigger(BUTTON_CLICKED) }))
  //     }
  //   },
  //   states: { A: '' },
  //   events: [BUTTON_CLICKED],
  //   transitions: [
  //     {
  //       from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS
  //     },
  //     {
  //       from: 'A', event: BUTTON_CLICKED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
  //         const { count } = extendedState;
  //
  //         return {
  //           outputs: NO_OUTPUT,
  //           updates: [{ op: 'add', path: '/count', value: count + 1 }]
  //         }
  //       }
  //     },
  //   ],
  //   initialExtendedState: { count: 0, type: 'none' }
  // },
  // // controlledForm: {
  // //   preprocessor: rawEventSource => rawEventSource.pipe(
  // //     map(ev => {
  // //       debugger
  // //       const { rawEventName, rawEventData } = destructureEvent(ev);
  // //
  // //       if (rawEventName === INIT_EVENT) {
  // //         return { [INIT_EVENT]: void 0 }
  // //       }
  // //       else if (rawEventName === INPUT_CHANGED) {
  // //         return { [INPUT_CHANGED]: rawEventData.target.value }
  // //       }
  // //       else if (rawEventName === KEY_PRESSED) {
  // //         return rawEventData.key === KEY_ENTER
  // //           ? { [ENTER_KEY_PRESSED]: void 0 }
  // //           : NO_INTENT
  // //       }
  // //
  // //       return NO_INTENT
  // //     }),
  // //     filter(x => x !== NO_INTENT)
  // //   ),
  // //   entryActions: {
  // //     A: (extendedState, eventData, fsmSettings) => {
  // //       const { value, placeHolder } = extendedState;
  // //
  // //       return renderAction(trigger => h(Input, {
  // //         value, placeHolder, onKeyPress: trigger(KEY_PRESSED), onChange: trigger(INPUT_CHANGED)
  // //       }))
  // //     },
  // //     B: (extendedState, eventData, fsmSettings) => {
  // //       const { value: text } = extendedState;
  // //
  // //       return renderAction(trigger => h(TextMessage, { text }, []))
  // //     }
  // //   },
  // //   states: { A: '', B: '' },
  // //   events: [BUTTON_CLICKED, INPUT_CHANGED, ENTER_KEY_PRESSED],
  // //   transitions: [
  // //     { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
  // //     {
  // //       from: 'A', event: INPUT_CHANGED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
  // //         const value = eventData;
  // //
  // //         return {
  // //           outputs: NO_OUTPUT,
  // //           updates: [{ op: 'add', path: '/value', value }]
  // //         }
  // //       }
  // //     },
  // //     {
  // //       from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: NO_ACTIONS
  // //     },
  // //   ],
  // //   initialExtendedState: { placeHolder: 'Enter some text', value: '' }
  // // },
  // uncontrolledFormWithExplicitRef: {
  //   preprocessor: rawEventSource => rawEventSource.pipe(
  //     map(ev => {
  //       const { rawEventName, rawEventData, ref } = destructureEvent(ev);
  //
  //       if (rawEventName === INIT_EVENT) {
  //         return { [INIT_EVENT]: void 0 }
  //       }
  //       else if (rawEventName === KEY_PRESSED) {
  //         return rawEventData.key === KEY_ENTER
  //           ? { [ENTER_KEY_PRESSED]: ref.current.value }
  //           : NO_INTENT
  //       }
  //       return NO_INTENT
  //     }),
  //     filter(x => x !== NO_INTENT)
  //   ),
  //   entryActions: {
  //     A: (extendedState, eventData, fsmSettings) => {
  //       const { placeHolder } = extendedState;
  //
  //       return renderAction(trigger => h(InputWithExplicitRef, { placeHolder, onKeyPress: trigger(KEY_PRESSED) }))
  //     },
  //     B: (extendedState, eventData, fsmSettings) => {
  //       const { entered: text } = extendedState;
  //
  //       return renderAction(trigger => h(TextMessage, { text }, []))
  //     }
  //   },
  //   states: { A: '', B: '' },
  //   events: [BUTTON_CLICKED, ENTER_KEY_PRESSED],
  //   transitions: [
  //     { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
  //     {
  //       from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: (extendedState, eventData, fsmSettings) => {
  //         const value = eventData;
  //
  //         return {
  //           outputs: NO_OUTPUT,
  //           updates: [{ op: 'add', path: '/entered', value }]
  //         }
  //       }
  //     },
  //   ],
  //   initialExtendedState: { placeHolder: 'Enter some text', entered: '' }
  // },
  // uncontrolledFormWithImplicitRef: {
  //   preprocessor: rawEventSource => rawEventSource.pipe(
  //     map(ev => {
  //       const { rawEventName, rawEventData } = destructureEvent(ev);
  //
  //       if (rawEventName === INIT_EVENT) {
  //         return { [INIT_EVENT]: void 0 }
  //       }
  //       else if (rawEventName === KEY_PRESSED) {
  //         return rawEventData.key === KEY_ENTER
  //           ? { [ENTER_KEY_PRESSED]: rawEventData.value }
  //           : NO_INTENT
  //       }
  //       return NO_INTENT
  //     }),
  //     filter(x => x !== NO_INTENT)
  //   ),
  //   entryActions: {
  //     A: (extendedState, eventData, fsmSettings) => {
  //       const { placeHolder } = extendedState;
  //
  //       return renderAction(trigger => h(InputWithImplicitRef, { placeHolder, onKeyPress: trigger(KEY_PRESSED) }))
  //     },
  //     B: (extendedState, eventData, fsmSettings) => {
  //       const { entered: text } = extendedState;
  //
  //       return renderAction(trigger => h(TextMessage, { text }, []))
  //     }
  //   },
  //   states: { A: '', B: '' },
  //   events: [BUTTON_CLICKED, ENTER_KEY_PRESSED],
  //   transitions: [
  //     { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
  //     {
  //       from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: (extendedState, eventData, fsmSettings) => {
  //         const value = eventData;
  //
  //         return {
  //           outputs: NO_OUTPUT,
  //           updates: [{ op: 'add', path: '/entered', value }]
  //         }
  //       }
  //     },
  //   ],
  //   initialExtendedState: { placeHolder: 'Enter some text', entered: '' }
  // },
  imageGallery: {
    options: {},
    initialExtendedState: { query: '', items: [], photo: undefined, gallery: '' },
    states: { start: '', loading: '', gallery: '', error: '', photo: '' },
    events: ['START', 'SEARCH', 'SEARCH_SUCCESS', 'SEARCH_FAILURE', 'CANCEL_SEARCH', 'SELECT_PHOTO', 'EXIT_PHOTO'],
    preprocessor: rawEventSource => rawEventSource.pipe(
      map(ev => {
        const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);

        if (rawEventName === INIT_EVENT) {
          return { [INIT_EVENT]: void 0 }
        }
        // Form raw events
        else if (rawEventName === 'START') {
          return { START: void 0 }
        }
        else if (rawEventName === 'onSubmit') {
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
      }),
      filter(x => x !== NO_INTENT),
      startWith({'START' : void 0}),
    ),
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'start', action: NO_ACTIONS },
      { from: 'start', event: 'START', to: 'start', action: NO_ACTIONS },
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
      [COMMAND_SEARCH]: (trigger, query, effectHandlers) => {
        effectHandlers.runSearchQuery(query)
          .then(data => {
            trigger('SEARCH_SUCCESS')(data.items)
          }).catch(error => {
          trigger('SEARCH_FAILURE')(void 0)
        });
      }
    },
    effectHandlers: {
      runSearchQuery: runSearchQuery,
      [COMMAND_RENDER]: (component, newState) => {
        // Applying flipping animations : read DOM before render, and flip after render
        flipping.read();
        defaultRenderHandler(component, newState, () => flipping.flip())
      }
    },
  },
  // imageGallerySwitchMap: {
  //   initialExtendedState: { query: '', items: [], photo: undefined, gallery: '' },
  //   states: { start: '', loading: '', gallery: '', error: '', photo: '' },
  //   events: ['SEARCH', 'SEARCH_SUCCESS', 'SEARCH_FAILURE', 'CANCEL_SEARCH', 'SELECT_PHOTO', 'EXIT_PHOTO'],
  //   preprocessor: rawEventSource => rawEventSource.pipe(
  //     map(ev => {
  //       const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);
  //
  //       if (rawEventName === INIT_EVENT) {
  //         return { [INIT_EVENT]: void 0 }
  //       }
  //       // Form raw events
  //       else if (rawEventName === 'onSubmit') {
  //         e.persist();
  //         e.preventDefault();
  //         return { SEARCH: ref.current.value }
  //       }
  //       else if (rawEventName === 'onCancelClick') {
  //         return { CANCEL_SEARCH: void 0 }
  //       }
  //       // Gallery
  //       else if (rawEventName === 'onGalleryClick') {
  //         const item = e;
  //         return { SELECT_PHOTO: item }
  //       }
  //       // Photo detail
  //       else if (rawEventName === 'onPhotoClick') {
  //         return { EXIT_PHOTO: void 0 }
  //       }
  //       // System events
  //       else if (rawEventName === 'SEARCH_SUCCESS') {
  //         const items = e;
  //         return { SEARCH_SUCCESS: items }
  //       }
  //       else if (rawEventName === 'SEARCH_FAILURE') {
  //         return { SEARCH_FAILURE: void 0 }
  //       }
  //
  //       return NO_INTENT
  //     }),
  //     filter(x => x !== NO_INTENT)
  //   ),
  //   transitions: [
  //     { from: INIT_STATE, event: INIT_EVENT, to: 'start', action: NO_ACTIONS },
  //     { from: 'start', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
  //     {
  //       from: 'loading', event: 'SEARCH_SUCCESS', to: 'gallery', action: (extendedState, eventData, fsmSettings) =>
  // {
  //         const items = eventData;
  //
  //         return {
  //           updates: [{ op: 'add', path: '/items', value: items }],
  //           outputs: NO_OUTPUT
  //         }
  //       }
  //     },
  //     { from: 'loading', event: 'SEARCH_FAILURE', to: 'error', action: NO_ACTIONS },
  //     { from: 'loading', event: 'CANCEL_SEARCH', to: 'gallery', action: NO_ACTIONS },
  //     { from: 'error', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
  //     { from: 'gallery', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
  //     {
  //       from: 'gallery', event: 'SELECT_PHOTO', to: 'photo', action: (extendedState, eventData, fsmSettings) => {
  //         const item = eventData;
  //
  //         return {
  //           updates: [{ op: 'add', path: '/photo', value: item }],
  //           outputs: NO_OUTPUT
  //         }
  //       }
  //     },
  //     { from: 'photo', event: 'EXIT_PHOTO', to: 'gallery', action: NO_ACTIONS },
  //   ],
  //   entryActions: {
  //     loading: (extendedState, eventData, fsmSettings) => {
  //       const { items, photo } = extendedState;
  //       const query = eventData;
  //       const searchCommand = {
  //         command: COMMAND_SEARCH,
  //         params: query
  //       };
  //       const renderGalleryAction = renderAction(trigger =>
  //         h(GalleryApp, { query, items, trigger, photo, gallery: 'loading' }, [])
  //       );
  //
  //       return {
  //         outputs: [searchCommand, renderGalleryAction.outputs],
  //         updates: NO_STATE_UPDATE
  //       }
  //     },
  //     photo: renderGalleryApp('photo'),
  //     gallery: renderGalleryApp('gallery'),
  //     error: renderGalleryApp('error'),
  //     start: renderGalleryApp('start'),
  //   },
  //   commandHandlers: {
  //     [COMMAND_SEARCH]: obs => {
  //       return obs.pipe(switchMap(({ trigger, params }) => {
  //         const query = params;
  //         return runSearchQuery(query)
  //           .then(data => {
  //             trigger('SEARCH_SUCCESS')(data.items)
  //           })
  //           .catch(error => {
  //             trigger('SEARCH_FAILURE')(void 0)
  //           });
  //       }))
  //     }
  //   },
  //   inject: new Flipping(),
  //   componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) =>
  // {flipping.read();}, componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) =>
  // {flipping.flip();} },
};
export const xstateMachines = {
  xstateImageGallery: {
    preprocessor: rawEventSource => rawEventSource.pipe(
      startWith([INIT_EVENT]),
      map(ev => {
        const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);

        if (rawEventName === INIT_EVENT) {
          return { type: INIT_EVENT, data: void 0 }
        }
        // Form raw events
        else if (rawEventName === 'onSubmit') {
          e.persist();
          e.preventDefault();
          return { type: 'SEARCH', data: ref.current.value }
        }
        else if (rawEventName === 'onCancelClick') {
          return { type: 'CANCEL_SEARCH', data: void 0 }
        }
        // Gallery
        else if (rawEventName === 'onGalleryClick') {
          const item = e;
          return { type: 'SELECT_PHOTO', data: item }
        }
        // Photo detail
        else if (rawEventName === 'onPhotoClick') {
          return { type: 'EXIT_PHOTO', data: void 0 }
        }
        // System events
        else if (rawEventName === 'SEARCH_SUCCESS') {
          const items = e;
          return { type: 'SEARCH_SUCCESS', data: items }
        }
        else if (rawEventName === 'SEARCH_FAILURE') {
          return { type: 'SEARCH_FAILURE', data: void 0 }
        }

        return NO_INTENT
      }),
      filter(x => x !== NO_INTENT)
    ),
    // DOC : we kept the same machine but :
    // - added the render actions
    // - render must go last, in order to get the updated extended state
    // - added an init event to trigger an entry on the initial state
    config: {
      context: { query: '', items: [], photo: undefined, gallery: '' },
      initial: 'init',
      states: {
        init: {
          on: { [INIT_EVENT]: 'start' }
        },
        start: {
          onEntry: [renderGalleryAppImmer('start')],
          on: { SEARCH: 'loading' }
        },
        loading: {
          onEntry: ['search', renderGalleryAppImmer('loading')],
          on: {
            SEARCH_SUCCESS: { target: 'gallery', actions: ['updateItems'] },
            SEARCH_FAILURE: 'error',
            CANCEL_SEARCH: 'gallery'
          }
        },
        error: {
          onEntry: [renderGalleryAppImmer('error')],
          on: { SEARCH: 'loading' }
        },
        gallery: {
          onEntry: [renderGalleryAppImmer('gallery')],
          on: {
            SEARCH: 'loading',
            SELECT_PHOTO: 'photo'
          }
        },
        photo: {
          onEntry: ['setPhoto', renderGalleryAppImmer('photo')],
          on: { EXIT_PHOTO: 'gallery' }
        }
      }
    },
    actionFactoryMap: {
      'search': (extendedState, { data: query }, xstateAction) => {
        const searchCommand = { command: COMMAND_SEARCH, params: query };

        return {
          outputs: [searchCommand],
          updates: nothing
        }
      },
      'updateItems': (extendedState, { data: items }, xstateAction) => {
        return {
          updates: extendedState => {extendedState.items = items},
          outputs: NO_OUTPUT
        }
      },
      'setPhoto': (extendedState, { data: item }, xstateAction) => {
        return {
          updates: extendedState => {extendedState.photo = item},
          outputs: NO_OUTPUT
        }
      }
    },
    updateState: immerReducer,
    mergeOutputs: mergeOutputs,
    commandHandlers: {
      [COMMAND_SEARCH]: (trigger, query) => {
        return runSearchQuery(query)
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
