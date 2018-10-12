import { StaffInvoiceComponent } from './admin/components/reports/staff-invoice/staff-invoice.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ProjectFormComponent } from '@admin/components/project/project-form/project-form.component';
import { ProjectRegistryComponent } from '@admin/components/project/project-registry/project-registry.component';
import { ClientOrdersComponent } from '@admin/components/reports/client-orders/client-orders.component';
import { ContactMessagesComponent } from '@admin/components/reports/contact-messages/contact-messages.component';
import { ServiceFormComponent } from '@admin/components/service/service-form/service-form.component';
import { ServiceRegistryComponent } from '@admin/components/service/service-registry/service-registry.component';
import { StaffFormComponent } from '@admin/components/staffs/staff-form/staff-form.component';
import { StaffProfileComponent } from '@admin/components/staffs/staff-profile/staff-profile.component';
import { StaffsRegistryComponent } from '@admin/components/staffs/staffs-registry/staffs-registry.component';
import { CheckOutComponent } from '@admin/components/transactions/check-out/check-out.component';
import { OrderSuccessComponent } from '@admin/components/transactions/order-success/order-success.component';
import { PosComponent } from '@admin/components/transactions/pos/pos.component';
import {
  ProductTransactionLogComponent,
} from '@admin/components/transactions/product-transaction-log/product-transaction-log.component';
import { ShoppingCartComponent } from '@admin/components/transactions/shopping-cart/shopping-cart.component';
import { StaffOrderRemitComponent } from '@admin/components/transactions/staff-order-remit/staff-order-remit.component';
import { StaffTransactionLogComponent } from '@admin/components/transactions/staff-transaction-log/staff-transaction-log.component';
import { NewLoginComponent } from '@admin/auth/new-login/new-login.component';
import { ClientShoppingCartComponent } from '@client/components/client-shopping-cart/client-shopping-cart.component';
import { HomePageComponent } from '@client/components/home-page/home-page.component';
import { OurContactsComponent } from '@client/components/our-contacts/our-contacts.component';
import { OurRecentProjectsComponent } from '@client/components/our-recent-projects/our-recent-projects.component';
import { OurServicesComponent } from '@client/components/our-services/our-services.component';
import { ProductDetailsComponent } from '@client/components/product-details/product-details.component';
import { ProductListComponent } from '@client/components/product-list/product-list.component';
import { ProjectDetailsComponent } from '@client/components/project-details/project-details.component';
import { ServiceDetailsComponent } from '@client/components/service-details/service-details.component';
import { AdminLayoutComponent } from '@core/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@core/layouts/auth-layout/auth-layout.component';
import { GeneralLayoutComponent } from '@core/layouts/general-layout/general-layout.component';
import { AuthGuard } from '@admin/services/auth.guard';
import { ClientAuthGuard } from '@client/services/client-auth.guard';
import { ProductProfileComponent } from '@admin/components/products/product-profile/product-profile.component';
import { ProductFormComponent } from '@admin/components/products/product-form/product-form.component';
import { ManageStockComponent } from '@admin/components/products/manage-stock/manage-stock.component';
import { ProductRegistryComponent } from '@admin/components/products/product-registry/product-registry.component';
import { ClientCheckOutComponent } from '@client/components/client-check-out/client-check-out.component';
import { ReportsComponent } from '@admin/components/reports/reports.component';
import { SalesLogComponent } from '@admin/components/reports/sales-log/sales-log.component';
import { PurchaseLogComponent } from '@admin/components/reports/purchase-log/purchase-log.component';
import { StaffOrderLogComponent } from '@admin/components/reports/staff-order-log/staff-order-log.component';
import { ClientOrderSuccessComponent } from '@admin/components/reports/client-order-success/client-order-success.component';
import { ClientOrderBookingSuccessComponent } from '@client/components/client-order-booking-success/client-order-booking-success.component';
import { ClientLocalCheckoutComponent } from '@admin/components/transactions/client-local-checkout/client-local-checkout.component';

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
        component: ClientOrderBookingSuccessComponent,
        canActivate: [ClientAuthGuard],
        data: {
          title: 'Mellence Impressions | Order-Success',
          description: 'Experts in interior and exterior decoration'
        }
      }
    ]
  }, {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: NewLoginComponent
      }
    ]
  }, {
    path: 'account',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      }, {
        path: 'product/:id',
        component: ProductProfileComponent,
        children: [
          {
            path: 'transaction-log',
            component: ProductTransactionLogComponent
          }, {
            path: 'edit-product',
            component: ProductFormComponent
          }, {
            path: 'manage-stock',
            component: ManageStockComponent
          }
        ]
      }, {
        path: 'services',
        component: ServiceRegistryComponent
      }, {
        path: 'service-form/:id',
        component: ServiceFormComponent
      }, {
        path: 'service-form',
        component: ServiceFormComponent
      }, {
        path: 'projects',
        component: ProjectRegistryComponent
      }, {
        path: 'project-form/:id',
        component: ProjectFormComponent
      }, {
        path: 'project-form',
        component: ProjectFormComponent
      }, {
        path: 'products',
        component: ProductRegistryComponent,
      }, {
        path: 'product-form',
        component: ProductFormComponent
      }, {
        path: 'staff/:id',
        component: StaffProfileComponent,
        children: [
          {
            path: 'transaction-log',
            component: StaffTransactionLogComponent
          }, {
            path: 'staff-update',
            component: StaffFormComponent
          }, {
            path: 'order-remit',
            component: StaffOrderRemitComponent
          }
        ]
      }, {
        path: 'staffs',
        component: StaffsRegistryComponent
      }, {
        path: 'staff-form',
        component: StaffFormComponent
      }, {
        path: 'pos',
        component: PosComponent
      }, {
        path: 'shopping-cart',
        component: ShoppingCartComponent
      }, {
        path: 'client-local-check-out',
        component: ClientLocalCheckoutComponent
      }, {
        path: 'check-out',
        component: CheckOutComponent
      }, {
        path: 'order-success/:id',
        component: OrderSuccessComponent
      }, {
        path: 'contact-messages',
        component: ContactMessagesComponent
      }, {
        path: 'client-order-success/:id',
        component: ClientOrderSuccessComponent
      }, {
        path: 'client-orders',
        component: ClientOrdersComponent
      }, {
        path: 'reports',
        component: ReportsComponent,
        children: [
          {
            path: 'sales-log',
            component: SalesLogComponent
          }, {
            path: 'purchase-log',
            component: PurchaseLogComponent
          }
        ]
      }
    ]
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
