"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashingSlideshow = void 0;
var SmashingViewport_js_1 = require("./SmashingViewport.js");
var SmashingRail_js_1 = require("./SmashingRail.js");
var SmashingSlide_js_1 = require("./SmashingSlide.js");
var SmashingBulletsRail_js_1 = require("./SmashingBulletsRail.js");
var SmashingBullet_js_1 = require("./SmashingBullet.js");
var SmashingArrow_js_1 = require("./SmashingArrow.js");
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
                var slide = new SmashingSlide_js_1.SmashingSlide(element, this);
                slide.setWidth(this.width + "px");
                slide.setIndex(i);
                this.rail.add(slide);
                if (this.showBullets && this.bulletsRail !== undefined) {
                    this.bulletsRail.add(new SmashingBullet_js_1.SmashingBullet(i, this));
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
            animation: undefined,
            rail: new SmashingRail_js_1.SmashingRail(),
            viewport: new SmashingViewport_js_1.SmashingViewport(undefined),
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
        else if (user_configuration.animation === "slide"
            ||
                user_configuration.animation === "fade") {
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
            smashing_configuration.viewport = new SmashingViewport_js_1.SmashingViewport(viewport);
        }
        else {
            smashing_configuration.viewport = new SmashingViewport_js_1.SmashingViewport(user_configuration.viewport);
        }
        if (user_configuration.showBullets === true) {
            smashing_configuration.showBullets = true;
            if (user_configuration.bulletsRail === undefined) {
                smashing_configuration.bulletsRail = new SmashingBulletsRail_js_1.SmashingBulletsRail(undefined);
                smashing_configuration.wrapper.appendChild(smashing_configuration.bulletsRail.getNode());
            }
            else {
                smashing_configuration.bulletsRail = new SmashingBulletsRail_js_1.SmashingBulletsRail(user_configuration.bulletsRail);
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
            smashing_configuration.arrows.push(new SmashingArrow_js_1.SmashingArrow({
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
            smashing_configuration.arrows.push(new SmashingArrow_js_1.SmashingArrow({
                node: node,
                orientation: "right",
                slideshow: this
            }));
        }
        return smashing_configuration;
    };
    return SmashingSlideshow;
}());
exports.SmashingSlideshow = SmashingSlideshow;
