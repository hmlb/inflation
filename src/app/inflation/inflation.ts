import { Action } from '@ngrx/store';
import { Map } from 'immutable';

export const QUERY = 'INFLATION_QUERY';
export const UPDATE_RESULT = 'INFLATION_UPDATE_RESULT';
export const RESET = 'INFLATION_RESET';

export interface InflationState extends Map<string, any> {

}

const defaultState = Map<string, any>({
  processing: false,
  lastRequest: null,
  result: null,
});

export function inflationReducer(state: InflationState = defaultState, action: Action) {
  switch (action.type) {
    case QUERY:
      return state.set('processing', true).set('lastRequest', action.payload);

    case UPDATE_RESULT:
      return state.set('processing', false).set('result', action.payload);

    case RESET:
      return defaultState;

    default:
      return state;
  }
}
