"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingRail = void 0;
var SmashingSlide_js_1 = require("./SmashingSlide.js");
var SmashingRail = (function () {
    function SmashingRail() {
        this.slides = [];
        this.node = document.createElement("smashing-rail");
    }
    SmashingRail.prototype.getNode = function () {
        return this.node;
    };
    SmashingRail.prototype.setWidth = function (width) {
        this.node.style.width = width;
    };
    SmashingRail.prototype.setOpacity = function (opacity) {
        this.node.style.opacity = "" + opacity;
    };
    SmashingRail.prototype.setSlideTime = function (time) {
        this.node.style.transitionDuration = "" + time;
    };
    SmashingRail.prototype.add = function (slide) {
        this.slides.push(slide);
        this.node.appendChild(slide.getNode());
    };
    SmashingRail.prototype.find = function (slide) {
        return this.slides.findIndex(function (element) {
            return element.getNode() === slide.getNode();
        });
    };
    SmashingRail.prototype.remove = function (slide) {
        var index;
        if (slide instanceof SmashingSlide_js_1.SmashingSlide) {
            index = this.find(slide);
            if (index === -1) {
                return false;
            }
        }
        else if (Number.isSafeInteger(slide)) {
            index = slide;
        }
        else {
            throw new TypeError("Trying to remove an invalid element from SmashingRail.");
        }
        this.slides[index].getNode().remove();
        this.slides.splice(index, 1);
        return true;
    };
    SmashingRail.prototype.getSlides = function () {
        return this.slides;
    };
    return SmashingRail;
}());
exports.SmashingRail = SmashingRail;
