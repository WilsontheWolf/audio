"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = exports.LoadType = exports.HTTPError = void 0;
const http_1 = require("http");
const url_1 = require("url");
const RoutePlanner_1 = require("./RoutePlanner");
class HTTPError extends Error {
    constructor(httpMessage, method, url) {
        super(`${httpMessage.statusCode} ${http_1.STATUS_CODES[httpMessage.statusCode]}`);
        this.statusCode = httpMessage.statusCode;
        this.headers = httpMessage.headers;
        this.name = this.constructor.name;
        this.path = url.toString();
        this.method = method;
    }
    get statusMessage() {
        return http_1.STATUS_CODES[this.statusCode];
    }
}
exports.HTTPError = HTTPError;
var LoadType;
(function (LoadType) {
    /**
     * A single track is loaded.
     */
    LoadType["TrackLoaded"] = "TRACK_LOADED";
    /**
     * A playlist is loaded.
     */
    LoadType["PlaylistLoaded"] = "PLAYLIST_LOADED";
    /**
     * A search result is made (i.e `ytsearch: some song`).
     */
    LoadType["SearchResult"] = "SEARCH_RESULT";
    /**
     * No matches/sources could be found for a given identifier.
     */
    LoadType["NoMatches"] = "NO_MATCHES";
    /**
     * Lavaplayer failed to load something for some reason.
     */
    LoadType["LoadFailed"] = "LOAD_FAILED";
})(LoadType = exports.LoadType || (exports.LoadType = {}));
class Http {
    constructor(node, input, base) {
        this.node = node;
        this.input = input;
        this.base = base;
        this.routeplanner = new RoutePlanner_1.RoutePlanner(this);
    }
    get url() {
        return new url_1.URL(this.input, this.base);
    }
    load(identifier) {
        const { url } = this;
        url.pathname = '/loadtracks';
        url.searchParams.append('identifier', identifier);
        return this.do('GET', url);
    }
    decode(tracks) {
        const { url } = this;
        if (Array.isArray(tracks)) {
            url.pathname = '/decodetracks';
            return this.do('POST', url, Buffer.from(JSON.stringify(tracks)));
        }
        url.pathname = '/decodetrack';
        url.searchParams.append('track', tracks);
        return this.do('GET', url);
    }
    async do(method, url, data) {
        const message = await new Promise((resolve) => {
            const req = http_1.request({
                method,
                hostname: url.hostname,
                port: url.port,
                protocol: url.protocol,
                path: url.pathname + url.search,
                headers: {
                    Authorization: this.node.password,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }, resolve);
            if (data)
                req.write(data);
            req.end();
        });
        if (message.statusCode && message.statusCode >= 200 && message.statusCode < 300) {
            const chunks = [];
            for await (const chunk of message) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const data = Buffer.concat(chunks);
            return JSON.parse(data.toString());
        }
        throw new HTTPError(message, method, url);
    }
}
exports.Http = Http;
//# sourceMappingURL=Http.js.map