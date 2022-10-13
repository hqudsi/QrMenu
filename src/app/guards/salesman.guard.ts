import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { FireAuthService } from '../services/fire-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesmanGuard implements CanActivate, CanLoad {
  constructor(
    private fireAuth: FireAuthService,
    private router: Router
  ) { }

canLoad(): Observable<boolean> {
  return this.fireAuth.isAuthenticated.pipe(
    filter(val => val !== null), // Filter out initial Behaviour subject value
    take(1), // Otherwise the Observable doesn't complete!
    map(isAuthenticated => {
      if (isAuthenticated && this.fireAuth.cafeUser.type === 3) {
        return true;
      } else {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    })
  );
}

canActivate(): Observable<boolean> {
  return this.fireAuth.isAuthenticated.pipe(
    filter(val => val !== null), // Filter out initial Behaviour subject value
    take(1), // Otherwise the Observable doesn't complete!
    map(isAuthenticated => {
      if (isAuthenticated && this.fireAuth.cafeUser.type === 3) {
        return true;
      } else {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    })
  );
}
}
