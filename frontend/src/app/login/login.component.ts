import { Component, OnInit } from '@angular/core';
import { CAApiService } from '../ca-api/ca-api.service';
import { LoginService } from '../ca-api/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
      private loginService: LoginService,
      private apiService: CAApiService
  ) { }

  ngOnInit() {

  }

}
