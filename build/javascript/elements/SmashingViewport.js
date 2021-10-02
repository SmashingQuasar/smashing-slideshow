class SmashingViewport {
    node;
    constructor(node) {
        if (node === undefined) {
            this.node = document.createElement("smashing-viewport");
        }
        else {
            this.node = node;
        }
    }
    getNode() {
        return this.node;
    }
}
export { SmashingViewport };
