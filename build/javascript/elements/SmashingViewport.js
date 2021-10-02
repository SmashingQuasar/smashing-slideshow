"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingViewport = void 0;
var SmashingViewport = (function () {
    function SmashingViewport(node) {
        if (node === undefined) {
            this.node = document.createElement("smashing-viewport");
        }
        else {
            this.node = node;
        }
    }
    SmashingViewport.prototype.getNode = function () {
        return this.node;
    };
    return SmashingViewport;
}());
exports.SmashingViewport = SmashingViewport;
