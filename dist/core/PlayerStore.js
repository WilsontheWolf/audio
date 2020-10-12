import { Player } from './Player';
export class PlayerStore extends Map {
    constructor(node) {
        super();
        this.node = node;
    }
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