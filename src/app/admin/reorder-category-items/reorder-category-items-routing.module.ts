import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReorderCategoryItemsPage } from './reorder-category-items.page';

const routes: Routes = [
  {
    path: '',
    component: ReorderCategoryItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReorderCategoryItemsPageRoutingModule {}
