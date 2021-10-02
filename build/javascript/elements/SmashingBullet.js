"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingBullet = void 0;
var SmashingBullet = (function () {
    function SmashingBullet(index, slideshow) {
        var _this = this;
        this.node = document.createElement("button");
        this.index = index;
        this.node.appendChild(document.createTextNode("" + (this.index + 1)));
        this.slideshow = slideshow;
        this.node.addEventListener("click", function () {
            if (_this.slideshow.getAnimation() === "slide") {
                _this.slideshow.goTo(_this.index);
            }
            else {
                _this.slideshow.fadeTo(_this.index);
            }
        });
    }
    SmashingBullet.prototype.getNode = function () {
        return this.node;
    };
    SmashingBullet.prototype.setActive = function () {
        var BULLETS_RAIL = this.slideshow.getBulletsRail();
        var BULLETS = BULLETS_RAIL.getBullets();
        BULLETS.forEach(function (bullet) {
            bullet.getNode().classList.remove("active");
        });
        this.node.classList.add("active");
    };
    return SmashingBullet;
}());
exports.SmashingBullet = SmashingBullet;
