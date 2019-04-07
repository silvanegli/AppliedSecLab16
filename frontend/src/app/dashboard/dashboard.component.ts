import { Component, OnInit } from '@angular/core';
import { LoginService } from '../ca-api/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private loginService: LoginService,
        private router: Router
    ) {
    }

    ngOnInit() {

    }

    public logout(): void {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }

}
