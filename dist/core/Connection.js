"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const backoff_1 = require("backoff");
const ws_1 = require("ws");
class Connection {
    constructor(node, url, options = {}) {
        this.backoff = backoff_1.exponential();
        this._queue = [];
        this.node = node;
        this.url = url;
        this.options = options;
        this.resumeKey = options.resumeKey;
        this.ws = null;
        this._send = this.wsSend.bind(this);
        this._open = this.onOpen.bind(this);
        this._close = this.onClose.bind(this);
        this._upgrade = this.onUpgrade.bind(this);
        this._message = this.onMessage.bind(this);
        this._error = this.onError.bind(this);
    }
    /**
     * Connects to the server.
     */
    connect() {
        // Create a new ready listener if none was set.
        if (!this.backoff.listenerCount('ready')) {
            this.backoff.on('ready', () => this._connect());
        }
    }
    configureResuming(timeout = 60, key = Math.random().toString(36)) {
        this.resumeKey = key;
        return this.send({
            op: 'configureResuming',
            key,
            timeout
        });
    }
    send(d) {
        if (!this.ws)
            return Promise.reject(new Error('The client has not been initialized.'));
        return new Promise((resolve, reject) => {
            const encoded = JSON.stringify(d);
            const send = { resolve, reject, data: encoded };
            if (this.ws.readyState === ws_1.default.OPEN)
                this.wsSend(send);
            else
                this._queue.push(send);
        });
    }
    close(code, data) {
        if (!this.ws)
            return Promise.resolve();
        this.ws.removeListener('close', this._close);
        return new Promise((resolve) => {
            this.ws.once('close', (code, reason) => {
                this.node.emit('close', code, reason);
                this.backoff.removeAllListeners();
                this.ws = null;
                resolve();
            });
            this.ws.close(code, data);
        });
    }
    _connect() {
        var _a;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.OPEN)
            this.ws.close();
        const headers = {
            Authorization: this.node.password,
            'Num-Shards': this.node.shardCount || 1,
            'User-Id': this.node.userID
        };
        if (this.resumeKey)
            headers['Resume-Key'] = this.resumeKey;
        this.ws = new ws_1.default(this.url, { headers, ...this.options });
        this._registerWSEventListeners();
    }
    _reconnect() {
        if (this.ws.readyState === ws_1.default.CLOSED)
            this.backoff.backoff();
    }
    _registerWSEventListeners() {
        if (!this.ws.listeners('open').includes(this._open))
            this.ws.on('open', this._open);
        if (!this.ws.listeners('close').includes(this._close))
            this.ws.on('close', this._close);
        if (!this.ws.listeners('upgrade').includes(this._upgrade))
            this.ws.on('upgrade', this._upgrade);
        if (!this.ws.listeners('message').includes(this._message))
            this.ws.on('message', this._message);
        if (!this.ws.listeners('error').includes(this._error))
            this.ws.on('error', this._error);
    }
    async _flush() {
        await Promise.all(this._queue.map(this._send));
        this._queue = [];
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
        this.backoff.reset();
        this.node.emit('open');
        this._flush()
            .then(() => this.configureResuming(this.options.resumeTimeout, this.options.resumeKey))
            .catch((e) => this.node.emit('error', e));
    }
    onClose(code, reason) {
        this.node.emit('close', code, reason);
        this._reconnect();
    }
    onUpgrade(req) {
        this.node.emit('upgrade', req);
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
            this.node.emit('error', e);
            return;
        }
        if ('guildId' in pk)
            (_a = this.node.players.get(pk.guildId)) === null || _a === void 0 ? void 0 : _a.emit(pk.op, pk);
        this.node.emit(pk.op, pk);
    }
    onError(err) {
        this.node.emit('error', err);
        this._reconnect();
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map