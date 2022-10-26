import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderCatalogComponent } from './provider-catalog.component';
import { ProviderCatalogsRoutingModule } from './provider-catalog-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [ProviderCatalogComponent],
  imports: [
    CommonModule,
    ProviderCatalogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ]
})
export class ProviderCatalogsModule { }
