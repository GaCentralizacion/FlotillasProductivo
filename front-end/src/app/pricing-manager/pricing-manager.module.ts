import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PricingManagerComponent } from './pricing-manager.component';
import { AdditionalComponent } from './additional/additional.component';
import { PricingManagerRoutingModule } from './pricing-manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { TransferComponent } from './transfer/transfer.component';
import { UnitComponent } from './unit/unit.component';
import { StepperComponent } from './stepper/stepper.component';
import { PricingViewerComponent } from './pricing-viewer/pricing-viewer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalUnitComponent } from '../catalog/modal-unit/modal-unit.component';
import { GroupFleetComponent } from './group-fleet/group-fleet.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalReservedComponent } from '../catalog/modal-reserved/modal-reserved.component';
import { SellingConditionComponent } from './selling-condition/selling-condition.component';
import { SelectionTabComponent } from './additional/selection-tab/selection-tab.component';
import { ClienteInformacionComponent } from './register/cliente-informacion/cliente-informacion.component';
import { GroupTablesComponent } from './additional/group-tables/group-tables.component';
import { SummaryTablesComponent } from './additional/summary-tables/summary-tables.component';
import { TransferTableComponent } from './transfer/table/transfer.table.component';
import { CrearEditarSellingConditionComponent } from './selling-condition/crear-editar-selling-condition/crear-editar-selling-condition.component';
import { TransferValidationComponent } from './transfer/validation/transfer.validation.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PricingViewerEditorComponent } from './pricing-viewer/conditions/pricing-viewer.conditions.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { PricingViewerPDFComponent } from './pricing-viewer/pdf/pricing-viewer.pdf.component';
import { PricingViewerCloseComponent } from './pricing-viewer/close/pricing-viewer.close.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AdditionalService } from './additional/additional.service';
import { NotificationsComponent } from './pricing-viewer/notifications/notifications.component';
import { BonificacionComponent } from './pricing-viewer/bonificacion/bonificacion.component';
import { ValidateVinComponent } from './pricing-viewer/validate-vin/validate-vin.component';
//import { ConfiguraTipoOrdenComponent } from './additional/configura-tipo-orden/configura-tipo-orden.component';

@NgModule({
  declarations: [
    PricingManagerComponent,
    AdditionalComponent,
    RegisterComponent,
    TransferComponent,
    TransferTableComponent,
    TransferValidationComponent,
    UnitComponent,
    StepperComponent,
    PricingViewerComponent,
    PricingViewerEditorComponent,
    ModalUnitComponent,
    GroupFleetComponent,
    ModalReservedComponent,
    SellingConditionComponent,
    SelectionTabComponent,
    ClienteInformacionComponent,
    GroupTablesComponent,
    //ConfiguraTipoOrdenComponent,
    SummaryTablesComponent,
    PricingViewerCloseComponent,
    NotificationsComponent,
    BonificacionComponent,
    ValidateVinComponent,
  ],
  imports: [
    CommonModule,
    CurrencyMaskModule,
    HttpClientModule,
    AngularEditorModule,
    PricingManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule.forRoot(),
    ScrollToModule.forRoot(),
    SharedModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  entryComponents: [
    NotificationsComponent,
    ModalUnitComponent,
    ModalReservedComponent,
    CrearEditarSellingConditionComponent,
    TransferValidationComponent,
    PricingViewerEditorComponent,
    PricingViewerCloseComponent,
    BonificacionComponent,
    ValidateVinComponent,
    //ConfiguraTipoOrdenComponent

  ],
  providers: [AdditionalService],
  bootstrap: [RegisterComponent],
  exports: []

})

export class PricingManagerModule { }
