import { Subscription } from 'rxjs';
import { SummarySale } from '@admin/models/summary-sales.model';
import { SummarySaleService } from '@admin/services/summary-sale.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  saleSummary: SummarySale[] = [];

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    showScale: false,
    scales: {
      xAxes: [{
        gridLines: {
          display : false
        },
        ticks: {
          beginAtZero: true
        }
      }],
      yAxes: [{
        gridLines: {
          display : false
        }
      }]
    }
  };
  barChartLabels: string[] = [];
  // barChartType: string = 'horizontalBar';
  barChartType = 'line';
  barChartLegend = true;
  barChartData = [
    {
      label: '# Sales',
      data: []
    }
  ];

  loaded = false;

  subscription: Subscription;

  constructor(private saleSummaryService: SummarySaleService) { }

  ngOnInit() {
    this.subscription = this.saleSummaryService.getSaleSummaryCurrentYear().subscribe(summary => {
      this.saleSummary = summary;

      this.populateChart(this.saleSummary);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sortChartLabels(chartLabels: SummarySale[]) {
    const order = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return chartLabels.sort((a, b) => {
      return order.indexOf( a.month ) - order.indexOf( b.month );
    });

  }

  populateChart(chartObj: SummarySale[]) {

    const _sortItems = this.sortChartLabels(chartObj);
    const _data = _sortItems.map(item => item.total);

    this.barChartLabels = _sortItems.map(item => item.month);
    this.barChartData.map(item => {
      item.data = _data;
    });

    this.loaded = true;
  }

}
