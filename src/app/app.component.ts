import { Component, OnInit } from '@angular/core';
import { DataRepository } from './inflation/data.repository';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { DataResult } from './inflation/data.result';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { QUERY } from './inflation/inflation';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  public form: FormGroup;
  public countries$: Observable<Map<string, string>>;
  public selectableCountries$: Observable<any[]>;
  public queryResult$: Observable<DataResult>;

  constructor(
    private repository: DataRepository,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.queryResult$ = this.repository.result();
  }

  public ngOnInit() {
    this.countries$ = this.repository.countries();
    this.selectableCountries$ = this.countries$
      .map(countries => {
        return countries
          .map((name, id) => {
            return {
              id,
              name,
            };
          })
          .toArray();
      });

    this.form = this.formBuilder.group({
      country: new FormControl({ id: 'USA', name: 'United States' }, Validators.required),
      amount: new FormControl(1000, Validators.required),
      year: new FormControl(1965, Validators.required),
      actualizedYear: new FormControl(2016, Validators.required),
    });

    Observable
      .combineLatest([ this.form.valueChanges, this.form.statusChanges ])
      .filter(([ data, status ]) => status === 'VALID')
      .switchMap(([ data ]) => Observable.combineLatest(Observable.of(data), this.countries$))
      .filter(([ data, countries ]) => countries.has(data.country.id))
      .map(([ data ]) => {
        return {
          year: data.year,
          country: data.country.id,
          amount: data.amount,
          actualizedYear: data.actualizedYear,
        };
      })
      .debounceTime(400)
      .subscribe((query) => {
        this.store.dispatch({
          type: QUERY,
          payload: query,
        })
      });

    if (this.form.valid) {
      this.store.dispatch({
        type: QUERY,
        payload: {
          year: this.form.value.year,
          country: this.form.value.country,
          amount: this.form.value.amount,
          actualizedYear: this.form.value.actualizedYear,
        },
      });
    }

    this.queryResult$.subscribe(console.log.bind(this));
  }

  public formatCountrySearch(data: any): string|SafeHtml {
    return data.name;
    //return this.sanitizer.bypassSecurityTrustHtml(data.value);
  }
}
