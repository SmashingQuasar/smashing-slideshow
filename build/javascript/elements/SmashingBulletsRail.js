class SmashingBulletsRail {
    node;
    bullets = [];
    constructor(node) {
        if (node === undefined) {
            this.node = document.createElement("nav");
        }
        else {
            this.node = node;
        }
    }
    getNode() {
        return this.node;
    }
    add(bullet) {
        this.bullets.push(bullet);
        this.node.appendChild(bullet.getNode());
    }
    getBullets() {
        return Array.from(this.bullets);
    }
}
export { SmashingBulletsRail };
