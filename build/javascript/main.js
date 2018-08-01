"use strict";
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var SmashingSlide = (function () {
    function SmashingSlide(content) {
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);
    }
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
    return SmashingSlide;
}());
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
        if (slide instanceof SmashingSlide) {
            index = this.find(slide);
            if (index === -1) {
                return false;
            }
        }
        else if (isNumeric(slide)) {
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
var SmashingSlideshow = (function () {
    function SmashingSlideshow(root) {
        var _this = this;
        var rect = root.getBoundingClientRect();
        this.width = rect.width;
        var elements = root.children;
        this.elements = Array.from(elements);
        this.rail = new SmashingRail();
        this.rail.setWidth(this.width * this.elements.length + "px");
        this.elements.forEach(function (element) {
            if (element instanceof HTMLElement) {
                var slide = new SmashingSlide(element);
                slide.setWidth(_this.width + "px");
                _this.rail.add(slide);
            }
            else {
                throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
            }
        });
        root.appendChild(this.rail.getNode());
    }
    SmashingSlideshow.prototype.getRail = function () {
        return this.rail;
    };
    SmashingSlideshow.prototype.getSlides = function () {
        return this.rail.getSlides();
    };
    SmashingSlideshow.prototype.remove = function (slide) {
        return this.rail.remove(slide);
    };
    SmashingSlideshow.prototype.goTo = function (index) {
        if (index > this.elements.length) {
            index = index - this.elements.length;
            this.goTo(index);
        }
        else {
            this.rail.getNode().style.left = "-" + (index - 1) * this.width + "px";
        }
    };
    SmashingSlideshow.prototype.fadeTo = function (index) {
        var _this = this;
        if (index > this.elements.length) {
            index = index - this.elements.length;
            this.fadeTo(index);
        }
        else {
            this.rail.setOpacity(0);
            this.rail.setSlideTime("0s, 0.25s");
            setTimeout(function () {
                _this.goTo(index);
                _this.rail.setOpacity(1);
                setTimeout(function () {
                    _this.rail.setSlideTime("0.5s, 0.25s");
                }, 500);
            }, 500);
        }
    };
    return SmashingSlideshow;
}());
