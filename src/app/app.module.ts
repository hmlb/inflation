import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { WorldbankDataProvider } from './inflation/worldbank.data.provider';
import { DataRepository } from './inflation/data.repository';
import { CountryDataGraphComponent } from './country-data-graph/country-data-graph.component';
import { ChartsModule } from 'ng2-charts';
import { StoreModule } from '@ngrx/store';
import { inflationReducer } from './inflation/inflation';
import { EffectsModule } from '@ngrx/effects';
import { InflationEffects } from './inflation/inflation.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CountryDataGraphComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ChartsModule,
    Ng2AutoCompleteModule,
    StoreModule.provideStore({ inflation: inflationReducer }),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    }),
    EffectsModule.run(InflationEffects)
  ],
  providers: [
    DataRepository,
    WorldbankDataProvider,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
