import { ReassignRoutes } from './reassign.routing';
import { ReassignComponent } from './reassign/reassign.component';
import { ReassignManagementComponent } from './reassign-management/reassign-management.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReassignFormModalComponent } from './reassign-form-modal/reassign-form-modal.component';


@NgModule({
    declarations: [
        ReassignComponent,
        ReassignManagementComponent,
        ReassignFormModalComponent
     
    ],
    imports: [
      CommonModule,
      ReassignRoutes,
      SharedModule,
      NgxDatatableModule,
      NgbModule,
      NgSelectModule,
      ReactiveFormsModule,
      FormsModule
    ],
    entryComponents: [
      ReassignComponent,
      ReassignFormModalComponent
    ],
    exports: [ReassignComponent],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
    ]
})
export class ReassignModule { }