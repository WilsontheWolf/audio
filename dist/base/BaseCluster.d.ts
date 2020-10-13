/// <reference types="node" />
import { EventEmitter } from 'events';
import { ClusterNode, ClusterNodeOptions } from '../ClusterNode';
import type { Player } from '../core/Player';
import type { VoiceServerUpdate, VoiceStateUpdate } from './BaseNode';
import type { GatewaySendPayload } from 'discord-api-types/v6';
export interface ClusterFilter {
    (node: ClusterNode, guildID: string): boolean;
}
export interface ClusterSend {
    (guildID: string, packet: GatewaySendPayload): any;
}
export declare abstract class BaseCluster extends EventEmitter {
    abstract send: ClusterSend;
    abstract filter: ClusterFilter;
    readonly nodes: ClusterNode[];
    constructor(options?: ClusterNodeOptions[]);
    connect(): void;
    spawn(options: ClusterNodeOptions): ClusterNode;
    spawn(options: ClusterNodeOptions[]): ClusterNode[];
    sort(): ClusterNode[];
    getNode(guildID: string): ClusterNode;
    has(guildID: string): boolean;
    get(guildID: string): Player<ClusterNode>;
    voiceStateUpdate(state: VoiceStateUpdate): Promise<boolean>;
    voiceServerUpdate(server: VoiceServerUpdate): Promise<boolean>;
}
//# sourceMappingURL=BaseCluster.d.ts.map