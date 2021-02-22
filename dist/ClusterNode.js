"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterNode = void 0;
const BaseNode_1 = require("./base/BaseNode");
require("./core/Connection");
class ClusterNode extends BaseNode_1.BaseNode {
    constructor(cluster, options) {
        super(options);
        Object.defineProperty(this, "cluster", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cluster
        });
        Object.defineProperty(this, "tags", {
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
        Object.defineProperty(this, "stats", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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