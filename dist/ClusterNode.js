"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterNode = void 0;
const BaseNode_1 = require("./base/BaseNode");
require("./core/Connection");
class ClusterNode extends BaseNode_1.BaseNode {
    constructor(cluster, options) {
        super(options);
        this.cluster = cluster;
        this.tags = new Set(options.tags || []);
        this.send = this.cluster.send.bind(this.cluster);
        this.stats = null;
        this.on("stats" /* Stats */, (stats) => (this.stats = stats));
    }
    emit(event, ...args) {
        // @ts-expect-error Expect same arguments as parent.
        if (this.listenerCount(name))
            super.emit(name, ...args);
        return this.cluster.emit(event, ...args);
    }
    async destroy(code, data) {
        await super.destroy(code, data);
        this.cluster.nodes.splice(this.cluster.nodes.indexOf(this), 1);
    }
}
exports.ClusterNode = ClusterNode;
//# sourceMappingURL=ClusterNode.js.map