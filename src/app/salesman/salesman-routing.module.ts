import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesmanPage } from './salesman.page';

const routes: Routes = [
  {
    path: '',
    component: SalesmanPage,
    children: [
      {
        path: 'panel',
        loadChildren: () => import('./panel/panel.module').then(m => m.PanelPageModule)
      },
      {
        path: '',
        redirectTo: '/salesman/panel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/salesman/panel',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesmanPageRoutingModule {}
