import { NO_OUTPUT } from "state-transducer";

export const CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE = `Model update function must return valid update operations!`;
export const ERR_ACTION_EXECUTOR_COMMAND_EXEC = command => (`Cannot find valid executor for command ${command}`)
export const COMMAND_RENDER = 'render';
export const NO_MODEL_UPDATE = [];
export const BUTTON_CLICKED = 'button_clicked';
export const KEY_PRESSED = 'key_pressed';
export const INPUT_KEY_PRESSED = 'input_key_pressed';
export const ENTER_KEY_PRESSED = 'enter_key_pressed';
export const INPUT_CHANGED = 'input_changed';
export const NO_ACTIONS = () => ({ outputs: NO_OUTPUT, updates: NO_MODEL_UPDATE });
export const KEY_ENTER = `Enter`;
export const NO_INTENT = null;
