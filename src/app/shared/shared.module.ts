
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialShareButtonsComponent } from '@shared/ui/social-share-buttons/social-share-buttons.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TextSummaryPipe } from '@shared/pipes/text-summary.pipe';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { BreadcrumComponent } from '@shared/components/breadcrum/breadcrum.component';
import { CarouselComponent } from '@client/components/carousel/carousel.component';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialPasswordStrengthModule } from 'ngx-material-password-strength';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
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
