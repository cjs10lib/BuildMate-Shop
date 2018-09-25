import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '@core/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@core/layouts/auth-layout/auth-layout.component';
import { GeneralLayoutComponent } from '@core/layouts/general-layout/general-layout.component';

import { SharedModule } from './../shared/shared.module';

// const routes: Routes = [
//   {
//     path: '', redirectTo: '/home', pathMatch: 'full'
//   },
//   {
//     path: '',
//     component: GeneralLayoutComponent,
//     children: [
//       {
//         path: 'home',
//         component: HomePageComponent
//       }, {
//         path: 'service-list',
//         component: OurServicesComponent
//       }, {
//         path: 'service/:id',
//         component: ServiceDetailsComponent
//       }, {
//         path: 'contact-us',
//         component: OurContactsComponent
//       }, {
//         path: 'project/:id',
//         component: ProjectDetailsComponent
//       }, {
//         path: 'projects',
//         component: OurRecentProjectsComponent
//       }
//     ]
//   }, {
//     path: '**', redirectTo: '/home', pathMatch: 'full'
//   }
// ];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([])
  ],
  declarations: [
    AdminLayoutComponent,
    GeneralLayoutComponent,
    AuthLayoutComponent
  ]
})
export class CoreModule { }
