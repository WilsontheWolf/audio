"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _backoff, _queue, _send, _open, _close, _upgrade, _message, _error;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = exports.ConnectionEvents = exports.WebSocketEvents = void 0;
const backoff_1 = require("backoff");
const events_1 = require("events");
const WebSocket = require("ws");
var WebSocketEvents;
(function (WebSocketEvents) {
    WebSocketEvents["Open"] = "open";
    WebSocketEvents["Close"] = "close";
    WebSocketEvents["Upgrade"] = "upgrade";
    WebSocketEvents["Message"] = "message";
    WebSocketEvents["Error"] = "error";
})(WebSocketEvents = exports.WebSocketEvents || (exports.WebSocketEvents = {}));
var ConnectionEvents;
(function (ConnectionEvents) {
    ConnectionEvents["Close"] = "close";
    ConnectionEvents["Error"] = "error";
    ConnectionEvents["Event"] = "event";
    ConnectionEvents["Open"] = "open";
    ConnectionEvents["PlayerUpdate"] = "playerUpdate";
    ConnectionEvents["Stats"] = "stats";
    ConnectionEvents["Upgrade"] = "upgrade";
})(ConnectionEvents = exports.ConnectionEvents || (exports.ConnectionEvents = {}));
class Connection {
    /* eslint-enable @typescript-eslint/explicit-member-accessibility */
    constructor(node, url, options = {}) {
        /* eslint-disable @typescript-eslint/explicit-member-accessibility */
        /**
         * The back-off queue.
         */
        _backoff.set(this, backoff_1.exponential());
        /**
         * The queue of requests to be processed.
         */
        _queue.set(this, []);
        /**
         * The bound callback function for `wsSend`.
         */
        _send.set(this, void 0);
        /**
         * The bound callback function for `onOpen`.
         */
        _open.set(this, void 0);
        /**
         * The bound callback function for `onClose`.
         */
        _close.set(this, void 0);
        /**
         * The bound callback function for `onUpgrade`.
         */
        _upgrade.set(this, void 0);
        /**
         * The bound callback function for `onMessage`.
         */
        _message.set(this, void 0);
        /**
         * The bound callback function for `onError`.
         */
        _error.set(this, void 0);
        this.node = node;
        this.url = url;
        this.options = options;
        this.resumeKey = options.resumeKey;
        this.ws = null;
        __classPrivateFieldSet(this, _send, this.wsSend.bind(this));
        __classPrivateFieldSet(this, _open, this.onOpen.bind(this));
        __classPrivateFieldSet(this, _close, this.onClose.bind(this));
        __classPrivateFieldSet(this, _upgrade, this.onUpgrade.bind(this));
        __classPrivateFieldSet(this, _message, this.onMessage.bind(this));
        __classPrivateFieldSet(this, _error, this.onError.bind(this));
    }
    /**
     * Connects to the server.
     */
    connect() {
        // Create a new ready listener if none was set.
        if (!__classPrivateFieldGet(this, _backoff).listenerCount('ready')) {
            __classPrivateFieldGet(this, _backoff).on('ready', () => this._connect().catch((error) => this.node.emit("error" /* Error */, error)));
        }
        return this._connect();
    }
    /**
     * Configures the resuming for this connection.
     * @param timeout The number of seconds after disconnecting before the session is closed anyways.
     * This is useful for avoiding accidental leaks.
     * @param key The key to send when resuming the session. Set to `null` or leave unset to disable resuming.
     */
    configureResuming(timeout = 60, key = null) {
        this.resumeKey = key;
        return this.send({
            op: 'configureResuming',
            key,
            timeout
        });
    }
    /**
     * Sends a message to the websocket.
     * @param payload The data to be sent to the websocket.
     */
    send(payload) {
        if (!this.ws)
            return Promise.reject(new Error('The client has not been initialized.'));
        return new Promise((resolve, reject) => {
            const encoded = JSON.stringify(payload);
            const send = { resolve, reject, data: encoded };
            if (this.ws.readyState === WebSocket.OPEN)
                this.wsSend(send);
            else
                __classPrivateFieldGet(this, _queue).push(send);
        });
    }
    /**
     * Closes the WebSocket connection.
     * @param code The close code.
     * @param data The data to be sent.
     */
    async close(code, data) {
        if (!this.ws)
            return false;
        this.ws.off("close" /* Close */, __classPrivateFieldGet(this, _close));
        this.ws.close(code, data);
        // @ts-expect-error Arguments are passed, TypeScript just does not recognize them.
        this.node.emit("close" /* Close */, ...(await events_1.once(this.ws, "close" /* Close */)));
        __classPrivateFieldGet(this, _backoff).removeAllListeners();
        this.ws.removeAllListeners();
        this.ws = null;
        return true;
    }
    async _connect() {
        var _a;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            this.ws.close();
            this.ws.removeAllListeners();
            // @ts-expect-error Arguments are passed, TypeScript just does not recognize them.
            this.node.emit("close" /* Close */, ...(await events_1.once(this.ws, "close" /* Close */)));
        }
        const headers = {
            Authorization: this.node.password,
            'Num-Shards': this.node.shardCount || 1,
            'User-Id': this.node.userID
        };
        if (this.resumeKey)
            headers['Resume-Key'] = this.resumeKey;
        const ws = new WebSocket(this.url, { headers, ...this.options });
        this.ws = ws;
        this._registerWSEventListeners();
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            function onOpen() {
                resolve();
                cleanup();
            }
            function onError(error) {
                self.ws = null;
                reject(error);
                cleanup();
            }
            function onClose(code, reason) {
                self.ws = null;
                reject(new Error(`Closed connection with code ${code} and reason ${reason}`));
                cleanup();
            }
            function cleanup() {
                ws.off("open" /* Open */, onOpen);
                ws.off("error" /* Error */, onError);
                ws.off("close" /* Close */, onClose);
            }
            ws.on("open" /* Open */, onOpen);
            ws.on("error" /* Error */, onError);
            ws.on("close" /* Close */, onClose);
        });
    }
    _reconnect() {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED)
            __classPrivateFieldGet(this, _backoff).backoff();
    }
    _registerWSEventListeners() {
        if (!this.ws.listeners("open" /* Open */).includes(__classPrivateFieldGet(this, _open)))
            this.ws.on("open" /* Open */, __classPrivateFieldGet(this, _open));
        if (!this.ws.listeners("close" /* Close */).includes(__classPrivateFieldGet(this, _close)))
            this.ws.on("close" /* Close */, __classPrivateFieldGet(this, _close));
        if (!this.ws.listeners("upgrade" /* Upgrade */).includes(__classPrivateFieldGet(this, _upgrade)))
            this.ws.on("upgrade" /* Upgrade */, __classPrivateFieldGet(this, _upgrade));
        if (!this.ws.listeners("message" /* Message */).includes(__classPrivateFieldGet(this, _message)))
            this.ws.on("message" /* Message */, __classPrivateFieldGet(this, _message));
        if (!this.ws.listeners("error" /* Error */).includes(__classPrivateFieldGet(this, _error)))
            this.ws.on("error" /* Error */, __classPrivateFieldGet(this, _error));
    }
    async _flush() {
        await Promise.all(__classPrivateFieldGet(this, _queue).map(__classPrivateFieldGet(this, _send)));
        __classPrivateFieldSet(this, _queue, []);
    }
    wsSend({ resolve, reject, data }) {
        this.ws.send(data, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    }
    onOpen() {
        __classPrivateFieldGet(this, _backoff).reset();
        this.node.emit("open" /* Open */);
        this._flush()
            .then(() => this.configureResuming(this.options.resumeTimeout, this.options.resumeKey))
            .catch((e) => this.node.emit("error" /* Error */, e));
    }
    onClose(code, reason) {
        this.node.emit("close" /* Close */, code, reason);
        this._reconnect();
    }
    onUpgrade(req) {
        this.node.emit("upgrade" /* Upgrade */, req);
    }
    onMessage(d) {
        var _a;
        if (Array.isArray(d))
            d = Buffer.concat(d);
        else if (d instanceof ArrayBuffer)
            d = Buffer.from(d);
        let pk;
        try {
            pk = JSON.parse(d.toString());
        }
        catch (e) {
            this.node.emit("error" /* Error */, e);
            return;
        }
        if ('guildId' in pk)
            (_a = this.node.players.get(pk.guildId)) === null || _a === void 0 ? void 0 : _a.emit(pk.op, pk);
        // @ts-expect-error `pk` is an union of types, emit expects only one of them at at time.
        this.node.emit(pk.op, pk);
    }
    onError(err) {
        this.node.emit("error" /* Error */, err);
        this._reconnect();
    }
}
exports.Connection = Connection;
_backoff = new WeakMap(), _queue = new WeakMap(), _send = new WeakMap(), _open = new WeakMap(), _close = new WeakMap(), _upgrade = new WeakMap(), _message = new WeakMap(), _error = new WeakMap();
//# sourceMappingURL=Connection.js.map