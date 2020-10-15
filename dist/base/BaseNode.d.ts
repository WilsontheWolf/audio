/// <reference types="node" />
import type { GatewaySendPayload, GatewayVoiceServerUpdateDispatch, GatewayVoiceState } from 'discord-api-types/v6';
import { EventEmitter } from 'events';
import { Connection, Options as ConnectionOptions } from '../core/Connection';
import { Http, Track, TrackInfo, TrackResponse } from '../core/Http';
import { PlayerStore } from '../core/PlayerStore';
export declare type VoiceServerUpdate = GatewayVoiceServerUpdateDispatch['d'];
export declare type VoiceStateUpdate = GatewayVoiceState;
/**
 * The options for the node.
 */
export interface NodeOptions {
    /**
     * The password to use to login to the Lavalink server.
     * @example
     * ```json
     * "you-shall-not-pass"
     * ```
     */
    password: string;
    /**
     * The client's user ID.
     * @example
     * ```json
     * "266624760782258186"
     * ```
     */
    userID: string;
    /**
     * The total number of shards that your bot is running. (Optional, useful if you are load balancing).
     * @example
     * ```json
     * 0
     * ```
     */
    shardCount?: number;
    /**
     * The host options to use, this is a more advanced alternative to [[BaseNodeOptions.host]].
     */
    hosts?: {
        /**
         * The HTTP host of your Lavalink instance.
         * @example
         * ```json
         * "http://localhost"
         * ```
         *
         * @example
         * ```json
         * "http://localhost:2333"
         * ```
         */
        rest?: string;
        /**
         * The WS host of your Lavalink instance.
         * @example
         * ```json
         * "ws://localhost"
         * ```
         *
         * @example
         * ```json
         * "ws://localhost:2333"
         * ```
         */
        ws?: string | {
            url: string;
            options: ConnectionOptions;
        };
    };
    /**
     * A URL to your Lavalink instance without protocol.
     * @example
     * ```json
     * "localhost"
     * ```
     *
     * @example
     * ```json
     * "localhost:2333"
     * ```
     */
    host?: string;
}
export interface NodeSend {
    (guildID: string, packet: GatewaySendPayload): Promise<any>;
}
export declare abstract class BaseNode extends EventEmitter {
    abstract send: NodeSend;
    password: string;
    userID: string;
    shardCount?: number;
    players: PlayerStore<this>;
    http: Http | null;
    connection: Connection | null;
    voiceStates: Map<string, GatewayVoiceState>;
    voiceServers: Map<string, {
        token: string;
        guild_id: string;
        endpoint: string;
    }>;
    private _expectingConnection;
    constructor({ password, userID, shardCount, hosts, host }: NodeOptions);
    /**
     * Connects to the server.
     */
    connect(): Promise<void>;
    /**
     * Whether or not the node is connected to the websocket.
     */
    get connected(): boolean;
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
    load(identifier: string): Promise<TrackResponse>;
    /**
     * Decodes a track.
     * @param track The track to be decoded.
     * @example
     * ```typescript
     * const identifier = 'QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA==';
     *
     * const track = await http.decode(identifier);
     * console.log(track);
     * // Logs: {
     * //   "identifier": "dQw4w9WgXcQ",
     * //   "isSeekable": true,
     * //   "author": "RickAstleyVEVO",
     * //   "length": 212000,
     * //   "isStream": false,
     * //   "position": 0,
     * //   "title": "Rick Astley - Never Gonna Give You Up",
     * //   "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * // }
     * ```
     */
    decode(track: string): Promise<TrackInfo>;
    /**
     * Decodes multiple tracks.
     * @note This returns an array of [[Track]]s, not a [[TrackInfo]].
     * @param tracks The tracks to be decoded.
     */
    decode(tracks: string[]): Promise<Track[]>;
    voiceStateUpdate(packet: VoiceStateUpdate): Promise<boolean>;
    voiceServerUpdate(packet: VoiceServerUpdate): Promise<boolean>;
    disconnect(code?: number, data?: string): Promise<boolean>;
    destroy(code?: number, data?: string): Promise<void>;
    private _tryConnection;
}
//# sourceMappingURL=BaseNode.d.ts.map