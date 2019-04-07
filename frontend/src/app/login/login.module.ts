import { NgModule } from '@angular/core';
import { routing } from './login.routing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        LoginComponent
    ]
})
export class LoginModule {
}