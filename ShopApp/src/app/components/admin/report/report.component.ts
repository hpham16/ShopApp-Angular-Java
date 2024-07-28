import { Component, QueryList, ViewChildren } from '@angular/core';
import { Revenue } from 'src/app/models/revenue';
import { OrderService } from 'src/app/services/order.service';
import { AdminChartComponent } from '../../admin-chart/admin-chart.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbHighlight, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader, SortColumn, SortDirection, SortEvent } from 'src/app/directives/sortable.directive';
import { AppPage } from 'src/app/app.base';



const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(countries: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [AdminChartComponent, ReactiveFormsModule, CommonModule, NgbModule, FormsModule, NgbHighlight, NgbdSortableHeader, NgbPaginationModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent extends AppPage {
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  data: Revenue[] = [];
  filteredData: Revenue[] = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#333', // Change color of Y-axis labels
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#333', // Change color of X-axis labels
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }]
    }
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [];
  filterForm!: FormGroup;
  constructor(private fb: FormBuilder, private orderService: OrderService) {
    super();
    this.filterForm = this.fb.group({
      startMonthYear: [null],
      endMonthYear: [null]
    });

  }
  override ngOnInit() {
    this.orderService.getMonthRevenue().subscribe((orders) => {
      this.data = orders;
      this.filteredData = this.data
      this.prepareChartData();
    });
  }

  prepareChartData() {
    this.barChartLabels = this.filteredData.map(item => `${item.month}/${item.year}`);
    this.barChartData = [
      { data: this.filteredData.map(item => item.totalMoney), label: 'Total Money' },
      { data: this.filteredData.map(item => item.numberOfProducts), label: 'Number of Products' }
    ];
  }


  filterData() {
    const { startMonthYear, endMonthYear } = this.filterForm.value;
    if (!startMonthYear && !endMonthYear) {
      this.filteredData = this.data;
    } else {
      const startDate = startMonthYear ? new Date(startMonthYear.year, startMonthYear.month - 1) : null;
      const endDate = endMonthYear ? new Date(endMonthYear.year, endMonthYear.month - 1) : null;
      this.filteredData = this.data.filter(item => {
        const itemDate = new Date(item.year, Number(item.month) - 1);
        return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
      });
    }
    this.prepareChartData();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this._state.sortColumn = column;
    this._state.sortDirection = direction;
  }
}
