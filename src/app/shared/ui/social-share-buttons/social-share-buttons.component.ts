import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-social-share-buttons',
  templateUrl: './social-share-buttons.component.html',
  styleUrls: ['./social-share-buttons.component.scss']
})
export class SocialShareButtonsComponent implements OnInit {

  @Input() pageUrl: string;
  @Input() iconSize: number;
  @Input() count = true;
  // @Input() showIcons: number;

  constructor() { }

  ngOnInit() {
  }

}
