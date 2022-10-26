import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DireccionFlotillaSelectComponent } from './direccion-flotilla-select/direccion-flotilla-select.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ErrorComponent } from './error/error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CrearEditarSellingConditionComponent } from '../pricing-manager/selling-condition/crear-editar-selling-condition/crear-editar-selling-condition.component';
import { AlertComponentComponent } from './alert-component/alert-component.component';



@NgModule({
  declarations: [
    DireccionFlotillaSelectComponent,
    DatepickerComponent,
    ErrorComponent,
    CrearEditarSellingConditionComponent,
    AlertComponentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    ScrollToModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AlertComponentComponent
  ],
  exports: [
    DireccionFlotillaSelectComponent,
    DatepickerComponent,
    ErrorComponent,
    ScrollToModule,
    CrearEditarSellingConditionComponent
  ],
  bootstrap: [DatepickerComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
