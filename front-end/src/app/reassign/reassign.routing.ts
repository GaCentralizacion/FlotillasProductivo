import { Routes, RouterModule } from '@angular/router';
import { ReassignManagementComponent } from './reassign-management/reassign-management.component';
import { ReassignComponent } from './reassign/reassign.component';


const routes: Routes = [
    {
      path: '',
      component: ReassignManagementComponent,
    },
    {
      path: 'reasigna',
      component: ReassignComponent,
    }
  ];
  
  export const ReassignRoutes = RouterModule.forChild(routes);

  