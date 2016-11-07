import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { TOKEN_NAME, LoginService } from './login.service';
import { CAApiService } from './ca-api.service';
import { ErrorHandler } from './error-handler.service';
import { DataExtractor } from './data-extractor.service';
import { AuthGuard } from './auth-guard.service';
import { NotAuthGuard } from './not-auth.guard.service';
import { API_BASE_URL } from './ca-api.config';

export function authHttpFactory(http: Http): AuthHttp {
    'use strict';
    return new AuthHttp(new AuthConfig({
        tokenName: TOKEN_NAME,
        tokenGetter: () => Promise.resolve(LoginService.loadToken()),
        headerPrefix: 'JWT',
        noJwtError: true
    }), http);
}

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpFactory,
            deps: [Http]
        },
        CAApiService,
        ErrorHandler,
        DataExtractor,
        LoginService,
        NotAuthGuard,
        AuthGuard
    ]
})
export class CAApiModule {
    public static forRoot(apiBaseUrl: string): ModuleWithProviders {
        return {
            ngModule: CAApiModule,
            providers: [
                {provide: API_BASE_URL, useValue: apiBaseUrl}
            ]
        };
    }

    public constructor(@Optional() @SkipSelf() private parentModule: CAApiModule) {
        if (parentModule) {
            throw new Error(
                'CAApiModule is already loaded. Import it in the AppModule only'
            );
        }
    }
}