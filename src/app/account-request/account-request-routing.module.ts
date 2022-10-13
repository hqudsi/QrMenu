import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountRequestPage } from './account-request.page';

const routes: Routes = [
  {
    path: '',
    component: AccountRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRequestPageRoutingModule {}
