import { AssignComponent } from './assign/assign.component';
import { Routes, RouterModule } from '@angular/router';
import { RequestManagementComponent } from './request-management/request-management.component';
import { RequestComponent } from './request/request.component';

const routes: Routes = [
  {
    path: '',
    component: RequestManagementComponent,
  },
  {
    path: 'nueva',
    component: RequestComponent,
  }
];

export const RequestRoutes = RouterModule.forChild(routes);
