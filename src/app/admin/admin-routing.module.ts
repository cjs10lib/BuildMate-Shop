import { ReportsComponent } from './components/reports/reports.component';
import { NewLoginComponent } from '@admin/auth/new-login/new-login.component';
import { DashboardComponent } from '@admin/components/dashboard/dashboard.component';
import { ManageStockComponent } from '@admin/components/products/manage-stock/manage-stock.component';
import { ProductFormComponent } from '@admin/components/products/product-form/product-form.component';
import { ProductProfileComponent } from '@admin/components/products/product-profile/product-profile.component';
import { ProductRegistryComponent } from '@admin/components/products/product-registry/product-registry.component';
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
import {
  StaffTransactionLogComponent,
} from '@admin/components/transactions/staff-transaction-log/staff-transaction-log.component';
import { AuthGuard } from '@admin/services/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '@core/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@core/layouts/auth-layout/auth-layout.component';
import { SalesLogComponent } from '@admin/components/reports/sales-log/sales-log.component';
import { PurchaseLogComponent } from '@admin/components/reports/purchase-log/purchase-log.component';
import { StaffOrderLogComponent } from '@admin/components/reports/staff-order-log/staff-order-log.component';
import { ClientOrderSuccessComponent } from './components/reports/client-order-success/client-order-success.component';

const routes: Routes = [
    {
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
      path: '**', redirectTo: '/account/dashboard', pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
