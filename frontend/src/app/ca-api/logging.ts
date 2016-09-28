import { Injectable, Optional, OpaqueToken, Inject } from '@angular/core';

export enum LogLevel {
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    None = 10
}

/* tslint:disable:no-console */
@Injectable()
export class Logger {

    public constructor(
        private logLevel: LogLevel = LogLevel.Debug
    ) { }

    public debug(msg: string, ...obj: any[]): void {
        if (this.logLevel <= LogLevel.Debug) {
            console.debug('[LMT debug] ' + msg, ...obj);
        }
    }

    public error(msg: string, ...obj: any[]): void {
        if (this.logLevel <= LogLevel.Error) {
            console.error('[LMT error] ' + msg, ...obj);
        }
    }

    public info(msg: string, ...obj: any[]): void {
        if (this.logLevel <= LogLevel.Info) {
            console.info('[LMT info] ' + msg, ...obj);
        }
    }

    public warn(msg: string, ...obj: any[]): void {
        if (this.logLevel <= LogLevel.Warn) {
            console.warn('[LMT warning] ' + msg, ...obj);
        }
    }
}