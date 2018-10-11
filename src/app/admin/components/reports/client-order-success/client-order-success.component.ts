import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-order-success',
  templateUrl: './client-order-success.component.html',
  styleUrls: ['./client-order-success.component.scss']
})
export class ClientOrderSuccessComponent implements OnInit {

  orderId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }

}
