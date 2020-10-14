/// <reference types="node" />
import { EventEmitter } from 'events';
import type { BaseNode, VoiceServerUpdate, VoiceStateUpdate } from '../base/BaseNode';
import type { OutgoingEqualizerPayload, OutgoingPayload } from '../types/OutgoingPayloads';
import type { Track } from './Http';
export declare const enum Status {
    Instantiated = 0,
    Playing = 1,
    Paused = 2,
    Ended = 3,
    Errored = 4,
    Stuck = 5,
    Unknown = 6
}
export interface PlayerOptions {
    start?: number;
    end?: number;
    noReplace?: boolean;
}
export declare type EqualizerBand = OutgoingEqualizerPayload['bands'];
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
    get voiceState(): VoiceStateUpdate | null;
    get voiceServer(): VoiceServerUpdate | null;
    moveTo(node: BaseNode): Promise<void>;
    leave(): Promise<any>;
    join(channel: string | null, { deaf, mute }?: JoinOptions): Promise<any>;
    play(track: string | Track, { start, end, noReplace }?: PlayerOptions): Promise<void>;
    setVolume(volume: number): Promise<void>;
    setEqualizer(bands: EqualizerBand): Promise<void>;
    seek(position: number): Promise<void>;
    pause(pause?: boolean): Promise<void>;
    stop(): Promise<void>;
    destroy(): Promise<void>;
    voiceUpdate(sessionId: string, event: VoiceServerUpdate): Promise<void>;
    send(data: OutgoingPayload): Promise<void>;
}
//# sourceMappingURL=Player.d.ts.map