import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralLayoutComponent } from '@core/layouts/general-layout/general-layout.component';
import { HomePageComponent } from '@client/components/home-page/home-page.component';
import { ServiceDetailsComponent } from '@client/components/service-details/service-details.component';
import { OurServicesComponent } from '@client/components/our-services/our-services.component';
import { OurContactsComponent } from '@client/components/our-contacts/our-contacts.component';
import { ProjectDetailsComponent } from '@client/components/project-details/project-details.component';
import { OurRecentProjectsComponent } from '@client/components/our-recent-projects/our-recent-projects.component';
import { ProductDetailsComponent } from '@client/components/product-details/product-details.component';
import { ProductListComponent } from '@client/components/product-list/product-list.component';
import { ClientShoppingCartComponent } from '@client/components/client-shopping-cart/client-shopping-cart.component';
import { ClientAuthGuard } from '@client/services/client-auth.guard';
import { ClientCheckOutComponent } from '@client/components/client-check-out/client-check-out.component';
import { ClientOrderSuccessComponent } from '@client/components/client-order-success/client-order-success.component';

const routes: Routes = [
    {
      path: '', redirectTo: '/home', pathMatch: 'full'
    },
    {
      path: '',
      component: GeneralLayoutComponent,
      data: {
        title: 'Mellence Impressions',
        description: 'Experts in interior and exterior decoration'
      },
      children: [
        {
          path: 'home',
          component: HomePageComponent,
          data: {
            title: 'Mellence Impressions | Home',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'service/:id',
          component: ServiceDetailsComponent
        }, {
          path: 'service-list',
          component: OurServicesComponent,
          data: {
            title: 'Mellence Impressions | Services',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'contact-us',
          component: OurContactsComponent,
          data: {
            title: 'Mellence Impressions | Contact-us',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'project/:id',
          component: ProjectDetailsComponent
        }, {
          path: 'projects',
          component: OurRecentProjectsComponent,
          data: {
            title: 'Mellence Impressions | Projects',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'product/:id',
          component: ProductDetailsComponent
        }, {
          path: 'products',
          component: ProductListComponent,
          data: {
            title: 'Mellence Impressions | Products',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'shopping-cart',
          component: ClientShoppingCartComponent,
          canActivate: [ClientAuthGuard],
          data: {
            title: 'Mellence Impressions | Shopping-Cart',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'check-out',
          component: ClientCheckOutComponent,
          canActivate: [ClientAuthGuard],
          data: {
            title: 'Mellence Impressions | Check-Out',
            description: 'Experts in interior and exterior decoration'
          }
        }, {
          path: 'order-success/:id',
          component: ClientOrderSuccessComponent,
          canActivate: [ClientAuthGuard],
          data: {
            title: 'Mellence Impressions | Order-Success',
            description: 'Experts in interior and exterior decoration'
          }
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }
