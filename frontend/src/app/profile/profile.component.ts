import { Component, OnInit } from '@angular/core';
import { CAApiService } from '../ca-api/ca-api.service';
import { LoginService, User } from '../ca-api/login.service';
import { CAApiError } from '../ca-api/error-handler.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private user: User;
    private error: string;

    constructor(
        private apiService: CAApiService,
        private loginService: LoginService
    ) {

    }

    ngOnInit() {
        this.user = this.loginService.loggedInUser;
    }


    private onSubmitProfile() {
        this.apiService.updateUser(this.loginService.username, this.user)
            .subscribe(
                (user: User) => {
                    this.user = user;
                },
                (error: CAApiError) => {
                    this.error = error.message;
                }
            );
    }
}
