import { Router } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { ContactUs } from '@client/models/contact-us.model';
import { ContactUsService } from '@client/services/contact-us.service';

@Component({
  selector: 'app-our-contacts',
  templateUrl: './our-contacts.component.html',
  styleUrls: ['./our-contacts.component.scss']
})
export class OurContactsComponent implements OnInit {

  @Input() showBreadcrum = true;

  pageHeader = 'Contact Us';
  pageText = ``;

  contact: ContactUs = {
    resolved: false
  };

  constructor(private alertService: AlertService,
              private contactUsService: ContactUsService,
              private router: Router) { }

  ngOnInit() {
  }

  async onSubmit() {
    const confirm = await this.alertService.contactUs();
    if (confirm.value) {
      await this.contactUsService.addContact(this.contact);

      this.alertService.contactUsSuccess(this.contact);
      this.router.navigate(['/']);
    }
  }
}
