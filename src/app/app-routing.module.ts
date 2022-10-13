import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { SalesmanGuard } from './guards/salesman.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { DataResolverService } from './services/resolver/data-resolver.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AutoLoginGuard],
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'website',
    loadChildren: () => import('./website/website.module').then( m => m.WebsitePageModule),
    canLoad: [AutoLoginGuard],
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'items/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule)
  },
  {
    path: 'restaurant/:id',
    loadChildren: () => import('./restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard],
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule),
    canLoad: [AuthenticatedGuard],
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    canLoad: [AdminGuard],
    canActivate: [AdminGuard]
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./super-admin/super-admin.module').then( m => m.SuperAdminPageModule),
    canLoad: [SuperAdminGuard],
    canActivate: [SuperAdminGuard]
  },
  {
    path: 'salesman',
    loadChildren: () => import('./salesman/salesman.module').then( m => m.SalesmanPageModule),
    canLoad: [SalesmanGuard],
    canActivate: [SalesmanGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./public-pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./public-pages/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'account-request',
    loadChildren: () => import('./account-request/account-request.module').then( m => m.AccountRequestPageModule)
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then( m => m.AccountsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./website/website.module').then( m => m.WebsitePageModule),
    // redirectTo: 'website',
    pathMatch: 'full',
    canLoad: [AutoLoginGuard],
    canActivate: [AutoLoginGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
