import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-digital-result',
  templateUrl: './digital-result.component.html',
  styleUrls: ['./digital-result.component.scss'],

})
export class DigitalResultComponent implements OnInit {
  page = 1;
  isClicked = false;

  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 7,
    scrollbar: true,
    navigation: true,
    pagination: false,
    breakpoints: {
      1024: {
        slidesPerView: 7,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 7,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 6,
        spaceBetween: 9
        ,
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
      320: {
        slidesPerView: 3,
        spaceBetween: 9,
      }
    }
  };

  constructor() {}

  ngOnInit() {}
  clicked() {
    this.isClicked = !this.isClicked;
  }

}
