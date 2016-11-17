import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: '<b>Not found!</b>'
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/']);
  }

}
