import { NgModule } from '@angular/core';
import { CertificatesComponent } from './certificates.component';
import { routing } from './certificates.routing';
import { CAApiModule } from '../ca-api/ca-api.module';

@NgModule({
    imports: [
        routing,
        CAApiModule
    ],
    declarations: [CertificatesComponent]
})
export class CertificatesModule {
}