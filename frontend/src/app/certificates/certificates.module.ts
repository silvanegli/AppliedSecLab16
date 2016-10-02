import { NgModule } from '@angular/core';
import { CertificatesComponent } from './certificates.component';
import { routing } from './certificates.routing';
import { CAApiModule } from '../ca-api/ca-api.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        routing,
        BrowserModule,
        FormsModule,
        CAApiModule
    ],
    declarations: [CertificatesComponent]
})
export class CertificatesModule {
}