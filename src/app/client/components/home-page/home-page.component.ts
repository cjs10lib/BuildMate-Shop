import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  gallery = [
    { url: '../../../assets/carousel/carousel1.jpg' },
    { url: '../../../assets/carousel/carousel2.jpg' },
    { url: '../../../assets/carousel/carousel3.jpg' },
    { url: '../../../assets/carousel/carousel4.jpg' },
    { url: '../../../assets/carousel/carousel5.jpg' },
    { url: '../../../assets/carousel/carousel6.jpg' },
    { url: '../../../assets/carousel/carousel7.jpg' },
    { url: '../../../assets/carousel/carousel8.jpg' },
    { url: '../../../assets/carousel/carousel9.jpg' },
  ];
  constructor() { }

  ngOnInit() {
  }
}
