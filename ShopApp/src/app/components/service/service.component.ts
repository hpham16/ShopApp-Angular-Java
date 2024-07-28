import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  selectedService: any;

  toggleDetails(service: string) {
    this.selectedService = this.selectedService === service ? null : service;
  }
}
