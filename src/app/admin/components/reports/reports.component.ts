import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  navLinks = [
    { path: 'sales-log', label: 'Sales Log', icon: 'assessment' },
    { path: 'purchase-log', label: 'Purchase Log', icon: 'assessment' }
  ];

  selectedTab: string;
  parentUrl = `account/reports/`;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLinkClick(event: MatTabChangeEvent) {
    const tabTitle = event.tab.textLabel;
    const routerLink = this.navLinks.find(n => n.label === tabTitle ).path;

    this.router.navigate([this.parentUrl, routerLink]);
  }

}
