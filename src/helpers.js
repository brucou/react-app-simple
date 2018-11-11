import { applyPatch } from "json-patch-es6";
import { COMMAND_RENDER, CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE, NO_STATE_UPDATE } from "./properties";
import React from 'react';
import { GalleryApp } from "./fixtures/sample-components"
import h from "react-hyperscript"
import fetchJsonp from "fetch-jsonp"
import produce, { nothing } from "immer"

export function isBoolean(obj) {return typeof(obj) === 'boolean'}

export function isUpdateOperation(obj) {
  return (typeof(obj) === 'object' && Object.keys(obj).length === 0) ||
    (
      ['add', 'replace', 'move', 'test', 'remove', 'copy'].some(op => obj.op === op) &&
      typeof(obj.path) === 'string'
    )
}

export function isArrayOf(predicate) {return obj => Array.isArray(obj) && obj.every(predicate)}

export function isArrayUpdateOperations(obj) {
  return isEmptyArray(obj) || isArrayOf(isUpdateOperation)(obj)
}

export function isEmptyArray(obj) {return Array.isArray(obj) && obj.length === 0}

export function assertContract(contractFn, contractArgs, errorMessage) {
  const boolOrError = contractFn.apply(null, contractArgs)
  const isPredicateSatisfied = isBoolean(boolOrError) && boolOrError;

  if (!isPredicateSatisfied) {
    throw new Error(`assertContract: fails contract ${contractFn.name}\n${errorMessage}\n ${boolOrError}`)
  }
  return true
}

/**
 *
 * @param {ExtendedState} extendedState
 * @param {Operation[]} extendedStateUpdateOperations
 * @returns {ExtendedState}
 */
export function applyJSONpatch(extendedState, extendedStateUpdateOperations) {
  assertContract(isArrayUpdateOperations, [extendedStateUpdateOperations],
    `applyUpdateOperations : ${CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE}`);

  // NOTE : we don't validate operations, to avoid throwing errors when for instance the value property for an
  // `add` JSON operation is `undefined` ; and of course we don't mutate the document in place
  return applyPatch(extendedState, extendedStateUpdateOperations || [], false, false).newDocument;
}

export function identity(x) {return x}

/**
 *
 * @param Component
 * @param {Object} [props={}]
 * @returns {RenderCommand}
 */
export function renderCommandFactory(Component, props = {}) {
  return {
    command: COMMAND_RENDER,
    params: trigger => React.createElement(Component, props, null)
  }
}

export function renderAction(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: NO_STATE_UPDATE }
}
export function renderActionImmer(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: nothing }
}

export function getEventName(eventStruct) {
  return eventStruct[0]
}

export function getEventData(eventStruct) {
  return eventStruct[1]
}

export function runSearchQuery(query) {
  const encodedQuery = encodeURIComponent(query);

  return fetchJsonp(
    `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
    { jsonpCallback: 'jsoncallback' }
  )
    .then(res => res.json())
}

export function renderGalleryApp(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  }
}

export function renderGalleryAppImmer(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderActionImmer(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  }
}

export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}

export const NO_IMMER_UPDATES = nothing;
export const immerReducer = function (extendedState, updates) {
  if (updates === NO_IMMER_UPDATES) return extendedState
  const updateFn = updates;
  return produce(extendedState, updateFn)
};

export const mergeOutputs = function (accOutputs, outputs) {
  return (accOutputs || []).concat(outputs || [])
};
