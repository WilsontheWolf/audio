import WebSocket from "ws";
import { EventEmitter } from "events";
import { Connection } from "../core/Connection";
import { Http } from "../core/Http";
import { PlayerStore } from "../core/PlayerStore";
export class BaseNode extends EventEmitter {
  constructor({ password, userID, shardCount, hosts, host }) {
    super();
    this.voiceStates = new Map();
    this.voiceServers = new Map();
    this._expectingConnection = new Set();
    this.password = password;
    this.userID = userID;
    this.shardCount = shardCount;
    this.players = new PlayerStore(this);
    if (host) {
      this.http = new Http(this, `http://${host}`);
      this.connection = new Connection(this, `ws://${host}`);
    } else if (hosts) {
      if (hosts.rest) this.http = new Http(this, hosts.rest);
      if (hosts.ws)
        this.connection =
          typeof hosts.ws === "string"
            ? new Connection(this, hosts.ws)
            : new Connection(this, hosts.ws.url, hosts.ws.options);
    }
  }
  get connected() {
    if (!this.connection) return false;
    return this.connection.ws.readyState === WebSocket.OPEN;
  }
  load(identifier) {
    if (this.http) return this.http.load(identifier);
    throw new Error("no available http module");
  }
  decode(tracks) {
    if (this.http) return this.http.decode(tracks);
    throw new Error("no available http module");
  }
  voiceStateUpdate(packet) {
    if (packet.user_id !== this.userID) return Promise.resolve(false);
    if (packet.channel_id) {
      this.voiceStates.set(packet.guild_id, packet.session_id);
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
    if (this.connection) return this.connection.close(code, data);
    return Promise.resolve();
  }
  async destroy(code, data) {
    await Promise.all(
      [...this.players.values()].map((player) => player.destroy())
    );
    await this.disconnect(code, data);
  }
  async _tryConnection(guildID) {
    const state = this.voiceStates.get(guildID);
    const server = this.voiceServers.get(guildID);
    if (!state || !server || !this._expectingConnection.has(guildID))
      return false;
    await this.players.get(guildID).voiceUpdate(state, server);
    this._expectingConnection.delete(guildID);
    return true;
  }
}
//# sourceMappingURL=BaseNode.js.map
