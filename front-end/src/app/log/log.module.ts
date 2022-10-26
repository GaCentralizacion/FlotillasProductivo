import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogComponent } from './log.component';
import { LogRoutingModule } from './log-routing.module';
import { GeneralLogComponet } from './general-log/general-log.component';
import { AuditComponent } from './audit/audit.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [LogComponent, GeneralLogComponet, AuditComponent],
  imports: [
    CommonModule,
    LogRoutingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule
  ],
  bootstrap: [LogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LogModule { }
