import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {

    public constructor(
        private router: Router,
        private loginService: LoginService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.isLoggedIn
            .do((isLoggedIn: boolean) => {
                if (!isLoggedIn) {
                    let next = state.url;
                    this.router.navigate(['/login'], {queryParams: {next}});
                }
            })
            .first();
    }
}