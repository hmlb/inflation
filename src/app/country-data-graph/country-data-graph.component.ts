import { Component, OnInit } from '@angular/core';
import { DataRepository } from '../inflation/data.repository';
import { Observable } from 'rxjs';
import { DataResult } from '../inflation/data.result';

@Component({
  selector: 'app-country-data-graph',
  templateUrl: './country-data-graph.component.html',
  styleUrls: [ './country-data-graph.component.scss' ]
})
export class CountryDataGraphComponent implements OnInit {

  public result$: Observable<DataResult>;
  public details$: Observable<any>;


  public lineChartData$: Observable<any[]>;
  public lineChartLabels$: Observable<any[]>;

  public lineChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
    },
    hover: {
      mode: 'nearest',
    },
    animation: {
      duration: 400,
    },
    scales: {
      // xAxes: [ {
      //   type: 'linear',
      //   position: 'bottom'
      // } ]
    },
  };
  public lineChartColors: Array<any> = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(
    private dataRepository: DataRepository
  ) {
    this.result$ = this.dataRepository.result();
  }

  public ngOnInit() {

    this.lineChartData$ = this
      .result$
      .map(result => [
          {
            data: result.adjustedValues.valueSeq().toArray(),

            label: 'Adjusted buying power',
          },
          // {
          //   data: [ { x: result.year, y: result.adjustedValues.get(result.year) } ],
          //   label: 'Reference year',
          // },
          // {
          //   data: [ { x: result.actualizedYear, y: result.adjustedValues.get(result.actualizedYear) } ],
          //   label: 'Adjusted year',
          // },
        ]
      );

    this.lineChartLabels$ = this
      .result$
      .map(result => result.adjustedValues.keySeq().toArray());

    this.details$ = this
      .result$
      .map(result => {
        return result
          .adjustedValues
          .reverse()
          .map((value, year) => {
            return {
              year,
              value,
              inflation: result.data.inflation(year),
              isBaseYear: year === result.year,
              isActualizedYear: year === result.actualizedYear,
            };
          })
          .toArray();
      });
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
