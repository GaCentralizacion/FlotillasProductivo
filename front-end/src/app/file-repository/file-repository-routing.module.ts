import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileRepositoryComponent } from './file-repository.component';

const routes: Routes = [
  {
    path: '',
    component: FileRepositoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileRepositoryRoutingModule { }
