import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowCatRefPage } from './show-cat-ref.page';

const routes: Routes = [
  {
    path: '',
    component: ShowCatRefPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowCatRefPageRoutingModule {}
