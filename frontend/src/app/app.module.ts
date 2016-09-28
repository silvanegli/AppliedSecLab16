import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { routing } from './app.routing';
import { Logger } from './ca-api/logging';
import { CAApiModule } from './ca-api/ca-api.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
    declarations: [
        AppComponent,
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
        DashboardModule,
        CertificatesModule,
        ProfileModule
    ],
    providers: [
        Logger
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
