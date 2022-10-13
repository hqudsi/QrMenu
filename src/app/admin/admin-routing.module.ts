import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataResolverService } from '../services/resolver/data-resolver.service';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'my-items',
        loadChildren: () => import('./my-items/my-items.module').then( m => m.MyItemsPageModule)
      },
      {
        path: 'reorder-items',
        loadChildren: () => import('./reorder-items/reorder-items.module').then( m => m.ReorderItemsPageModule)
      },
      {
        path: 'reorder-category-items/:id',
        loadChildren: () => import('./reorder-category-items/reorder-category-items.module').then( m => m.ReorderCategoryItemsPageModule)
      },
      {
        path: 'my-categories',
        loadChildren: () => import('./my-categories/my-categories.module').then( m => m.MyCategoriesPageModule)
      },
      {
        path: 'my-restaurant',
        loadChildren: () => import('./my-restaurant/my-restaurant.module').then( m => m.MyRestaurantPageModule)
      },
      {
        path: 'panel',
        loadChildren: () => import('./panel/panel.module').then( m => m.PanelPageModule)
      },
      {
        path: 'add-item',
        loadChildren: () => import('./adding-pages/add-item/add-item.module').then( m => m.AddItemPageModule)
      },
      {
        path: 'details/item/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./details/item/item.module').then( m => m.ItemPageModule)
      },
      {
        path: 'details/category/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./details/category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: 'add-category',
        loadChildren: () => import('./adding-pages/add-category/add-category.module').then( m => m.AddCategoryPageModule)
      },
      {
        path: 'details/edit-category/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./edit-pages/edit-category/edit-category.module').then( m => m.EditCategoryPageModule)
      },
      {
        path: 'details/edit-item/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./edit-pages/edit-item/edit-item.module').then( m => m.EditItemPageModule)
      },
      {
        path: 'details/edit-restaurant/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./edit-pages/edit-restaurant/edit-restaurant.module').then( m => m.EditRestaurantPageModule)
      },
      {
        path: '',
        redirectTo: '/admin/panel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/panel',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminPageRoutingModule {}
