import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-order-booking-success',
  templateUrl: './client-order-booking-success.component.html',
  styleUrls: ['./client-order-booking-success.component.scss']
})
export class ClientOrderBookingSuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 6000);
  }

}
