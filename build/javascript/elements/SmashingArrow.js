"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingArrow = void 0;
var SmashingArrow = (function () {
    function SmashingArrow(configuration) {
        var _this = this;
        if (configuration.orientation !== "left" && configuration.orientation !== "right") {
            throw new SyntaxError("Arrow orientation must be either \"left\" or \"right\".");
        }
        this.slideshow = configuration.slideshow;
        if (configuration.node === undefined || configuration.node === null) {
            this.node = document.createElement("button");
            this.slideshow.getNode().appendChild(this.node);
        }
        else {
            this.node = configuration.node;
        }
        this.orientation = configuration.orientation;
        this.node.classList.add("smashing-arrow", this.orientation);
        this.node.addEventListener("click", function () {
            if (_this.orientation === "left") {
                if (_this.slideshow.getAnimation() === "slide") {
                    _this.slideshow.goTo(_this.slideshow.getActiveSlide().getIndex() - 1);
                }
                else {
                    _this.slideshow.fadeTo(_this.slideshow.getActiveSlide().getIndex() - 1);
                }
            }
            else if (_this.orientation === "right") {
                if (_this.slideshow.getAnimation() === "slide") {
                    _this.slideshow.goTo(_this.slideshow.getActiveSlide().getIndex() + 1);
                }
                else {
                    _this.slideshow.fadeTo(_this.slideshow.getActiveSlide().getIndex() + 1);
                }
            }
        });
    }
    return SmashingArrow;
}());
exports.SmashingArrow = SmashingArrow;
