"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const BaseCluster_1 = require("./base/BaseCluster");
class Cluster extends BaseCluster_1.BaseCluster {
    constructor(options, send) {
        super(options.nodes);
        this.filter = options.filter || (() => true);
        this.send = send;
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=Cluster.js.map