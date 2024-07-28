import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {


  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    // Handle form submission
    console.log('Form submitted', this.contactForm);
    alert('Thank you for contacting us!');
    this.contactForm = { name: '', email: '', message: '' };
  }
}
