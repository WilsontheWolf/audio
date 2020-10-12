import { BaseNode } from "./base/BaseNode";
export class ClusterNode extends BaseNode {
  constructor(cluster, options) {
    super(options);
    this.cluster = cluster;
    this.tags = new Set(options.tags || []);
    this.send = this.cluster.send.bind(this.cluster);
    this.stats = null;
    this.on("stats", (stats) => (this.stats = stats));
  }
  emit(name, ...args) {
    if (this.listenerCount(name)) super.emit(name, ...args);
    return this.cluster.emit(name, ...args);
  }
  async destroy(code, data) {
    await super.destroy(code, data);
    this.cluster.nodes.splice(this.cluster.nodes.indexOf(this), 1);
  }
}
//# sourceMappingURL=ClusterNode.js.map
