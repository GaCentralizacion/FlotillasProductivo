import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileRepositoryComponent } from './file-repository.component';
import { FileRepositoryRoutingModule } from './file-repository-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {ShContextMenuModule} from 'ng2-right-click-menu'


@NgModule({
  declarations: [FileRepositoryComponent],
  imports: [
    CommonModule,
    FileRepositoryRoutingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    ShContextMenuModule
  ],
  bootstrap: [FileRepositoryComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FileRepositoryModule { }
