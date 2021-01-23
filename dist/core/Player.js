"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Status = void 0;
const events_1 = require("events");
var Status;
(function (Status) {
    Status[Status["Instantiated"] = 0] = "Instantiated";
    Status[Status["Playing"] = 1] = "Playing";
    Status[Status["Paused"] = 2] = "Paused";
    Status[Status["Ended"] = 3] = "Ended";
    Status[Status["Errored"] = 4] = "Errored";
    Status[Status["Stuck"] = 5] = "Stuck";
    Status[Status["Unknown"] = 6] = "Unknown";
})(Status = exports.Status || (exports.Status = {}));
class Player extends events_1.EventEmitter {
    constructor(node, guildID) {
        super();
        this.status = 0 /* Instantiated */;
        this.node = node;
        this.guildID = guildID;
        this.on('event', (d) => {
            switch (d.type) {
                case 'TrackStartEvent':
                    this.status = 1 /* Playing */;
                    break;
                case 'TrackEndEvent':
                    if (d.reason !== 'REPLACED')
                        this.status = 3 /* Ended */;
                    break;
                case 'TrackExceptionEvent':
                    this.status = 4 /* Errored */;
                    break;
                case 'TrackStuckEvent':
                    this.status = 5 /* Stuck */;
                    break;
                case 'WebSocketClosedEvent':
                    this.status = 3 /* Ended */;
                    break;
                default:
                    this.status = 6 /* Unknown */;
                    break;
            }
        });
    }
    get playing() {
        return this.status === 1 /* Playing */;
    }
    get paused() {
        return this.status === 2 /* Paused */;
    }
    get voiceState() {
        const session = this.node.voiceStates.get(this.guildID);
        if (!session)
            return null;
        return {
            ...session,
            guild_id: this.guildID,
            user_id: this.node.userID
        };
    }
    get voiceServer() {
        var _a;
        return (_a = this.node.voiceServers.get(this.guildID)) !== null && _a !== void 0 ? _a : null;
    }
    async moveTo(node) {
        if (this.node === node)
            return;
        const { voiceState, voiceServer } = this;
        if (voiceServer === null || voiceState === null)
            throw new Error('no voice state/server data to move');
        await this.destroy();
        await Promise.all([node.voiceStateUpdate(voiceState), node.voiceServerUpdate(voiceServer)]);
    }
    leave() {
        return this.join(null);
    }
    join(channel, { deaf = false, mute = false } = {}) {
        this.node.voiceServers.delete(this.guildID);
        this.node.voiceStates.delete(this.guildID);
        const data = {
            op: 4,
            d: {
                guild_id: this.guildID,
                channel_id: channel,
                self_deaf: deaf,
                self_mute: mute
            }
        };
        return this.node.send(this.guildID, data);
    }
    async play(track, { start, end, noReplace, pause } = {}) {
        await this.send({
            op: 'play',
            guildId: this.guildID,
            track: typeof track === 'object' ? track.track : track,
            startTime: start,
            endTime: end,
            noReplace,
            pause
        });
        if (pause)
            this.status = 2 /* Paused */;
        else
            this.status = 1 /* Playing */;
    }
    setFilters(options) {
        return this.send({
            op: 'filters',
            guildId: this.guildID,
            ...options
        });
    }
    /**
     * @deprecated Please use `setFilters({ volume })` instead.
     * @param volume The new volume to be set.
     */
    setVolume(volume) {
        return this.setFilters({ volume });
    }
    /**
     * @deprecated Please use `setFilters({ bands })` instead.
     * @param bands The equalizer bads to be set.
     */
    setEqualizer(bands) {
        return this.setFilters({ bands });
    }
    seek(position) {
        return this.send({
            op: 'seek',
            guildId: this.guildID,
            position
        });
    }
    async pause(pause = true) {
        await this.send({
            op: 'pause',
            guildId: this.guildID,
            pause
        });
        if (pause)
            this.status = 2 /* Paused */;
        else
            this.status = 1 /* Playing */;
    }
    async stop() {
        await this.send({
            op: 'stop',
            guildId: this.guildID
        });
        this.status = 3 /* Ended */;
    }
    async destroy() {
        if (this.node.connected) {
            await this.send({
                op: 'destroy',
                guildId: this.guildID
            });
        }
        this.status = 3 /* Ended */;
        this.node.players.delete(this.guildID);
    }
    voiceUpdate(sessionId, event) {
        return this.send({
            op: 'voiceUpdate',
            guildId: this.guildID,
            event,
            sessionId
        });
    }
    send(data) {
        const conn = this.node.connection;
        if (conn)
            return conn.send(data);
        return Promise.reject(new Error('no WebSocket connection available'));
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map