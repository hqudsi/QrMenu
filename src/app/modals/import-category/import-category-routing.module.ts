import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportCategoryPage } from './import-category.page';

const routes: Routes = [
  {
    path: '',
    component: ImportCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportCategoryPageRoutingModule {}
