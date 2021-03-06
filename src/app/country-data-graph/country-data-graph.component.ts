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

  public chartOptions$: Observable<any>;

  public barChartData$: Observable<any[]>;
  public barChartLabels$: Observable<any[]>;

  public barChartOptions: any = {
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
      yAxes: [ {
        ticks: {
          beginAtZero: true
        }
      } ]
    }
  };
  public barChartColors: Array<any> = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
  ];
  public barChartLegend: boolean = true;
  public barChartType: string = 'bar';

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
    this.chartOptions$ = this
      .result$
      .map(result => {
        return {
          title: { text: `Adjusted value of ${result.amount} in ${result.year}` },
          plotOptions: {
            series: {
              animation: {
                duration: 200,
              }
            }
          },
          xAxis: {
            type: 'linear',
          },
          series: [ {
            name: 'Adjusted value',
            data: result
              .adjustedValues
              .map((value, index) => {
                console.warn(value, index);
                if (index === result.year) {
                  return {
                    y: value,
                    x: index,
                    color: '#BF0B23',
                    marker: { fillColor: '#BF0B23', radius: 7 },
                  };
                }
                if (index === result.actualizedYear) {
                  return {
                    y: value,
                    x: index,
                    color: '#1bbf14',
                    marker: { fillColor: '#17bf2a', radius: 7 },
                  };
                }

                return { y: value, x: index };
              })
              .toArray(),
            tooltip: {
              formatter: (a, b, c, d, e, f) => {
                console.warn(a, b, c, d, e, f);
                `${Math.round(1 * 100) / 100}`;
              }
            }
          } ]
        }
      });

    this.lineChartLabels$ = this
      .result$
      .map(result => result.adjustedValues.keySeq().toArray());

    this.barChartData$ = this
      .result$
      .map(result => [
          {
            data: [ result.adjustedValues.get(result.year), result.adjustedValues.get(result.actualizedYear), ],
            label: 'Adjusted buying power',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
            ],
          },
        ]
      );

    this.barChartLabels$ = this
      .result$
      .map(result => [ result.year, result.actualizedYear, ]);

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
    this.chartOptions$.subscribe(console.log.bind(this));
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
