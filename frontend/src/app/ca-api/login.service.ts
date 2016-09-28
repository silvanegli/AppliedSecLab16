import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Logger } from './logging';
import { CAApiService } from './ca-api.service';
import { CAApiError } from './error-handler.service';

export const TOKEN_NAME = 'jwt';

export class User {
    email: string
}

interface Token {
    orig_iat: number;
    exp: number;
    user_id: number;
    username: string;
    email: string;
}

@Injectable()
export class LoginService {

    private user: User;
    private helper: JwtHelper = new JwtHelper();

    /**
     * Loads the encoded token from local storage
     *
     * @returns {string}
     */
    public static loadToken(): string {
        let tokenString = localStorage.getItem(TOKEN_NAME);
        if (tokenString == null) {
            tokenString = sessionStorage.getItem(TOKEN_NAME);
        }
        return tokenString;
    }

    /**
     * Stores the encoded token in the local storage (permanent == true) or the session storage (permanent == false)
     * @param tokenString
     * @param permanent
     */
    private static storeToken(tokenString: string, permanent: boolean = true): void {
        if (permanent) {
            sessionStorage.removeItem(TOKEN_NAME);
            localStorage.setItem(TOKEN_NAME, tokenString);
        }
        else {
            localStorage.removeItem(TOKEN_NAME);
            sessionStorage.setItem(TOKEN_NAME, tokenString);
        }
    }

    /**
     * Deletes the stored token
     */
    private static deleteToken(): void {
        localStorage.removeItem(TOKEN_NAME);
        sessionStorage.removeItem(TOKEN_NAME);
    }
    

    public constructor(
        private logger: Logger,
        private apiService: CAApiService
    ) { }

    public get loggedInUser(): Observable<User> {
        return this.user;
    }

    public get isLoggedIn(): Observable<boolean> {
        return this.loggedInUser
            .map((user: any) => user != null);
    }

    /**
     * Logs the user with the specified credentials in by requesting a token from the server
     *
     * @param email
     * @param password
     * @param keepLoggedIn
     * @returns {Observable<void>}
     */
    public login(email: string, password: string, keepLoggedIn: boolean = true): Observable<User> {
        return this.apiService.obtainToken(email, password)
            .do((data: any) => {
                LoginService.storeToken(data.token, keepLoggedIn);
            })
            .flatMap((data: any) => {
                return this.retrieveUser(this.token.email);
            })
            .do((user: User) => this.user.next(user))
            .catch((error: CAApiError) => {
                LoginService.deleteToken();
                return Observable.throw(error);
            });
    }

    /**
     * Renews the login by refreshing the token on the server
     */
    public renewLogin(): void {
        if (!this.hasTokenNotExpired) {
            // Already too late
            this.logger.info('Token has expired');
            LoginService.deleteToken();
            this.user = null;
            return;
        }

        let token = this.token;
        this.logger.debug('Token originally issued on:', new Date(token.orig_iat * 1000).toLocaleString());
        this.logger.debug('Token expires on:', new Date(token.exp * 1000).toLocaleString());

        let tokenString = LoginService.loadToken();
        this.apiService.refreshToken(tokenString)
            .do((data: any) => {
                LoginService.storeToken(data.token, false);
            })
            .flatMap((data: any) => {
                return this.retrieveUser(this.token.email);
            })
            .subscribe(
                (user: User) => {this.user = user},
                (error: CAApiError) => {
                    LoginService.deleteToken();
                    this.user = null;
                }
            );
    }

    /**
     * Performs a logout
     */
    public logout(): void {
        LoginService.deleteToken();
        this.user = null;
    }

    /**
     * Helper to get the decoded token
     * @returns {Token}
     */
    private get token(): Token {
        let token = LoginService.loadToken();
        if (token == null) {
            return null;
        }
        else {
            return this.helper.decodeToken(token);
        }
    }

    /**
     * Whether there is a valid token stored
     *
     * @returns {boolean}
     */
    private get hasTokenNotExpired(): boolean {
        return tokenNotExpired(TOKEN_NAME, LoginService.loadToken());
    }

    /**
     * Gets the logged in user from the server
     */
    private retrieveUser(email: string): Observable<User> {
        return this.apiService.getUserByEmail(email);
    }
}