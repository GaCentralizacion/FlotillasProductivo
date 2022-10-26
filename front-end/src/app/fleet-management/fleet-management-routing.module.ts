import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetManagementComponent } from './fleet-management.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { ReportComponent } from './report/report.component';
import { DocumentaryControlComponent } from './documentary-control/documentary-control.component';
import { ProductionComponent } from './production/production.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { DigitalizationComponent } from './digitalization/digitalization.component';

const routes: Routes = [
  {
    path: '',
    component: FleetManagementComponent, children: [
      {
        path: 'unidades',
        component: ProgressReportComponent
      },
      {
        path: 'digital',
        component: DigitalizationComponent
      },
      {
        path: 'produccion',
        component: ProductionComponent
      },
      {
        path: 'controlDocumental',
        component: DocumentaryControlComponent
      },
      {
        path: 'reporte',
        component: ReportComponent
      },
      {
        path: 'entregas',
        component: DeliveryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetManagementRoutingModule { }
