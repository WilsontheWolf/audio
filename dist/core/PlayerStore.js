"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerStore = void 0;
const Player_1 = require("./Player");
/**
 * Represents a collection of players.
 */
class PlayerStore extends Map {
    constructor(node) {
        super();
        /**
         * The [[Node]] or [[ClusterNode]] that created this store.
         */
        Object.defineProperty(this, "node", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.node = node;
    }
    /**
     * Gets an existing player, creating a new one if none was found.
     * @param key The guild's ID to get a player from.
     */
    get(key) {
        let player = super.get(key);
        if (!player) {
            player = new Player_1.Player(this.node, key);
            this.set(key, player);
        }
        return player;
    }
}
exports.PlayerStore = PlayerStore;
//# sourceMappingURL=PlayerStore.js.map