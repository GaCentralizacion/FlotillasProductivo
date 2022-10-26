import { RequestRoutes } from './request.routing';
import { RequestComponent } from './request/request.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestManagementComponent } from './request-management/request-management.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculoFormModalComponent } from './vehiculo-form-modal/vehiculo-form-modal.component';

import { OrderComponent } from './order/order.component';
import { AssignComponent } from './assign/assign.component';
import { InvoiceModalComponent } from './invoice-form-modal/invoice-form-modal.component';
import { InvoiceOrderComponent } from './invoice-order-modal/invoice-order-modal.component';


@NgModule({
  declarations: [
    RequestComponent,
    RequestManagementComponent,
    VehiculoFormModalComponent,
    OrderComponent,
    AssignComponent,
    InvoiceModalComponent,
    InvoiceOrderComponent,
  ],
  imports: [
    CommonModule,
    RequestRoutes,
    SharedModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [
    VehiculoFormModalComponent,
    OrderComponent,
    AssignComponent,
    InvoiceModalComponent,
    InvoiceOrderComponent,
  ],
  exports: [RequestComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class RequestModule { }
