import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

    public info(msg: string, ...obj: any[]): void {
        console.debug('[SECLAB info] ' + msg, ...obj);
    }

    public debug(msg: string, ...obj: any[]): void {
        console.debug('[SECLAB debug] ' + msg, ...obj);
    }

    public error(msg: string, ...obj: any[]): void {
        console.error('[SECLAB error] ' + msg, ...obj);
    }
}