import { request, STATUS_CODES } from 'http';
import { URL } from 'url';
import { RoutePlanner } from './RoutePlanner';
export class HTTPError extends Error {
    constructor(httpMessage, method, url) {
        super(`${httpMessage.statusCode} ${STATUS_CODES[httpMessage.statusCode]}`);
        this.statusCode = httpMessage.statusCode;
        this.headers = httpMessage.headers;
        this.name = this.constructor.name;
        this.path = url.toString();
        this.method = method;
    }
    get statusMessage() {
        return STATUS_CODES[this.statusCode];
    }
}
export var LoadType;
(function (LoadType) {
    LoadType["TRACK_LOADED"] = "TRACK_LOADED";
    LoadType["PLAYLIST_LOADED"] = "PLAYLIST_LOADED";
    LoadType["SEARCH_RESULT"] = "SEARCH_RESULT";
    LoadType["NO_MATCHES"] = "NO_MATCHES";
    LoadType["LOAD_FAILED"] = "LOAD_FAILED";
})(LoadType || (LoadType = {}));
export class Http {
    constructor(node, input, base) {
        this.node = node;
        this.input = input;
        this.base = base;
        this.routeplanner = new RoutePlanner(this);
    }
    get url() {
        return new URL(this.input, this.base);
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
            const req = request({
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
//# sourceMappingURL=Http.js.map