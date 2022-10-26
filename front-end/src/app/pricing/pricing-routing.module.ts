import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingComponent } from './pricing.component';
import { SearchUnitComponent } from './searchUnits/search.unit.component';


const routes: Routes = [
  {
    path: '',
    component: PricingComponent,
  },
  {
    path: 'search',
    component: SearchUnitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }

