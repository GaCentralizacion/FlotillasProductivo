import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './services';
import { PricingViewerOnlyReadComponent } from './pricing-manager/pricing-viewer/onlyread/pricing-viewer.onlyread.component';

const routes: Routes = [

  {
    path: 'main',    component: MainComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'catalogs',
        loadChildren: './catalog/catalog.module#CatalogModule',
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'chatNotificaciones',
        loadChildren: './chat/chat.module#ChatModule'
      },
      {
        path: 'solicitud',
        loadChildren: './request/request.module#RequestModule'
      },
      {
        path: 'reasignacion',
        loadChildren: './reassign/reassign.module#ReassignModule'
      },
      {
        path: 'gestionFlotilla',
        loadChildren: './fleet/fleet.module#FleetModule'
      },
      {
        path: 'gestionFlotilla/manager',
        loadChildren: './fleet-management/fleet-management.module#FleetManagementModule'
      },
      {
        path: 'cotizaciones',
        loadChildren: './pricing/pricing.module#PricingModule'
      },
      {
        path: 'cotizaciones/manager',
        loadChildren: './pricing-manager/pricing-manager.module#PricingManagerModule'
      },
      {
        path: 'log',
        loadChildren: './log/log.module#LogModule'
      },
      {
        path: 'file-repository',
        loadChildren: './file-repository/file-repository.module#FileRepositoryModule'
      },
      {
        path: 'lectura',
        component: PricingViewerOnlyReadComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '', redirectTo: 'main/dashboard' , pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
