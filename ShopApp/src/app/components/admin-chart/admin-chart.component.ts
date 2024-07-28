import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './admin-chart.component.html',
  styleUrl: './admin-chart.component.scss'
})
export class AdminChartComponent implements OnInit {
  @Input() barChartLabels: string[] = [];
  @Input() barChartData: any[] = [];
  @Input() barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  @Input() barChartType: string = 'bar';
  @Input() barChartLegend: boolean = true;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ngOnInit() {}
}
