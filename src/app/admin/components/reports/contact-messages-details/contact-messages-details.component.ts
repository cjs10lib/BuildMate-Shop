
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ContactUs } from '@client/models/contact-us.model';

@Component({
  selector: 'app-contact-messages-details',
  templateUrl: './contact-messages-details.component.html',
  styleUrls: ['./contact-messages-details.component.scss']
})
export class ContactMessagesDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ContactUs) { }

  ngOnInit() {
  }

}
