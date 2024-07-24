import { Component } from '@angular/core';
import { AdminChartComponent } from '../../admin-chart/admin-chart.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [AdminChartComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {

}
