import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRestaurantPage } from './my-restaurant.page';

const routes: Routes = [
  {
    path: '',
    component: MyRestaurantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRestaurantPageRoutingModule {}
