import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenImagePage } from './open-image.page';

const routes: Routes = [
  {
    path: '',
    component: OpenImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenImagePageRoutingModule {}
