import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { routing } from './dashboard.routing';
import { CAApiModule } from '../ca-api/ca-api.module';

@NgModule({
    imports: [
        routing,
        CAApiModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}