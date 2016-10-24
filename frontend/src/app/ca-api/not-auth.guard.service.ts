import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

    public constructor(
        private router: Router,
        private loginService: LoginService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.isLoggedIn
            .map((isLoggedIn: boolean) => !isLoggedIn)
            .do((isNotLoggedIn: boolean) => {
                if (!isNotLoggedIn) {
                    this.router.navigate(['/']);
                }
            })
            .first();
    }
}