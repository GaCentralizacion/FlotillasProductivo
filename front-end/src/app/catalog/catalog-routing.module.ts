import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCatalogComponent } from './user-catalog/user-catalog.component';
import { CatalogComponent } from './catalog.component';
import { ProviderCatalogComponent } from './provider-catalog/provider-catalog.component';
import { AccesoriesComponent } from './accesories/accesories.component';
import { FinancialComponent } from './financial/financial.component';
import { ClientCatalogComponent } from './client-catalog/client-catalog.component';
import { TramiteComponent } from './tramite/tramite.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { AdicionalesComponent } from './adicionales/adicionales.component';
import { SolicitudAprobacionComponent } from './solicitud-aprobacion/solicitud-aprobacion.component';
import { TrasladosComponent } from './traslados/traslados.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    children: [
      {
        path: 'usuarios',
        component: UserCatalogComponent
      },
      {
        path: 'proveedores',
        component: ProviderCatalogComponent
      },
      {
        path: 'accesorios',
        component: AccesoriesComponent
      },
      {
        path: 'financieras',
        component: FinancialComponent
      },
      {
        path: 'clientes',
        component: ClientCatalogComponent
      },
      {
        path: 'tramites',
        component: TramiteComponent
      },
      {
        path: 'servicio',
        component: ServiciosComponent
      },
      {
        path: 'adicionales',
        component: AdicionalesComponent
      },
      {
        path: 'aprobacion',
        component: SolicitudAprobacionComponent
      },
      {
        path: 'traslados',
        component: TrasladosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
