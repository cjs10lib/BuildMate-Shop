import { ContactMessagesDetailsComponent } from './../contact-messages-details/contact-messages-details.component';
import { ContactUsService } from '@client/services/contact-us.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactUs } from '@client/models/contact-us.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.scss']
})
export class ContactMessagesComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  contacts: ContactUs[] = [];
  filteredContacts: ContactUs[] = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private contactUsService: ContactUsService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.subscription = this.contactUsService.getContacts().subscribe(contacts => {
      this.showSpinner = false;
      this.contacts = this.filteredContacts = contacts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  contactDetails(contact: ContactUs) {
    this.dialog.open(ContactMessagesDetailsComponent, {
      width: '500px',
      data: contact
    }).afterClosed().pipe(take(1)).subscribe(() => this.updateContact(contact.id));
  }

  async updateContact(contactId: string) {
    await this.contactUsService.updateContact(contactId);
  }

  search(qry: string) {

    this.filteredContacts = qry ?
    this.contacts.filter(
      p => p.name.toLowerCase().includes(qry.toLowerCase())) : this.contacts;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
