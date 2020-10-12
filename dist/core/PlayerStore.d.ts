import type { BaseNode } from '../base/BaseNode';
import { Player } from './Player';
export declare class PlayerStore<T extends BaseNode = BaseNode> extends Map<string, Player<T>> {
    readonly node: T;
    constructor(node: T);
    get(key: string): Player<T>;
}
//# sourceMappingURL=PlayerStore.d.ts.map