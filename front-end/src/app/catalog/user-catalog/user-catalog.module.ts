import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCatalogsRoutingModule } from './user-catalog-routing.module';
import { UserCatalogComponent } from './user-catalog.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [UserCatalogComponent],
  imports: [
    CommonModule,
    UserCatalogsRoutingModule,
    NgxDatatableModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class UserCatalogsModule { }
