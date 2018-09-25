import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-order-add-qty',
  templateUrl: './client-order-add-qty.component.html',
  styleUrls: ['./client-order-add-qty.component.scss']
})
export class ClientOrderAddQtyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  check(event: KeyboardEvent, input: number) {
    if (event.keyCode > 31 && input.toString().length === 10) {
      event.preventDefault();
    }
  }

}
