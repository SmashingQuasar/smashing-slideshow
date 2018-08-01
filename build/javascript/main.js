"use strict";
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var SmashingArrow = (function () {
    function SmashingArrow(orientation, slideshow) {
        var _this = this;
        if (["left", "right"].indexOf(orientation) === -1) {
            throw new SyntaxError("Arrow orientation must be either \"left\" or \"right\".");
        }
        this.slideshow = slideshow;
        this.node = document.createElement("button");
        this.orientation = orientation;
        this.node.classList.add("smashing-arrow", this.orientation);
        this.slideshow.getNode().appendChild(this.node);
        this.node.addEventListener("click", function () {
            console.log(_this.slideshow);
            if (_this.orientation === "left") {
                _this.slideshow.goTo(_this.slideshow.getActiveSlide().getIndex() - 1);
            }
            else if (_this.orientation === "right") {
                _this.slideshow.goTo(_this.slideshow.getActiveSlide().getIndex() + 1);
            }
        });
    }
    return SmashingArrow;
}());
var SmashingSlide = (function () {
    function SmashingSlide(content, slideshow) {
        this.index = 0;
        this.dragged = false;
        this.dragX = 0;
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);
        this.slideshow = slideshow;
        this.node.setAttribute("draggable", "true");
        this.node.addEventListener("mousedown", this.dragStart.bind(this));
        this.node.addEventListener("mousemove", this.drag.bind(this));
        this.node.addEventListener("mouseup", this.dragEnd.bind(this));
        this.node.addEventListener("mouseleave", this.dragEnd.bind(this));
    }
    SmashingSlide.prototype.dragStart = function (event) {
        this.dragged = true;
        this.slideshow.getRail().setSlideTime("0s, 0.5s");
        this.dragX = event.clientX;
    };
    SmashingSlide.prototype.drag = function (event) {
        if (this.dragged) {
            var calc = -((this.dragX - event.clientX) + this.index * parseFloat("" + this.getWidth()));
            this.slideshow.getRail().getNode().style.left = calc + "px";
        }
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
                    this.slideshow.goTo(this.index + 1);
                }
                else {
                    this.slideshow.goTo(this.index - 1);
                }
            }
            else {
                this.slideshow.goTo(this.index);
            }
            this.slideshow.getRail().setSlideTime("0.5s, 0.5s");
        }
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
var SmashingViewport = (function () {
    function SmashingViewport() {
        this.node = document.createElement("smashing-viewport");
    }
    SmashingViewport.prototype.getNode = function () {
        return this.node;
    };
    return SmashingViewport;
}());
var SmashingSlideshow = (function () {
    function SmashingSlideshow(root) {
        this.arrows = [];
        this.node = root;
        var rect = root.getBoundingClientRect();
        this.width = rect.width;
        var elements = this.node.children;
        this.elements = Array.from(elements);
        this.viewport = new SmashingViewport();
        this.rail = new SmashingRail();
        this.rail.setWidth(this.width * this.elements.length + "px");
        for (var i = 0; i < this.elements.length; ++i) {
            var element = this.elements[i];
            if (element instanceof HTMLElement) {
                var slide = new SmashingSlide(element, this);
                slide.setWidth(this.width + "px");
                slide.setIndex(i);
                this.rail.add(slide);
            }
            else {
                throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
            }
        }
        this.viewport.getNode().appendChild(this.rail.getNode());
        this.node.appendChild(this.viewport.getNode());
        var left_arrow = new SmashingArrow("left", this);
        var right_arrow = new SmashingArrow("right", this);
        this.arrows.push(left_arrow, right_arrow);
        this.activeSlide = this.getSlides()[0];
    }
    SmashingSlideshow.prototype.getNode = function () {
        return this.node;
    };
    SmashingSlideshow.prototype.getActiveSlide = function () {
        return this.activeSlide;
    };
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
        if (index < 0) {
            index = 0;
        }
        if (index > this.elements.length) {
            index = index - this.elements.length;
            this.goTo(index);
        }
        else {
            this.rail.getNode().style.left = "-" + (index) * this.width + "px";
            this.activeSlide = this.getSlides()[index];
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
