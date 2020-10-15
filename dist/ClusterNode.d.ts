import type { BaseCluster, ClusterSend } from './base/BaseCluster';
import { BaseNode, NodeOptions } from './base/BaseNode';
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
    emit(name: string | symbol, ...args: any[]): boolean;
    destroy(code?: number, data?: string): Promise<void>;
}
//# sourceMappingURL=ClusterNode.d.ts.map