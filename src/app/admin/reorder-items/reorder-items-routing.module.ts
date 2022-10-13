import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReorderItemsPage } from './reorder-items.page';

const routes: Routes = [
  {
    path: '',
    component: ReorderItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReorderItemsPageRoutingModule {}
