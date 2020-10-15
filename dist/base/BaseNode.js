"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNode = void 0;
const events_1 = require("events");
const ws_1 = require("ws");
const Connection_1 = require("../core/Connection");
const Http_1 = require("../core/Http");
const PlayerStore_1 = require("../core/PlayerStore");
class BaseNode extends events_1.EventEmitter {
    constructor({ password, userID, shardCount, hosts, host }) {
        super();
        this.http = null;
        this.connection = null;
        this.voiceStates = new Map();
        this.voiceServers = new Map();
        this._expectingConnection = new Set();
        this.password = password;
        this.userID = userID;
        this.shardCount = shardCount;
        this.players = new PlayerStore_1.PlayerStore(this);
        if (host) {
            this.http = new Http_1.Http(this, `http://${host}`);
            this.connection = new Connection_1.Connection(this, `ws://${host}`);
        }
        else if (hosts) {
            this.http = hosts.rest ? new Http_1.Http(this, hosts.rest) : null;
            this.connection = hosts.ws
                ? typeof hosts.ws === 'string'
                    ? new Connection_1.Connection(this, hosts.ws)
                    : new Connection_1.Connection(this, hosts.ws.url, hosts.ws.options)
                : null;
        }
    }
    /**
     * Connects to the server.
     */
    connect() {
        return this.connection.connect();
    }
    /**
     * Whether or not the node is connected to the websocket.
     */
    get connected() {
        var _a, _b;
        return ((_b = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.ws) === null || _b === void 0 ? void 0 : _b.readyState) === ws_1.default.OPEN;
    }
    /**
     * Loads a song.
     * @param identifier The track to be loaded.
     * @example
     * ```typescript
     * // Load from URL:
     *
     * const result = await node.load('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
     * console.log(result);
     * // {
     * //   "loadType": "TRACK_LOADED",
     * //   "playlistInfo": {},
     * //   "tracks": [
     * //     {
     * //       "track": "QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA==",
     * //       "info": {
     * //         "identifier": "dQw4w9WgXcQ",
     * //         "isSeekable": true,
     * //         "author": "RickAstleyVEVO",
     * //         "length": 212000,
     * //         "isStream": false,
     * //         "position": 0,
     * //         "title": "Rick Astley - Never Gonna Give You Up",
     * //         "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * //       }
     * //     }
     * //   ]
     * // }
     * ```
     *
     * @example
     * ```typescript
     * // Load from YouTube search:
     *
     * const result = await node.load('ytsearch: Never Gonna Give You Up');
     * console.log(result);
     * // {
     * //   "loadType": "SEARCH_RESULT",
     * //   "playlistInfo": {},
     * //   "tracks": [
     * //     {
     * //       "track": "...",
     * //       "info": {
     * //         "identifier": "dQw4w9WgXcQ",
     * //         "isSeekable": true,
     * //         "author": "RickAstleyVEVO",
     * //         "length": 212000,
     * //         "isStream": false,
     * //         "position": 0,
     * //         "title": "Rick Astley - Never Gonna Give You Up",
     * //         "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * //       }
     * //     },
     * //     ...
     * //   ]
     * // }
     * ```
     */
    load(identifier) {
        if (this.http)
            return this.http.load(identifier);
        throw new Error('no available http module');
    }
    decode(tracks) {
        if (this.http)
            return this.http.decode(tracks);
        throw new Error('no available http module');
    }
    voiceStateUpdate(packet) {
        if (packet.user_id !== this.userID)
            return Promise.resolve(false);
        if (packet.channel_id) {
            this.voiceStates.set(packet.guild_id, packet);
            return this._tryConnection(packet.guild_id);
        }
        this.voiceServers.delete(packet.guild_id);
        this.voiceStates.delete(packet.guild_id);
        return Promise.resolve(false);
    }
    voiceServerUpdate(packet) {
        this.voiceServers.set(packet.guild_id, packet);
        this._expectingConnection.add(packet.guild_id);
        return this._tryConnection(packet.guild_id);
    }
    disconnect(code, data) {
        if (this.connection)
            return this.connection.close(code, data);
        return Promise.resolve(false);
    }
    async destroy(code, data) {
        await Promise.all([...this.players.values()].map((player) => player.destroy()));
        await this.disconnect(code, data);
    }
    async _tryConnection(guildID) {
        const state = this.voiceStates.get(guildID);
        const server = this.voiceServers.get(guildID);
        if (!state || !server || !this._expectingConnection.has(guildID))
            return false;
        await this.players.get(guildID).voiceUpdate(state.session_id, server);
        this._expectingConnection.delete(guildID);
        return true;
    }
}
exports.BaseNode = BaseNode;
//# sourceMappingURL=BaseNode.js.map