import { NgModule } from '@angular/core';
import { ClientRoutingModule } from '@client/client-routing.module';
import { ClientCheckOutComponent } from '@client/components/client-check-out/client-check-out.component';
import { ClientOrderSuccessComponent } from '@client/components/client-order-success/client-order-success.component';
import { ClientShoppingCartComponent } from '@client/components/client-shopping-cart/client-shopping-cart.component';
import { HomePageComponent } from '@client/components/home-page/home-page.component';
import { OurContactsComponent } from '@client/components/our-contacts/our-contacts.component';
import { OurRecentProjectsComponent } from '@client/components/our-recent-projects/our-recent-projects.component';
import { OurServicesComponent } from '@client/components/our-services/our-services.component';
import { ProductCardComponent } from '@client/components/product-card/product-card.component';
import { ProductDetailsComponent } from '@client/components/product-details/product-details.component';
import { ProductListComponent } from '@client/components/product-list/product-list.component';
import { ProjectDetailsComponent } from '@client/components/project-details/project-details.component';
import { ServiceDetailsComponent } from '@client/components/service-details/service-details.component';
import { WhyChooseUsComponent } from '@client/components/why-choose-us/why-choose-us.component';

import { SharedModule } from './../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    ClientRoutingModule
  ],
  declarations: [
    ClientCheckOutComponent,
    ClientOrderSuccessComponent,
    ClientShoppingCartComponent,

    HomePageComponent,
    OurContactsComponent,
    OurRecentProjectsComponent,
    OurServicesComponent,
    ProductCardComponent,
    ProductDetailsComponent,
    ProductListComponent,
    ProjectDetailsComponent,
    ServiceDetailsComponent,
    WhyChooseUsComponent
  ]
})
export class ClientModule { }
