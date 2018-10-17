"use strict";
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
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
        return this.bullets;
    };
    return SmashingBulletsRail;
}());
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
var SmashingArrow = (function () {
    function SmashingArrow(configuration) {
        var _this = this;
        if (["left", "right"].indexOf(configuration.orientation) === -1) {
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
var SmashingSlideshow = (function () {
    function SmashingSlideshow(user_configuration) {
        this.transitioning = false;
        var configuration = this.computeConfiguration(user_configuration);
        this.node = configuration.wrapper;
        this.viewport = configuration.viewport;
        this.width = configuration.width;
        this.rail = configuration.rail;
        this.elements = configuration.elements;
        this.animation = configuration.animation;
        this.showBullets = configuration.showBullets;
        this.bulletsRail = configuration.bulletsRail;
        if (this.animation === "fade") {
            this.rail.setSlideTime("0s, 0.25s");
        }
        this.initializeSlides();
        this.viewport.getNode().appendChild(this.rail.getNode());
        this.activeSlide = this.getSlides()[0];
        if (this.showBullets && this.bulletsRail !== undefined) {
            this.bulletsRail.getBullets()[0].setActive();
        }
    }
    SmashingSlideshow.prototype.getNode = function () {
        return this.node;
    };
    SmashingSlideshow.prototype.getElements = function () {
        return this.elements;
    };
    SmashingSlideshow.prototype.getAnimation = function () {
        return this.animation;
    };
    SmashingSlideshow.prototype.getActiveSlide = function () {
        return this.activeSlide;
    };
    SmashingSlideshow.prototype.getRail = function () {
        return this.rail;
    };
    SmashingSlideshow.prototype.getBulletsRail = function () {
        if (this.bulletsRail === undefined) {
            throw new ReferenceError('Impossible to get slideshow.bulletsRail as it doesn\'t exist.');
        }
        return this.bulletsRail;
    };
    SmashingSlideshow.prototype.getSlides = function () {
        return this.rail.getSlides();
    };
    SmashingSlideshow.prototype.calculateWidth = function () {
        var RECT = this.node.getBoundingClientRect();
        return RECT.width;
    };
    SmashingSlideshow.prototype.refresh = function () {
        var _this = this;
        this.width = this.calculateWidth();
        this.getSlides().forEach(function (slide) {
            slide.setWidth(_this.width + "px");
        });
        this.goTo(this.getActiveSlide().getIndex());
    };
    SmashingSlideshow.prototype.initializeSlides = function () {
        for (var i = 0; i < this.elements.length; ++i) {
            var element = this.elements[i];
            if (element instanceof HTMLElement) {
                var slide = new SmashingSlide(element, this);
                slide.setWidth(this.width + "px");
                slide.setIndex(i);
                this.rail.add(slide);
                if (this.showBullets && this.bulletsRail !== undefined) {
                    this.bulletsRail.add(new SmashingBullet(i, this));
                }
            }
            else {
                throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
            }
        }
    };
    SmashingSlideshow.prototype.remove = function (slide) {
        return this.rail.remove(slide);
    };
    SmashingSlideshow.prototype.goTo = function (index) {
        var _this = this;
        if (index < 0) {
            index = this.elements.length - 1;
        }
        if (index > (this.elements.length - 1)) {
            index = index - this.elements.length;
            this.goTo(index);
        }
        else if (this.transitioning === false || this.animation === "slide") {
            var BEFORE_CHANGE_EVENT = new CustomEvent("SSBeforeChange", { detail: this });
            this.node.dispatchEvent(BEFORE_CHANGE_EVENT);
            this.transitioning = true;
            this.rail.getNode().style.left = "-" + (index) * this.width + "px";
            this.activeSlide = this.getSlides()[index];
            if (this.showBullets && this.bulletsRail !== undefined) {
                var BULLETS = this.bulletsRail.getBullets();
                BULLETS[index].setActive();
            }
            setTimeout(function () {
                _this.transitioning = false;
                var AFTER_CHANGE_EVENT = new CustomEvent("SSAfterChange", { detail: _this });
                _this.node.dispatchEvent(AFTER_CHANGE_EVENT);
            }, 500);
        }
    };
    SmashingSlideshow.prototype.fadeTo = function (index) {
        var _this = this;
        if (index > this.elements.length) {
            index = index - this.elements.length;
            this.fadeTo(index);
        }
        else if (this.transitioning === false) {
            this.rail.setOpacity(0);
            if (this.animation === "slide") {
                this.rail.setSlideTime("0s, 0.25s");
            }
            setTimeout(function () {
                _this.goTo(index);
                _this.rail.setOpacity(1);
                setTimeout(function () {
                    if (_this.animation === "slide") {
                        _this.rail.setSlideTime("0.5s, 0.25s");
                    }
                }, 500);
            }, 500);
        }
    };
    SmashingSlideshow.prototype.computeConfiguration = function (user_configuration) {
        var smashing_configuration = {
            wrapper: user_configuration.wrapper,
            width: 0,
            elements: [],
            animation: "",
            rail: new SmashingRail(),
            viewport: new SmashingViewport(undefined),
            showBullets: false,
            bulletsRail: undefined,
            showArrows: false,
            arrows: undefined
        };
        if (user_configuration.width === undefined) {
            var rect = smashing_configuration.wrapper.getBoundingClientRect();
            smashing_configuration.width = rect.width;
        }
        else {
            smashing_configuration.width = user_configuration.width;
        }
        if (user_configuration.elements === undefined) {
            var elements = smashing_configuration.wrapper.querySelectorAll("[data-slide]");
            smashing_configuration.elements = Array.from(elements);
        }
        else {
            smashing_configuration.elements = user_configuration.elements;
        }
        if (user_configuration.animation === undefined) {
            smashing_configuration.animation = "slide";
        }
        else if (typeof user_configuration.animation === "string" && ["slide", "fade"].indexOf(user_configuration.animation) !== -1) {
            smashing_configuration.animation = user_configuration.animation;
        }
        else {
            throw new TypeError("animation property must be string and have a value of \"fade\" or \"slide\".");
        }
        if (user_configuration.rail !== undefined) {
            smashing_configuration.rail = user_configuration.rail;
        }
        smashing_configuration.rail.setWidth(smashing_configuration.width * smashing_configuration.elements.length + "px");
        if (user_configuration.viewport === undefined) {
            var viewport = document.createElement("smashing-viewport");
            smashing_configuration.wrapper.appendChild(viewport);
            smashing_configuration.viewport = new SmashingViewport(viewport);
        }
        else {
            smashing_configuration.viewport = new SmashingViewport(user_configuration.viewport);
        }
        if (user_configuration.showBullets === true) {
            smashing_configuration.showBullets = true;
            if (user_configuration.bulletsRail === undefined) {
                smashing_configuration.bulletsRail = new SmashingBulletsRail(undefined);
                smashing_configuration.wrapper.appendChild(smashing_configuration.bulletsRail.getNode());
            }
            else {
                smashing_configuration.bulletsRail = new SmashingBulletsRail(user_configuration.bulletsRail);
            }
        }
        if (user_configuration.showArrows === true) {
            smashing_configuration.showArrows = user_configuration.showArrows;
            smashing_configuration.arrows = [];
            var node = void 0;
            if (user_configuration.leftArrow === undefined) {
                node = document.createElement("button");
                smashing_configuration.wrapper.appendChild(node);
            }
            else {
                node = user_configuration.leftArrow;
            }
            smashing_configuration.arrows.push(new SmashingArrow({
                node: node,
                orientation: "left",
                slideshow: this
            }));
            if (user_configuration.rightArrow === undefined) {
                node = document.createElement("button");
                smashing_configuration.wrapper.appendChild(node);
            }
            else {
                node = user_configuration.rightArrow;
            }
            smashing_configuration.arrows.push(new SmashingArrow({
                node: node,
                orientation: "right",
                slideshow: this
            }));
        }
        return smashing_configuration;
    };
    return SmashingSlideshow;
}());
