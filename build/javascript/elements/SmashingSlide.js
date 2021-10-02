"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingSlide = void 0;
var SmashingSlide = (function () {
    function SmashingSlide(content, slideshow) {
        this.index = 0;
        this.dragged = false;
        this.dragX = 0;
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);
        this.slideshow = slideshow;
        if (this.slideshow.getAnimation() === "slide") {
            this.node.addEventListener("mousedown", this.dragStart.bind(this), true);
            this.node.addEventListener("mousemove", this.drag.bind(this), true);
            this.node.addEventListener("mouseup", this.dragEnd.bind(this), true);
            this.node.addEventListener("mouseleave", this.dragEnd.bind(this), true);
        }
    }
    SmashingSlide.prototype.dragStart = function (event) {
        this.dragged = true;
        this.slideshow.getRail().setSlideTime("0s, 0.5s");
        this.dragX = event.clientX;
        event.preventDefault();
    };
    SmashingSlide.prototype.drag = function (event) {
        if (this.dragged) {
            var calc = -((this.dragX - event.clientX) + this.index * parseFloat("" + this.getWidth()));
            this.slideshow.getRail().getNode().style.left = calc + "px";
        }
        event.preventDefault();
    };
    SmashingSlide.prototype.dragEnd = function (event) {
        if (this.dragged) {
            this.dragged = false;
            var left = Math.abs(parseFloat("" + this.slideshow.getRail().getNode().style.left)) - (this.index * parseFloat("" + this.getWidth()));
            var forward = event.clientX - this.dragX;
            var width = parseFloat("" + this.getWidth());
            var delta = (width / 4) - Math.abs(left);
            if (delta < 0) {
                if (forward < 0) {
                    if (this.index === (this.slideshow.getElements().length - 1)) {
                        this.slideshow.goTo(this.index);
                    }
                    else {
                        this.slideshow.goTo(this.index + 1);
                    }
                }
                else {
                    if (this.index === 0) {
                        this.slideshow.goTo(this.index);
                    }
                    else {
                        this.slideshow.goTo(this.index - 1);
                    }
                }
            }
            else {
                this.slideshow.goTo(this.index);
            }
            this.slideshow.getRail().setSlideTime("0.5s, 0.5s");
        }
        event.preventDefault();
    };
    SmashingSlide.prototype.getNode = function () {
        return this.node;
    };
    SmashingSlide.prototype.setWidth = function (width) {
        this.node.style.width = width;
    };
    SmashingSlide.prototype.getWidth = function () {
        return this.node.style.width;
    };
    SmashingSlide.prototype.getContent = function () {
        return this.content;
    };
    SmashingSlide.prototype.getIndex = function () {
        return this.index;
    };
    SmashingSlide.prototype.setIndex = function (index) {
        this.index = index;
    };
    return SmashingSlide;
}());
exports.SmashingSlide = SmashingSlide;
