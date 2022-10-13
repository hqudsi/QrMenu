import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportItemPage } from './import-item.page';

const routes: Routes = [
  {
    path: '',
    component: ImportItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportItemPageRoutingModule {}
