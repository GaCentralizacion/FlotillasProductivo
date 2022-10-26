import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingManagerComponent } from './pricing-manager.component';
import { RegisterComponent } from './register/register.component';
import { UnitComponent } from './unit/unit.component';
import { AdditionalComponent } from './additional/additional.component';
import { TransferComponent } from './transfer/transfer.component';
import { PricingViewerComponent } from './pricing-viewer/pricing-viewer.component';
import { SellingConditionComponent } from './selling-condition/selling-condition.component';



const routes: Routes = [
  {
    path: '',
    component: PricingManagerComponent,
    children: [
      {
          path: 'registro',
          component: RegisterComponent
      },
      {
          path: 'unidades',
          component: UnitComponent
      },
      {
        path: 'adicionales',
        component: AdditionalComponent
      },
      {
        path: 'traslados',
        component: TransferComponent
      },
      {
        path: 'condiciones',
        component: SellingConditionComponent
      },
      {
        path: 'cotizacion',
        component: PricingViewerComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PricingManagerRoutingModule { }
