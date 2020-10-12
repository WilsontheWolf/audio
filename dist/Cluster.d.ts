import { BaseCluster, ClusterFilter, ClusterSend } from "./base/BaseCluster";
import type { ClusterNodeOptions } from "./ClusterNode";
export interface ClusterOptions {
  filter?: ClusterFilter;
  send: ClusterSend;
  nodes?: ClusterNodeOptions[];
}
export declare class Cluster extends BaseCluster {
  filter: ClusterFilter;
  send: ClusterSend;
  constructor(options: ClusterOptions);
}
//# sourceMappingURL=Cluster.d.ts.map
