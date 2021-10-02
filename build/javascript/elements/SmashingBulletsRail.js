"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingBulletsRail = void 0;
var SmashingBulletsRail = (function () {
    function SmashingBulletsRail(node) {
        this.bullets = [];
        if (node === undefined) {
            this.node = document.createElement("nav");
        }
        else {
            this.node = node;
        }
    }
    SmashingBulletsRail.prototype.getNode = function () {
        return this.node;
    };
    SmashingBulletsRail.prototype.add = function (bullet) {
        this.bullets.push(bullet);
        this.node.appendChild(bullet.getNode());
    };
    SmashingBulletsRail.prototype.getBullets = function () {
        return Array.from(this.bullets);
    };
    return SmashingBulletsRail;
}());
exports.SmashingBulletsRail = SmashingBulletsRail;
