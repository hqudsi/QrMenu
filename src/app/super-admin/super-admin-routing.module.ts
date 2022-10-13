import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminPage } from './super-admin.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminPage,
    children: [
      {
        path: 'panel',
        loadChildren: () => import('./panel/panel.module').then(m => m.PanelPageModule)
      },
      {
        path: '',
        redirectTo: '/super-admin/panel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/super-admin/panel',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminPageRoutingModule { }
