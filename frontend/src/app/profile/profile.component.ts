import { Component, OnInit } from '@angular/core';
import { CAApiService } from '../ca-api/ca-api.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    constructor(
        private apiService: CAApiService
    ) {
    }

    ngOnInit() {
        // this.apiService.getUserByEmail()
    }

}
