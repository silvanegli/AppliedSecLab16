import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { routing } from './dashboard.routing';
import { CAApiModule } from '../ca-api/ca-api.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        routing,
        CAApiModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}