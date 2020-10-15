"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const BaseNode_1 = require("./base/BaseNode");
class Node extends BaseNode_1.BaseNode {
    constructor(options, send) {
        super(options);
        this.send = send;
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map