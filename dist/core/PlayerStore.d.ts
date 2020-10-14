import type { BaseNode } from '../base/BaseNode';
import { Player } from './Player';
/**
 * Represents a collection of players.
 */
export declare class PlayerStore<T extends BaseNode = BaseNode> extends Map<string, Player<T>> {
    /**
     * The [[Node]] or [[ClusterNode]] that created this store.
     */
    readonly node: T;
    constructor(node: T);
    /**
     * Gets an existing player, creating a new one if none was found.
     * @param key The guild's ID to get a player from.
     */
    get(key: string): Player<T>;
}
//# sourceMappingURL=PlayerStore.d.ts.map