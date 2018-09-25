import { AdminRoutingModule } from '@admin/admin-routing.module';
import { AssignRoleComponent } from '@admin/auth/assign-role/assign-role.component';
import { NewLoginComponent } from '@admin/auth/new-login/new-login.component';
import { ChartComponent } from '@admin/components/dashboard/chart/chart.component';
import { DashboardComponent } from '@admin/components/dashboard/dashboard.component';
import { QuickNavsComponent } from '@admin/components/dashboard/quick-navs/quick-navs.component';
import { QuickProductsComponent } from '@admin/components/dashboard/quick-products/quick-products.component';
import { QuickStaffsComponent } from '@admin/components/dashboard/quick-staffs/quick-staffs.component';
import { RecentOrdersComponent } from '@admin/components/dashboard/recent-orders/recent-orders.component';
import { WidgetsComponent } from '@admin/components/dashboard/widgets/widgets.component';
import { ManageStockComponent } from '@admin/components/products/manage-stock/manage-stock.component';
import { ProductCategoryComponent } from '@admin/components/products/product-category/product-category.component';
import { ProductFormComponent } from '@admin/components/products/product-form/product-form.component';
import { ProductProfileComponent } from '@admin/components/products/product-profile/product-profile.component';
import { ProductRegistryComponent } from '@admin/components/products/product-registry/product-registry.component';
import { ProjectFormComponent } from '@admin/components/project/project-form/project-form.component';
import { ProjectRegistryComponent } from '@admin/components/project/project-registry/project-registry.component';
import { ClientOrderAddQtyComponent } from '@admin/components/reports/client-order-add-qty/client-order-add-qty.component';
import { ClientOrderDetailsComponent } from '@admin/components/reports/client-order-details/client-order-details.component';
import { ClientOrdersComponent } from '@admin/components/reports/client-orders/client-orders.component';
import {
  ContactMessagesDetailsComponent,
} from '@admin/components/reports/contact-messages-details/contact-messages-details.component';
import { ContactMessagesComponent } from '@admin/components/reports/contact-messages/contact-messages.component';
import { ServiceFormComponent } from '@admin/components/service/service-form/service-form.component';
import { ServiceRegistryComponent } from '@admin/components/service/service-registry/service-registry.component';
import { StaffFormComponent } from '@admin/components/staffs/staff-form/staff-form.component';
import { StaffProfileComponent } from '@admin/components/staffs/staff-profile/staff-profile.component';
import { StaffsRegistryComponent } from '@admin/components/staffs/staffs-registry/staffs-registry.component';
import { CheckOutComponent } from '@admin/components/transactions/check-out/check-out.component';
import { OrderSuccessComponent } from '@admin/components/transactions/order-success/order-success.component';
import { PosCartComponent } from '@admin/components/transactions/pos-cart/pos-cart.component';
import { PosComponent } from '@admin/components/transactions/pos/pos.component';
import {
  ProductTransactionLogComponent,
} from '@admin/components/transactions/product-transaction-log/product-transaction-log.component';
import { RemitFormComponent } from '@admin/components/transactions/remit-form/remit-form.component';
import { ShoppingCartComponent } from '@admin/components/transactions/shopping-cart/shopping-cart.component';
import { StaffOrderRemitComponent } from '@admin/components/transactions/staff-order-remit/staff-order-remit.component';
import {
  StaffTransactionLogComponent,
} from '@admin/components/transactions/staff-transaction-log/staff-transaction-log.component';
import { StockOrdersComponent } from '@admin/components/transactions/stock-orders/stock-orders.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,

    ChartsModule
  ],
  declarations: [
    // account
    AssignRoleComponent,
    NewLoginComponent,

    // dashboard
    DashboardComponent,
    WidgetsComponent,
    ChartComponent,
    QuickNavsComponent,
    RecentOrdersComponent,
    QuickStaffsComponent,
    QuickProductsComponent,

    // product
    ManageStockComponent,
    ProductRegistryComponent,
    ProductCategoryComponent,
    ProductProfileComponent,
    ProductFormComponent,

    // project
    ProjectRegistryComponent,
    ProjectFormComponent,

    // reports
    ClientOrdersComponent,
    ContactMessagesComponent,
    ClientOrderDetailsComponent,
    ContactMessagesDetailsComponent,
    ClientOrderAddQtyComponent,

    // service
    ServiceRegistryComponent,
    ServiceFormComponent,

    // staffs
    StaffsRegistryComponent,
    StaffProfileComponent,
    StaffFormComponent,

    // transactions
    PosComponent,
    PosCartComponent,
    StockOrdersComponent,
    CheckOutComponent,
    ShoppingCartComponent,
    OrderSuccessComponent,
    StaffTransactionLogComponent,
    ProductTransactionLogComponent,
    StaffOrderRemitComponent,
    RemitFormComponent,
  ],
  exports: [
    // DashboardModule,
    // ProductModule,
    // ProjectModule,
    // ReportsModule,
    // ServiceModule,
    // StaffsModule,
    // TransactionsModule,
  ],
  entryComponents: [
    AssignRoleComponent,
    ProductCategoryComponent,

    ClientOrderDetailsComponent,
    ContactMessagesDetailsComponent,
    ClientOrderAddQtyComponent,

    PosCartComponent,
  ]
})
export class AdminModule { }
