import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FleetManagementComponent } from './fleet-management.component';
import { FleetManagementRoutingModule } from './fleet-management-routing.module';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepsFleetComponent } from './steps/steps.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { FleetUnidadesComponent } from './progress-report/unidades/fleet.unidades.component';
import { FleetAdicionalesComponent } from './progress-report/adicionales/fleet.adicionales.component';
import { FleetAdicionalesGrupalComponent } from './progress-report/adicionales-grupal/fleet.adicionales-grupal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportComponent } from './report/report.component';
import { ProductionComponent } from './production/production.component';
import { DocumentaryControlComponent } from './documentary-control/documentary-control.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeyendaUnidadesComponent } from './progress-report/leyenda/leyenda.unidades.component';
import { InfoUnidadesComponent } from './progress-report/info/info.unidades.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CrearEditarSellingConditionComponent } from '../pricing-manager/selling-condition/crear-editar-selling-condition/crear-editar-selling-condition.component';
import { TransferTableFlotComponent } from './delivery/table/transfer.table.component';
import { MapTrasladosComponent } from './delivery/table/map/map.traslados.component';
import { InfoModalUnidadesComponent } from './progress-report/infoModal/info.modal.unidades.component';
import { UnitFleetComponent } from './progress-report/unit/unit.component';
import { ModalUnitComponent } from '../catalog/modal-unit/modal-unit.component';
import { ModalUnitFleetComponent } from './progress-report/modal-unit/modal-unit.component';
import { DigitalizationComponent } from './digitalization/digitalization.component';
import { ClienteFacturaComponent } from './progress-report/deliveryclient/cliente.factura.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TransferComponent } from './progress-report/transfer/transfer.component';
import { TransferTableComponent } from './progress-report/transfer/table/transfer.table.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ModalTrasladosComponent } from './progress-report/modal-traslados/modal-traslados.component';
import { ModalUtilidadComponent } from './progress-report/modal-utilidad/modal-utilidad.component';
import { ModalTranseferVinComponent } from './progress-report/modal-transefer-vin/modal-transefer-vin.component';
import { TransferTableVinComponent } from './progress-report/modal-transefer-vin/transfer-table-vin/transfer-table-vin.component';
import { TransferValidationComponent} from './progress-report/modal-transefer-vin/validation/transfer.validation.component'




@NgModule({
  declarations: [FleetManagementComponent, StepsFleetComponent, ProgressReportComponent,
    FleetUnidadesComponent,
    FleetAdicionalesComponent,
    FleetAdicionalesGrupalComponent,
    LeyendaUnidadesComponent,
    ReportComponent,
    DocumentaryControlComponent,
    ProductionComponent,
    InfoUnidadesComponent,
    DeliveryComponent,
    TransferTableFlotComponent,
    MapTrasladosComponent,
    InfoModalUnidadesComponent,
    UnitFleetComponent,
    ModalUnitFleetComponent,
    DigitalizationComponent,
    ClienteFacturaComponent,
    TransferComponent,
    TransferTableComponent,
    ModalTrasladosComponent,
    ModalUtilidadComponent,
    ModalTranseferVinComponent,
    TransferTableVinComponent,
    TransferValidationComponent,
  ],
  imports: [
    CommonModule,
    CurrencyMaskModule,
    FleetManagementRoutingModule,
    SharedModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    NgSelectModule,
    ScrollToModule.forRoot(),
  ],
  entryComponents: [
    FleetUnidadesComponent,
    FleetAdicionalesComponent,
    FleetAdicionalesGrupalComponent,
    LeyendaUnidadesComponent,
    InfoUnidadesComponent,
    CrearEditarSellingConditionComponent,
    MapTrasladosComponent,
    InfoModalUnidadesComponent,
    UnitFleetComponent,
    ModalUnitFleetComponent,
    ClienteFacturaComponent,
    TransferComponent,
    ModalTrasladosComponent,
    ModalUtilidadComponent,
    ModalTranseferVinComponent,
    TransferValidationComponent,
  ],
  exports: [DireccionFlotillaSelectComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FleetManagementModule { }
