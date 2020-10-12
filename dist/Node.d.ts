import { BaseNode, BaseNodeOptions, NodeSend } from './base/BaseNode';
export interface NodeOptions extends BaseNodeOptions {
    send: NodeSend;
}
export declare class Node extends BaseNode {
    send: NodeSend;
    constructor(options: NodeOptions);
}
//# sourceMappingURL=Node.d.ts.map