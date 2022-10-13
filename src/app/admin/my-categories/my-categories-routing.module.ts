import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCategoriesPage } from './my-categories.page';

const routes: Routes = [
  {
    path: '',
    component: MyCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCategoriesPageRoutingModule {}
