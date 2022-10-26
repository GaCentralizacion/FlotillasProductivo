import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing-routing.module';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SearchUnitComponent } from './searchUnits/search.unit.component';


@NgModule({
  declarations: [
    PricingComponent,
    SearchUnitComponent,
  ],
  imports: [
    CommonModule,
    PricingRoutingModule,
    SharedModule,
    NgxDatatableModule

  ],
  exports: [DireccionFlotillaSelectComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class PricingModule { }
