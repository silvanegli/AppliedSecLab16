import { Component } from '@angular/core';
import { LoginService } from '../ca-api/login.service';
import { Router } from '@angular/router';
import { CAApiError } from '../ca-api/error-handler.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public passwordLogin: boolean = true;
    public email: string;
    public password: string;
    public certificate: string;
    public error: string;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) {
    }

    onSubmit() {
        if (this.passwordLogin) {
            this.loginService.passwordLogin(this.email, this.password)
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (error: CAApiError) => {
                        console.log(error);
                        this.error = error.statusText;
                    }
                )
        } else {
            this.loginService.certificateLogin(this.email, this.certificate)
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (error: CAApiError) => {
                        console.log(error);
                        this.error = error.statusText;
                    }
                )
        }
    }
}
