/// <reference types="node" />
import { EventEmitter } from 'events';
import type { BaseNode, VoiceServerUpdate, VoiceStateUpdate } from '../base/BaseNode';
import type { SendOpcode } from '../types/SendPayloads';
import type { Track } from './Http';
export declare enum Status {
    INSTANTIATED = 0,
    PLAYING = 1,
    PAUSED = 2,
    ENDED = 3,
    ERRORED = 4,
    STUCK = 5,
    UNKNOWN = 6
}
export declare enum EventType {
    TRACK_START = "TrackStartEvent",
    TRACK_END = "TrackEndEvent",
    TRACK_EXCEPTION = "TrackExceptionEvent",
    TRACK_STUCK = "TrackStuckEvent",
    WEBSOCKET_CLOSED = "WebSocketClosedEvent"
}
export interface PlayerOptions {
    start?: number;
    end?: number;
    noReplace?: boolean;
}
export interface EqualizerBand {
    band: number;
    gain: number;
}
export interface JoinOptions {
    mute?: boolean;
    deaf?: boolean;
}
export declare class Player<T extends BaseNode = BaseNode> extends EventEmitter {
    readonly node: T;
    guildID: string;
    status: Status;
    constructor(node: T, guildID: string);
    get playing(): boolean;
    get paused(): boolean;
    get voiceState(): VoiceStateUpdate | undefined;
    get voiceServer(): VoiceServerUpdate | undefined;
    moveTo(node: BaseNode): Promise<void>;
    leave(): Promise<any>;
    join(channel: string | null, { deaf, mute }?: JoinOptions): Promise<any>;
    play(track: string | Track, { start, end, noReplace }?: PlayerOptions): Promise<void>;
    setVolume(volume: number): Promise<void>;
    setEqualizer(bands: EqualizerBand[]): Promise<void>;
    seek(position: number): Promise<void>;
    pause(pause?: boolean): Promise<void>;
    stop(): Promise<void>;
    destroy(): Promise<void>;
    voiceUpdate(sessionId: string, event: VoiceServerUpdate): Promise<void>;
    send(data: SendOpcode): Promise<void>;
}
//# sourceMappingURL=Player.d.ts.map