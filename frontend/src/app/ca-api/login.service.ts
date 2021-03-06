import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Logger } from './logging';
import { CAApiService } from './ca-api.service';
import { CAApiError } from './error-handler.service';
import { User } from '../profile/profile.model';

export const TOKEN_NAME = 'jwt';

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
    private static storeToken(tokenString: string, permanent: boolean = false): void {
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

    public get loggedInUser(): User {
        return this.user;
    }

    public get isLoggedIn(): Observable<boolean> {
        return Observable.of(this.loggedInUser != null);
    }

    public get username(): string {
        return this.token.username;
    }

    /**
     * Logs the user with the specified credentials in by requesting a token from the server
     *
     * @param username
     * @param password
     * @param keepLoggedIn
     * @returns {Observable<void>}
     */
    public passwordLogin(username: string, password: string, keepLoggedIn: boolean = false): Observable<User> {
        return this.apiService.obtainToken(username, password)
            .do((data: any) => {
                LoginService.storeToken(data.token, keepLoggedIn);
            })
            .flatMap((data: any) => {
                return this.retrieveUser(this.token.username);
            })
            .do((user: User) => this.user = user)
            .catch((error: CAApiError) => {
                LoginService.deleteToken();
                return Observable.throw(error);
            });
    }

    /**
     * Logs in the user by certificate, by requesting a token from the server
     *
     * @param keepLoggedIn
     * @returns {Observable<void>}
     */
    public certificateLogin(keepLoggedIn: boolean = false): Observable<User> {
        return this.apiService.obtainCertificateToken()
            .do((data: any) => {
                LoginService.storeToken(data.token, keepLoggedIn);
            })
            .flatMap((data: any) => {
                return this.retrieveUser(this.token.username);
            })
            .do((user: User) => this.user = user)
            .catch((error: CAApiError) => {
                LoginService.deleteToken();
                return Observable.throw(error);
            });
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
     * Gets the logged in user from the server
     */
    private retrieveUser(email: string): Observable<User> {
        return this.apiService.getUserByUsername(email);
    }
}