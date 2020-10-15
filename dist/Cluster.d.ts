import { BaseCluster, ClusterFilter, ClusterSend } from './base/BaseCluster';
import type { ClusterNodeOptions } from './ClusterNode';
export interface ClusterOptions {
    filter?: ClusterFilter;
    nodes?: ClusterNodeOptions[];
}
export declare class Cluster extends BaseCluster {
    filter: ClusterFilter;
    send: ClusterSend;
    constructor(options: ClusterOptions, send: ClusterSend);
}
//# sourceMappingURL=Cluster.d.ts.map