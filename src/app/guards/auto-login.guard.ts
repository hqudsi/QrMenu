import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { FireAuthService } from '../services/fire-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad, CanActivate {
  constructor(
      private fireAuth: FireAuthService,
      private router: Router
    ) { }

  canLoad(): Observable<boolean> {
    return this.fireAuth.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {
          if (this.fireAuth.cafeUser.type === 2 || this.fireAuth.cafeUser.type === 4) {
            this.router.navigateByUrl('/admin', { replaceUrl: true });
          } else if (this.fireAuth.cafeUser.type === 1) {
            this.router.navigateByUrl('/super-admin', { replaceUrl: true });
          } else if (this.fireAuth.cafeUser.type === 3) {
            this.router.navigateByUrl('/salesman', { replaceUrl: true });
          }
        } else {
          return true;
        }
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.fireAuth.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {
          if (this.fireAuth.cafeUser.type === 2|| this.fireAuth.cafeUser.type === 4) {
            this.router.navigateByUrl('/admin', { replaceUrl: true });
          } else if (this.fireAuth.cafeUser.type === 1) {
            this.router.navigateByUrl('/super-admin', { replaceUrl: true });
          } else if (this.fireAuth.cafeUser.type === 3) {
            this.router.navigateByUrl('/salesman', { replaceUrl: true });
          }
        } else {
          return true;
        }
      })
    );
  }
}
