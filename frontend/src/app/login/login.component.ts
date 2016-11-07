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
    public username: string;
    public password: string;
    public error: string;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) {
    }

    onSubmit() {
        if (this.passwordLogin) {
            this.loginService.passwordLogin(this.username, this.password)
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (error: CAApiError) => {
                        this.error = error.message;
                    }
                )
        } else {
            this.loginService.certificateLogin()
                .subscribe(
                    () => {
                        this.router.navigate(['/']);
                    },
                    (error: CAApiError) => {
                        console.log(error);
                        this.error = error.detail;
                    }
                )
        }
    }
}
