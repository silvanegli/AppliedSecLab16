import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Logger } from './logging';

@Injectable()
export class ErrorHandler {
    public constructor(
        private logger: Logger
    ) { }

    public  handleError(error: Response): Observable<CAApiError> {
        if (400 <= error.status && error.status <= 499) {
            return this.handleClientError(error);
        }
        else if (500 <= error.status && error.status <= 599) {
            return this.handleServerError(error);
        }
    }

    private handleClientError(error: Response): Observable<CAApiError> {
        let body: any;
        try {
            body = error.json();
        }
        catch (error) {
            body = {};
        }

        let backendError: CAApiError = {
            statusCode: error.status,
            detail: body.detail,
            kind: ErrorKind.ClientError,
            message: ''
        };

        switch (error.status) {
            case 400:
                backendError.kind = ErrorKind.ValidationError;
                backendError.message = 'Some values are wrong!';
                backendError.validationErrors = body;
                break;
            case 403:
                backendError.kind = ErrorKind.NoPermissionError;
                backendError.message = body.detail || '';
                break;
            case 404:
                if (body.detail) {
                    backendError.kind = ErrorKind.ResourceNotFoundError;
                    backendError.message = body.detail;
                }
                else {
                    backendError.kind = ErrorKind.InvalidEndpointError;
                    backendError.message = body.message || '';
                    this.logger.error('Invalid endpoint: ' + error.url, error);
                }
                break;
            default:
                backendError.message = body.detail || body.message || '';
        }
        return Observable.throw(backendError);
    }

    private handleServerError(error: Response): Observable<CAApiError> {
        this.logger.error('Server error:', error);

        let body: any;
        try {
            body = error.json();
        }
        catch (error) {
            body = {};
        }

        return Observable.throw({
            statusCode: error.status,
            detail: body.detail,
            errorKind: ErrorKind.ServerError,
            errorText: body.message || ''
        });
    }
}

export interface CAApiError {
    statusCode: number;
    detail: string;
    kind: ErrorKind;
    message: string;
    validationErrors?: any;
}

export enum ErrorKind {
    ServerError,
    ClientError,
    ValidationError,
    NoPermissionError,
    ResourceNotFoundError,
    InvalidEndpointError
}