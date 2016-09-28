import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { routing } from './app.routing';
import { Logger } from './ca-api/logging';
import { CAApiModule } from './ca-api/ca-api.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
    declarations: [
        AppComponent,
        CertificatesComponent,
        ProfileComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule,
        routing,
        CAApiModule,
        LoginModule,
        DashboardModule
    ],
    providers: [
        Logger
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
