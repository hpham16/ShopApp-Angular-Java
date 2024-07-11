// carousel.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {


  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
    },
    nav: false,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 3000, // Set autoplay delay (3000ms = 3s)
    autoplayHoverPause: true // Pause on hover
  };
  slidesStore: any[] = [
    {
      id: '1',
      img: 'assets/img/carousel/1.avif',
      alt: 'Image 1'
    },
    {
      id: '2',
      img: 'assets/img/carousel/2.avif',
      alt: 'Image 2'
    },
    {
      id: '3',
      img: 'assets/img/carousel/3.avif',
      alt: 'Image 3'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
