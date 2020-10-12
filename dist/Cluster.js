import { BaseCluster } from './base/BaseCluster';
export class Cluster extends BaseCluster {
    constructor(options) {
        super(options.nodes);
        this.filter = options.filter || (() => true);
        this.send = options.send;
    }
}
//# sourceMappingURL=Cluster.js.map