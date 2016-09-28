import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

    public info(msg: string, ...obj: any[]): void {
        console.debug('[LMT info] ' + msg, ...obj);
    }

    public debug(msg: string, ...obj: any[]): void {
        console.debug('[LMT debug] ' + msg, ...obj);
    }

    public error(msg: string, ...obj: any[]): void {
        console.error('[LMT error] ' + msg, ...obj);
    }
}