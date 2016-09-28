import { Injectable } from '@angular/core';
import { Response, ResponseType } from '@angular/http';

@Injectable()
export class DataExtractor {
    public extractData(response: Response): any {
        if (response.type !== ResponseType.Default) {
            return null;
        }

        switch (response.status) {
            case 204:
                return null;
            default:
                return response.json();
        }
    }
}