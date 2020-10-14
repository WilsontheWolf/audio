import { Player } from './Player';
/**
 * Represents a collection of players.
 */
export class PlayerStore extends Map {
    constructor(node) {
        super();
        this.node = node;
    }
    /**
     * Gets an existing player, creating a new one if none was found.
     * @param key The guild's ID to get a player from.
     */
    get(key) {
        let player = super.get(key);
        if (!player) {
            player = new Player(this.node, key);
            this.set(key, player);
        }
        return player;
    }
}
//# sourceMappingURL=PlayerStore.js.map