import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { QUERY, UPDATE_RESULT } from './inflation';
import { DataRepository } from './data.repository';

@Injectable()
export class InflationEffects {

  constructor(
    private repository: DataRepository,
    private actions$: Actions
  ) {
  }

  @Effect() public login$ = this
    .actions$
    // Listen for the 'LOGIN' action
    .ofType(QUERY)
    // Map the payload into JSON to use as the request body
    .do(console.log.bind(this))
    .switchMap(action => Observable
      .combineLatest(
        this.repository.forCountry(action.payload.country),
        Observable.of(action.payload),
      )
      .map(([ data, query ]) => {
        const adjustedValues = data.adjustedValue(query.year, query.amount);
        return Object.assign({}, query, {
          data,
          adjustedValues,
          actualizedAmount: adjustedValues.get(query.actualizedYear)
        });
      })
      .map(res => ({ type: UPDATE_RESULT, payload: res }))
      .catch(() => Observable.of({ type: UPDATE_RESULT, payload: null }))
    );
}
