import { Backoff } from 'backoff';
import * as WebSocket from 'ws';
import type { BaseNode } from '../base/BaseNode';
export interface Options extends WebSocket.ClientOptions {
    resumeKey?: string;
    resumeTimeout?: number;
}
export declare class Connection<T extends BaseNode = BaseNode> {
    readonly node: T;
    url: string;
    options: Options;
    resumeKey?: string;
    ws: WebSocket;
    reconnectTimeout: number;
    private _backoff;
    private _listeners;
    private _queue;
    constructor(node: T, url: string, options?: Options);
    get backoff(): Backoff;
    set backoff(b: Backoff);
    connect(): void;
    configureResuming(timeout?: number, key?: string): Promise<void>;
    send(d: object): Promise<void>;
    close(code?: number, data?: string): Promise<void>;
    private _reconnect;
    private _registerWSEventListeners;
    private _flush;
    private _send;
}
//# sourceMappingURL=Connection.d.ts.map