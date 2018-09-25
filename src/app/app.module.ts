import { AdminModule } from '@admin/admin.module';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientModule } from '@client/client.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ChartsModule } from 'ng2-charts';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { NgxMaterialPasswordStrengthModule } from 'ngx-material-password-strength';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { MaterialModule } from './material.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    DropZoneDirective
  ],
  imports: [
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,

    ChartsModule,
    FlexLayoutModule,
    FormsModule,
    NgxMaterialPasswordStrengthModule.forRoot(),
    ReactiveFormsModule,
    PerfectScrollbarModule,

    NgxHmCarouselModule,
    Ng2ImgMaxModule,

    AppRoutingModule,
    BrowserAnimationsModule,

    SharedModule,
    AdminModule,
    ClientModule,
    CoreModule,
    MaterialModule
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
