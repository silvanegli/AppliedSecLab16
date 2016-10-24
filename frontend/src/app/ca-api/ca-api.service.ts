import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Logger } from './logging';
import {
    REFRESH_ENDPOINT, VERIFY_ENDPOINT, LOGIN_ENDPOINT, CERTIFICATE_LOGIN_ENDPOINT, USER_ENDPOINT, API_BASE_URL,
    CERTIFICATE_ENDPOINT
} from './ca-api.config';
import { Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { DataExtractor } from './data-extractor.service';
import { ErrorHandler } from './error-handler.service';
import { User } from './login.service';
import { Certificate } from '../certificates/certificate.model';

@Injectable()
export class CAApiService {
    public constructor(
        private http: AuthHttp,
        private logger: Logger,
        private dataExtractor: DataExtractor,
        private errorHandler: ErrorHandler
    ) {
    }

    /**
     * Revoke a certain certificate
     *
     * @param id
     * @returns {Observable<Certificate>}
     */
    public revokeCertificate(id: number): Observable<Certificate> {
        return this.deleteRequest(this.fullUrl(CERTIFICATE_ENDPOINT + '/' + id))
            .map((json: any) => new Certificate(json));
    }

    /**
     * Create a new certificate
     *
     * @returns {Observable<Certificate>}
     */
    public createCertificate(name: string): Observable<Certificate> {
        let payload = {'name': name};
        return this.postRequest(this.fullUrl(CERTIFICATE_ENDPOINT), payload)
            .map((json: any) => new Certificate(json));
    }

    /**
     * Get all active certificates
     *
     * @returns {Certificate[]}
     */
    public getCertificates(): Observable<Certificate[]> {
        let options = new URLSearchParams();
        options.append('status', 'active');
        // return this.getRequest(this.fullUrl(CERTIFICATE_ENDPOINT), options)
        //     .map((json: any) => (new Certificate(json)));
        return Observable.of([].map((json: any) => new Certificate(json)));
    }

    /**
     * Get all revoked certificates
     *
     * @returns {Certificate[]}
     */
    public getRevokedCertificates(): Observable<Certificate[]> {
        let options = new URLSearchParams();
        options.append('status', 'revoked');
        // return this.getRequest(this.fullUrl(CERTIFICATE_ENDPOINT), options)
        return Observable.of([].map((json: any) => new Certificate(json)));
    }

    /**
     * Gets a user by username
     *
     * @param username
     * @returns {Observable<User>}
     */
    public getUserByUsername(username: string): Observable<User> {
        return this.getRequest(this.fullUrl(USER_ENDPOINT + username + '/'));
    }

    /**
     * Update a user
     *
     * @param username
     * @param user
     * @returns {Observable<User>}
     */
    public updateUser(username: string, user: User): Observable<User> {
        return this.putRequest(this.fullUrl(USER_ENDPOINT + username + '/'), user);
    }

    /**
     * Obtains a JWT for the credentials provided
     *
     * @param username
     * @param password
     * @returns {Observable<string>}
     */
    public obtainToken(username: string, password: string): Observable<any> {
        let payload: any = {username, password};
        return this.postRequest(this.fullUrl(LOGIN_ENDPOINT), payload);
    }

    /**
     * Obtains a JWT when using a certificate
     *
     * @returns {Observable<string>}
     */
    public obtainCertificateToken(): Observable<any> {
        return this.getRequest(this.fullUrl(CERTIFICATE_LOGIN_ENDPOINT));
    }

    /**
     * Verifies the JWT
     *
     * @param token
     * @returns {Observable<boolean>}
     */
    public verifyToken(token: string): Observable<any> {
        let payload: any = {token};
        return this.postRequest(this.fullUrl(VERIFY_ENDPOINT), payload);
    }

    /**
     * Refreshes the JWT
     *
     * @param token
     * @returns {Observable<string>}
     */
    public refreshToken(token: string): Observable<any> {
        let payload: any = {token};
        return this.postRequest(this.fullUrl(REFRESH_ENDPOINT), payload);
    }

    /**
     * Helper method for executing GET requests
     *
     * @param url
     * @param search
     * @returns {Observable<any>}
     */
    private getRequest(url: string, search?: URLSearchParams): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json'
        });
        let options = new RequestOptions({headers, search});
        return this.http.get(url, options)
            .do((response: Response) => this.logger.debug('Response from GET ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response))
            .catch((response: Response) => {
                this.logger.debug('Response from GET ' + response.url + ': ', response);
                return this.errorHandler.handleError(response);
            });
    }

    /**
     * Helper method for executing POST requests
     *
     * @param url
     * @param payload
     * @param search
     * @returns {Observable<any>}
     */
    private postRequest(url: string, payload: any, search?: URLSearchParams): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({headers, search});
        return this.http.post(url, payload, options)
            .do((response: Response) => this.logger.debug('Response from POST ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response))
            .catch((response: Response) => {
                this.logger.debug('Response from POST ' + response.url + ': ', response);
                return this.errorHandler.handleError(response);
            });
    }

    /**
     * Helper method for executing PUT requests
     *
     * @param url
     * @param payload
     * @returns {Observable<any>}
     */
    private putRequest(url: string, payload: any): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({headers});
        return this.http.put(url, payload, options)
            .do((response: Response) => this.logger.debug('Response from PUT ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response))
            .catch((response: Response) => {
                this.logger.debug('Response from PUT ' + response.url + ': ', response);
                return this.errorHandler.handleError(response);
            });
    }

    /**
     * Helper method for executing DELETE requests
     * @param url
     * @returns {Observable<any>}
     */
    private deleteRequest(url: string): Observable<any> {
        let headers = new Headers({
            'Accept': 'application/json'
        });
        let options = new RequestOptions({headers});
        return this.http.delete(url, options)
            .do((response: Response) => this.logger.debug('Response from DELETE ' + response.url + ': ', response))
            .map((response: Response) => this.dataExtractor.extractData(response))
            .catch((response: Response) => {
                this.logger.debug('Response from DELETE ' + response.url + ': ', response);
                return this.errorHandler.handleError(response);
            });
    }

    /**
     * Helper to prepend the path with the API base url
     * @param path
     * @return {string}
     */
    private fullUrl(path: string): string {
        return API_BASE_URL + path;
    }
}