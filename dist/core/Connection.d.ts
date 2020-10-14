import WebSocket from 'ws';
import type { BaseNode } from '../base/BaseNode';
import type { OutgoingPayload } from '../types/OutgoingPayloads';
export interface Options extends WebSocket.ClientOptions {
    resumeKey?: string;
    resumeTimeout?: number;
}
export declare class Connection<T extends BaseNode = BaseNode> {
    readonly node: T;
    url: string;
    options: Options;
    resumeKey?: string;
    ws: WebSocket | null;
    private backoff;
    private _queue;
    private _send;
    private _open;
    private _close;
    private _upgrade;
    private _message;
    private _error;
    constructor(node: T, url: string, options?: Options);
    /**
     * Connects to the server.
     */
    connect(): void;
    configureResuming(timeout?: number, key?: string): Promise<void>;
    send(d: OutgoingPayload): Promise<void>;
    close(code?: number, data?: string): Promise<void>;
    private _connect;
    private _reconnect;
    private _registerWSEventListeners;
    private _flush;
    private wsSend;
    private onOpen;
    private onClose;
    private onUpgrade;
    private onMessage;
    private onError;
}
//# sourceMappingURL=Connection.d.ts.map