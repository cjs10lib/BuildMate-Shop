import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselComponent } from '@client/components/carousel/carousel.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { BreadcrumComponent } from '@shared/components/breadcrum/breadcrum.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { TextSummaryPipe } from '@shared/pipes/text-summary.pipe';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { SocialShareButtonsComponent } from '@shared/ui/social-share-buttons/social-share-buttons.component';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { NgxMaterialPasswordStrengthModule } from 'ngx-material-password-strength';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MaterialModule } from '../material.module';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
  imports: [
    SharedRoutingModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,

    PerfectScrollbarModule,

    // @ngx-share/buttons
    HttpClientModule,       // (Required) For share counts
    HttpClientJsonpModule,  // (Optional) Add if you want tumblr share counts
    ShareButtonsModule.forRoot(),

    NgxMaterialPasswordStrengthModule,
    NgxHmCarouselModule,
  ],
  declarations: [
    BreadcrumComponent,
    CarouselComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    SocialShareButtonsComponent,
    TextSummaryPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgxMaterialPasswordStrengthModule,

    PerfectScrollbarModule,

    BreadcrumComponent,
    CarouselComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    SocialShareButtonsComponent,
    TextSummaryPipe,
  ]
})
export class SharedModule { }
