import * as WebSocket from 'ws';
import type { BaseNode } from '../base/BaseNode';
import type { OutgoingPayload } from '../types/OutgoingPayloads';
export declare const enum WebSocketEvents {
    Open = "open",
    Close = "close",
    Upgrade = "upgrade",
    Message = "message",
    Error = "error"
}
export declare const enum ConnectionEvents {
    Close = "close",
    Error = "error",
    Event = "event",
    Open = "open",
    PlayerUpdate = "playerUpdate",
    Stats = "stats",
    Upgrade = "upgrade"
}
export interface Options extends WebSocket.ClientOptions {
    /**
     * The key to send when resuming the session. Set to `null` or leave unset to disable resuming.
     * @defaults `null`
     */
    resumeKey?: string | null;
    /**
     * The number of seconds after disconnecting before the session is closed anyways. This is useful for avoiding
     * accidental leaks.
     * @defaults `60`
     */
    resumeTimeout?: number;
}
export declare class Connection<T extends BaseNode = BaseNode> {
    #private;
    /**
     * The node that owns this connection.
     */
    readonly node: T;
    /**
     * The url the connection connects to.
     */
    readonly url: string;
    /**
     * The websocket options.
     */
    readonly options: Options;
    /**
     * The resume key, check [[Options.resumeKey]] for more information.
     */
    resumeKey?: string | null;
    /**
     * The websocket connection.
     */
    ws: WebSocket | null;
    constructor(node: T, url: string, options?: Options);
    /**
     * Connects to the server.
     */
    connect(): Promise<void>;
    /**
     * Configures the resuming for this connection.
     * @param timeout The number of seconds after disconnecting before the session is closed anyways.
     * This is useful for avoiding accidental leaks.
     * @param key The key to send when resuming the session. Set to `null` or leave unset to disable resuming.
     */
    configureResuming(timeout?: number, key?: string | null): Promise<void>;
    /**
     * Sends a message to the websocket.
     * @param payload The data to be sent to the websocket.
     */
    send(payload: OutgoingPayload): Promise<void>;
    /**
     * Closes the WebSocket connection.
     * @param code The close code.
     * @param data The data to be sent.
     */
    close(code?: number, data?: string): Promise<boolean>;
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