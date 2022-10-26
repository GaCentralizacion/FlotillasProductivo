import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FleetComponent } from './fleet.component';
import { FleetRoutingModule } from './fleet-routing.module';


@NgModule({
  declarations: [
    FleetComponent,
  ],
  imports: [
    CommonModule,
    FleetRoutingModule,
    SharedModule,
    NgxDatatableModule

  ],
  exports: [DireccionFlotillaSelectComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FleetModule { }
