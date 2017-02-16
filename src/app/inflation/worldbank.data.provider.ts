import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InflationData } from './inflation.data';
import { OrderedMap } from 'immutable';
import { Location } from '@angular/common';

@Injectable()
export class WorldbankDataProvider {
  private readonly endpoint = '/assets/data/worldbank.inflation.data.csv';

  constructor(
    private http: Http,
    private location: Location
  ) {
  }

  public inflationData(): Observable<InflationData[]> {
    return this.http.get(this.location.prepareExternalUrl(this.endpoint))
      .map(this.extractData)
      .map(this.convertData)
      .publishReplay(1)
      .refCount();
  }

  private extractData(res: Response): string[][] {
    return res
      .text()
      .split('\n')
      .map(
        line => line
          .split(',')
          .map(cell => cell.replace(/"/g, ''))
      );
  }

  private convertData(raw: string[][]): InflationData[] {
    // The last value of years is empty in the dataset.
    const years = raw[ 0 ].map(y => Number(y)).slice(0, -1);

    // First row is headers, last is empty.
    return raw.slice(1, -1).map(line => {
      // First two data are country name and country code.
      let inflation = OrderedMap<number, number>();
      for (let i = 2; i < years.length; i++) {
        if (line[ i ].length === 0) {
          continue;
        }

        inflation = inflation.set(years[ i ], Number(line[ i ]));
      }

      return new InflationData(line[ 1 ], line[ 0 ], inflation)
    });
  }
}
