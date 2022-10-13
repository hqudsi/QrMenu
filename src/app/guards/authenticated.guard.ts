import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { FireAuthService } from '../services/fire-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate, CanLoad {
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
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    })
  );
}
}
