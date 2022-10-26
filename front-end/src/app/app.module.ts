import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor, AuthGuard } from './services';

import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { VinesAssignmentComponent } from './fleet-management/vines-assignment/vines-assignment.component';
import { DigitalizationComponent } from './fleet-management/digitalization/digitalization.component';
import { DeliveryComponent } from './fleet-management/delivery/delivery.component';
import { ProgressReportComponent } from './fleet-management/progress-report/progress-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorInterceptor } from './shared/error/http-error-interceptor';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const config: SocketIoConfig = { url: 'http://192.168.20.121:8080', options: {} };

import {
  AgregarEditarTramitesComponent
} from './pricing-manager/additional/agregar-editar-tramites/agregar-editar-tramites.component';
import {
  AgregarEditarTramitesGrupalComponent
} from './pricing-manager/additional/agregar-editar-tramites-grupal/agregar-editar-tramites-grupal.component';
import {
  AgregarEditarAccesoriosComponent
} from './pricing-manager/additional/agregar-editar-accesorios/agregar-editar-accesorios.component';

import {
  AgregarEditarAccesoriosGrupalComponent
} from './pricing-manager/additional/agregar-editar-accesorios-grupal/agregar-editar-accesorios-grupal.component';
import {
  AgregarEditarServicioUnidadComponent
} from './pricing-manager/additional/agregar-editar-servicio-unidad/agregar-editar-servicio-unidad.component';
import {
  AgregarEditarServicioUnidadGrupalComponent
} from './pricing-manager/additional/agregar-editar-servicio-unidad-grupal/agregar-editar-servicio-unidad-grupal.component';

import { ConfiguraTipoOrdenComponent } from './pricing-manager/additional/configura-tipo-orden/configura-tipo-orden.component';

import { ConfiguraTipoOrdenAdicionalesComponent } from './pricing-manager/additional/configura-tipo-orden-adicionales/configura-tipo-orden-adicionales.component';

import { PricingViewerOnlyReadComponent } from './pricing-manager/pricing-viewer/onlyread/pricing-viewer.onlyread.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { PricingViewerPDFComponent } from './pricing-manager/pricing-viewer/pdf/pricing-viewer.pdf.component';

//SISCO
import {CatalogoSiscoComponent} from './pricing-manager/additional/catalogo-sisco/catalogo-sisco.component';
import {AgregarAccesorioSiscoComponent} from './pricing-manager/additional/agregar-accesorio-sisco/agregar-accesorio-sisco.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    VinesAssignmentComponent,
    AgregarEditarTramitesComponent,
    AgregarEditarTramitesGrupalComponent,
    AgregarEditarAccesoriosComponent,
    AgregarEditarAccesoriosGrupalComponent,
    AgregarEditarServicioUnidadComponent,
    AgregarEditarServicioUnidadGrupalComponent,
    PricingViewerOnlyReadComponent,
    PricingViewerPDFComponent,
    ConfiguraTipoOrdenComponent,
    ConfiguraTipoOrdenAdicionalesComponent,
    //SISCO
    CatalogoSiscoComponent,
    AgregarAccesorioSiscoComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    NgProgressModule,
    NgProgressHttpModule,
    NgbModule.forRoot(),
    SharedModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    CurrencyMaskModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    SocketIoModule.forRoot(config)
  ],

  entryComponents: [
    AgregarEditarTramitesComponent,
    AgregarEditarTramitesGrupalComponent,
    AgregarEditarAccesoriosComponent,
    AgregarEditarAccesoriosGrupalComponent,
    AgregarEditarServicioUnidadComponent,
    AgregarEditarServicioUnidadGrupalComponent,
    PricingViewerPDFComponent,
    ConfiguraTipoOrdenComponent,
    ConfiguraTipoOrdenAdicionalesComponent,
    //SISCO
    CatalogoSiscoComponent,
    AgregarAccesorioSiscoComponent
  ],

  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
