"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const BaseCluster_1 = require("./base/BaseCluster");
class Cluster extends BaseCluster_1.BaseCluster {
    constructor(options, send) {
        super(options.nodes);
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "send", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.filter = options.filter || (() => true);
        this.send = send;
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=Cluster.js.map