import { Injectable } from '@angular/core';
import { WorldbankDataProvider } from './worldbank.data.provider';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { InflationData } from './inflation.data';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { DataResult } from './data.result';
import { InflationState } from './inflation';

/**
 * Data access service acting as a facade for inflation data providers.
 *
 * Centralizes Store select logic.
 */
@Injectable()
export class DataRepository {

  constructor(
    private provider: WorldbankDataProvider,
    private store: Store<AppState>
  ) {
  }

  public result(): Observable<DataResult> {
    return this.store
      .select('inflation')
      .map((state: InflationState) => state.get('result'))
      .filter(result => result !== null)
      .distinctUntilChanged();
  }

  public countries(): Observable<Map<string, string>> {
    return this
      .all()
      .map(all => all
        .map((line: InflationData) => line.countryName)
        .sort()
      )
      .publishReplay(1)
      .refCount();
  }

  public all(): Observable<Map<string, InflationData>> {
    return this
      .provider
      .inflationData()
      .map(data => {
        let result = Map<string, InflationData>();
        data.forEach(line => result = result.set(line.countryCode, line));

        return result;
      })
      .publishReplay(1)
      .refCount();
  }

  public forCountry(country: string): Observable<InflationData> {
    return this
      .all()
      .map(all => {
        if (!all.has(country)) {
          throw new Error('No data for this country');
        }
        return all.get(country);
      });
  }
}
