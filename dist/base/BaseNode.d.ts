/// <reference types="node" />
import type { GatewaySendPayload, GatewayVoiceState, GatewayVoiceServerUpdateDispatch } from 'discord-api-types/v6';
import { EventEmitter } from 'events';
import { Connection, Options as ConnectionOptions } from '../core/Connection';
import { Http, Track, TrackInfo, TrackResponse } from '../core/Http';
import { PlayerStore } from '../core/PlayerStore';
export declare type VoiceServerUpdate = GatewayVoiceServerUpdateDispatch['d'];
export declare type VoiceStateUpdate = GatewayVoiceState;
export interface BaseNodeOptions {
    password: string;
    userID: string;
    shardCount?: number;
    hosts?: {
        rest?: string;
        ws?: string | {
            url: string;
            options: ConnectionOptions;
        };
    };
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
    connection?: Connection;
    players: PlayerStore<this>;
    http?: Http;
    voiceStates: Map<string, VoiceStateUpdate>;
    voiceServers: Map<string, VoiceServerUpdate>;
    private _expectingConnection;
    constructor({ password, userID, shardCount, hosts, host }: BaseNodeOptions);
    connect(): void;
    get connected(): boolean;
    load(identifier: string): Promise<TrackResponse>;
    decode(track: string): Promise<TrackInfo>;
    decode(tracks: string[]): Promise<Track[]>;
    voiceStateUpdate(packet: VoiceStateUpdate): Promise<boolean>;
    voiceServerUpdate(packet: VoiceServerUpdate): Promise<boolean>;
    disconnect(code?: number, data?: string): Promise<void>;
    destroy(code?: number, data?: string): Promise<void>;
    private _tryConnection;
}
//# sourceMappingURL=BaseNode.d.ts.map