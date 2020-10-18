/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { IncomingEventPayload, IncomingPlayerUpdatePayload, IncomingStatsPayload } from './types/IncomingPayloads';
import type { BaseCluster, ClusterSend } from './base/BaseCluster';
import { BaseNode, NodeOptions } from './base/BaseNode';
import { ConnectionEvents } from './core/Connection';
export interface ClusterNodeOptions extends NodeOptions {
    tags?: Iterable<string>;
}
export interface Stats {
    players: number;
    playingPlayers: number;
    uptime: number;
    memory?: {
        free: number;
        used: number;
        allocated: number;
        reservable: number;
    };
    cpu?: {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    };
    frameStats?: {
        sent: number;
        nulled: number;
        deficit: number;
    };
}
export declare class ClusterNode extends BaseNode {
    readonly cluster: BaseCluster;
    tags: Set<string>;
    send: ClusterSend;
    stats: Stats | null;
    constructor(cluster: BaseCluster, options: ClusterNodeOptions);
    emit(event: ConnectionEvents.Close, code: number, reason: string): boolean;
    emit(event: ConnectionEvents.Error, error: Error): boolean;
    emit(event: ConnectionEvents.Event, payload: IncomingEventPayload): boolean;
    emit(event: ConnectionEvents.Open): boolean;
    emit(event: ConnectionEvents.PlayerUpdate, payload: IncomingPlayerUpdatePayload): boolean;
    emit(event: ConnectionEvents.Stats, payload: IncomingStatsPayload): boolean;
    emit(event: ConnectionEvents.Upgrade, req: IncomingMessage): boolean;
    destroy(code?: number, data?: string): Promise<void>;
}
//# sourceMappingURL=ClusterNode.d.ts.map