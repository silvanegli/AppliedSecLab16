import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CAApiService } from '../ca-api/ca-api.service';
import { LoginService } from '../ca-api/login.service';
import { CAApiError } from '../ca-api/error-handler.service';
import { User } from './profile.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private user: User;
    private error: string;
    private success: string;

    constructor(
        private apiService: CAApiService,
        private loginService: LoginService,
        private router: Router,
        private route: ActivatedRoute
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
                    this.success = 'Successfully updated your profile!';
                    this.route.queryParams.subscribe(params => {
                        if (params['status']) {
                            this.router.navigate(['/certificates'], { queryParams: { status: params['status'] } });
                        }
                    });
                },
                (error: CAApiError) => {
                    this.error = error.message;
                }
            );
    }
}
