import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-order-success',
  templateUrl: './client-order-success.component.html',
  styleUrls: ['./client-order-success.component.scss']
})
export class ClientOrderSuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 6000);
  }

}
