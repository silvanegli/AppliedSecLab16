import { NgModule } from '@angular/core';
import { CAApiModule } from '../ca-api/ca-api.module';
import { ProfileComponent } from './profile.component';
import { routing } from './profile.routing';

@NgModule({
    imports: [
        routing,
        CAApiModule
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule {
}