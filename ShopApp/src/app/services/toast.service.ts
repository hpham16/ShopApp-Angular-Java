// toast.service.ts
import { Injectable, TemplateRef } from '@angular/core';

interface Toast {
  header: string;
  body: string;
  delay: number;
  classname: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(header: string, body: string, classname = '', delay = 5000) {
    this.toasts.push({ header, body, classname, delay });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
