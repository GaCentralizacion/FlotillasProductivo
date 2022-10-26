import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { AccesoriesComponent } from './accesories/accesories.component';
import { FinancialComponent } from './financial/financial.component';
import { ClientCatalogComponent } from './client-catalog/client-catalog.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TokenInterceptor } from '../services';
import { HttpErrorInterceptor } from '../shared/error/http-error-interceptor';
import { SharedModule } from '../shared/shared.module';
import { ProviderCatalogsModule } from './provider-catalog/provider-catalog.module';
import { UserCatalogsModule } from './user-catalog/user-catalog.module';
import { TramiteComponent } from './tramite/tramite.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { AdicionalesComponent } from './adicionales/adicionales.component';
import { SolicitudAprobacionComponent } from './solicitud-aprobacion/solicitud-aprobacion.component';
import { NgbTabsetModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudAprobacionUtilidadComponent } from './solicitud-aprobacion/solicitud-aprobacion-utilidad/solicitud-aprobacion-utilidad.component';
import { SolicitudAprobacionUnidadesComponent } from './solicitud-aprobacion/solicitud-aprobacion-unidades/solicitud-aprobacion-unidades.component';
import { SolicitudAprobacionCreditoComponent } from './solicitud-aprobacion/solicitud-aprobacion-credito/solicitud-aprobacion-credito.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApproveConfirmationModalComponent } from './solicitud-aprobacion/approve-confirmation-modal/approve-confirmation-modal.component';
import { PaqueteTramiteComponent } from './tramite/paquete-tramite/paquete-tramite.component';
import { CrearEditarPaqueteTramiteComponent } from './tramite/crear-editar-paquete-tramite/crear-editar-paquete-tramite.component';
import { CrearEditarPaqueteAdicionalesComponent } from './adicionales/crear-editar-paquete-adicionales/crear-editar-paquete-adicionales.component';
import { CrearEditarAccesorioComponent } from './accesories/crear-editar-accesorio/crear-editar-accesorio.component';
import { CrearEditarPaqueteServicioComponent } from './servicios/crear-editar-paquete-servicio/crear-editar-paquete-servicio.component';
import { PaqueteServicioComponent } from './servicios/paquete-servicio/paquete-servicio.component';
import { PaqueteAccesoriosComponent } from './accesories/paquete-accesorios/paquete-accesorios.component';
import { CrearEditarPaqueteAccesorioComponent } from './accesories/crear-editar-paquete-accesorio/crear-editar-paquete-accesorio.component';
import { TrasladosComponent } from './traslados/traslados.component';
import { CrearEditarRutasTrasladoComponent } from './traslados/crear-editar-rutas-traslado/crear-editar-rutas-traslado.component';

@NgModule({
  declarations: [
    CatalogComponent,
    AccesoriesComponent,
    FinancialComponent,
    ClientCatalogComponent,
    TramiteComponent,
    ServiciosComponent,
    AdicionalesComponent,
    SolicitudAprobacionComponent,
    SolicitudAprobacionUtilidadComponent,
    SolicitudAprobacionUnidadesComponent,
    SolicitudAprobacionCreditoComponent,
    ApproveConfirmationModalComponent,
    PaqueteTramiteComponent,
    CrearEditarPaqueteTramiteComponent,
    CrearEditarPaqueteAdicionalesComponent,
    CrearEditarAccesorioComponent,
    CrearEditarPaqueteServicioComponent,
    PaqueteServicioComponent,
    PaqueteAccesoriosComponent,
    CrearEditarPaqueteAccesorioComponent,
    TrasladosComponent,
    CrearEditarRutasTrasladoComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FormsModule,
    NgxDatatableModule,
    AngularMultiSelectModule,
    HttpClientModule,
    NgProgressModule,
    NgProgressHttpModule,
    NgSelectModule,
    NgbTabsetModule,
    SharedModule,
    ProviderCatalogsModule,
    UserCatalogsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModalModule,
    NgbModule,
    SharedModule,
    NgxDatatableModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ApproveConfirmationModalComponent,
    CrearEditarPaqueteTramiteComponent,
    CrearEditarPaqueteAdicionalesComponent,
    CrearEditarAccesorioComponent,
    CrearEditarPaqueteServicioComponent,
    CrearEditarPaqueteAccesorioComponent
  ],
  bootstrap: [ApproveConfirmationModalComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class CatalogModule { }
