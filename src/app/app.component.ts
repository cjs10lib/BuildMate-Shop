import { MetaService } from './core/services/meta.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';

  constructor(private meta: MetaService) {
    this.meta.updateTitle();
  }

}
