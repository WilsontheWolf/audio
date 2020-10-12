import { EventEmitter } from "events";
export var Status;
(function (Status) {
  Status[(Status["INSTANTIATED"] = 0)] = "INSTANTIATED";
  Status[(Status["PLAYING"] = 1)] = "PLAYING";
  Status[(Status["PAUSED"] = 2)] = "PAUSED";
  Status[(Status["ENDED"] = 3)] = "ENDED";
  Status[(Status["ERRORED"] = 4)] = "ERRORED";
  Status[(Status["STUCK"] = 5)] = "STUCK";
  Status[(Status["UNKNOWN"] = 6)] = "UNKNOWN";
})(Status || (Status = {}));
export var EventType;
(function (EventType) {
  EventType["TRACK_START"] = "TrackStartEvent";
  EventType["TRACK_END"] = "TrackEndEvent";
  EventType["TRACK_EXCEPTION"] = "TrackExceptionEvent";
  EventType["TRACK_STUCK"] = "TrackStuckEvent";
  EventType["WEBSOCKET_CLOSED"] = "WebSocketClosedEvent";
})(EventType || (EventType = {}));
export class Player extends EventEmitter {
  constructor(node, guildID) {
    super();
    this.status = Status.INSTANTIATED;
    this.node = node;
    this.guildID = guildID;
    this.on("event", (d) => {
      switch (d.type) {
        case EventType.TRACK_START:
          this.status = Status.PLAYING;
          break;
        case EventType.TRACK_END:
          if (d.reason !== "REPLACED") this.status = Status.ENDED;
          break;
        case EventType.TRACK_EXCEPTION:
          this.status = Status.ERRORED;
          break;
        case EventType.TRACK_STUCK:
          this.status = Status.STUCK;
          break;
        case EventType.WEBSOCKET_CLOSED:
          this.status = Status.ENDED;
          break;
        default:
          this.status = Status.UNKNOWN;
          break;
      }
    });
  }
  get playing() {
    return this.status === Status.PLAYING;
  }
  get paused() {
    return this.status === Status.PAUSED;
  }
  get voiceState() {
    const session = this.node.voiceStates.get(this.guildID);
    if (!session) return;
    return {
      guild_id: this.guildID,
      user_id: this.node.userID,
      session_id: session,
    };
  }
  get voiceServer() {
    return this.node.voiceServers.get(this.guildID);
  }
  async moveTo(node) {
    if (this.node === node) return;
    if (!this.voiceServer || !this.voiceState)
      throw new Error("no voice state/server data to move");
    await this.destroy();
    await Promise.all([
      node.voiceStateUpdate(this.voiceState),
      node.voiceServerUpdate(this.voiceServer),
    ]);
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
        self_mute: mute,
      },
    };
    return this.node.send(this.guildID, data);
  }
  async play(track, { start = 0, end = 0, noReplace = false } = {}) {
    await this.send({
      op: "play",
      guildId: this.guildID,
      track: typeof track === "object" ? track.track : track,
      startTime: start,
      endTime: end,
      noReplace,
    });
    this.status = Status.PLAYING;
  }
  setVolume(volume) {
    return this.send({
      op: "volume",
      guildId: this.guildID,
      volume,
    });
  }
  setEqualizer(bands) {
    return this.send({
      op: "equalizer",
      guildId: this.guildID,
      bands,
    });
  }
  seek(position) {
    return this.send({
      op: "seek",
      guildId: this.guildID,
      position,
    });
  }
  async pause(pause = true) {
    await this.send({
      op: "pause",
      guildId: this.guildID,
      pause,
    });
    if (pause) this.status = Status.PAUSED;
    else this.status = Status.PLAYING;
  }
  async stop() {
    await this.send({
      op: "stop",
      guildId: this.guildID,
    });
    this.status = Status.ENDED;
  }
  async destroy() {
    if (this.node.connected) {
      await this.send({
        op: "destroy",
        guildId: this.guildID,
      });
    }
    this.status = Status.ENDED;
    this.node.players.delete(this.guildID);
  }
  voiceUpdate(sessionId, event) {
    return this.send({
      op: "voiceUpdate",
      guildId: this.guildID,
      event: {
        endpoint: event.endpoint,
        guildId: event.guild_id,
        token: event.token,
      },
      sessionId,
    });
  }
  send(data) {
    const conn = this.node.connection;
    if (conn) return conn.send(data);
    return Promise.reject(new Error("no WebSocket connection available"));
  }
}
//# sourceMappingURL=Player.js.map
