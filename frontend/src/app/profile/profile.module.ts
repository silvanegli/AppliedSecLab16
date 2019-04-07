import { NgModule } from '@angular/core';
import { CAApiModule } from '../ca-api/ca-api.module';
import { ProfileComponent } from './profile.component';
import { routing } from './profile.routing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        routing,
        CAApiModule,
        BrowserModule,
        FormsModule
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule {
}