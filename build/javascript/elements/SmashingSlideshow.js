import { SmashingViewport } from "./SmashingViewport.js";
import { SmashingRail } from "./SmashingRail.js";
import { SmashingSlide } from "./SmashingSlide.js";
import { SmashingBulletsRail } from "./SmashingBulletsRail.js";
import { SmashingBullet } from "./SmashingBullet.js";
import { SmashingArrow } from "./SmashingArrow.js";
class SmashingSlideshow {
    node;
    viewport;
    width;
    rail;
    elements;
    animation;
    activeSlide;
    showBullets;
    bulletsRail;
    transitioning = false;
    constructor(user_configuration) {
        const configuration = this.computeConfiguration(user_configuration);
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
    getNode() {
        return this.node;
    }
    getElements() {
        return this.elements;
    }
    getAnimation() {
        return this.animation;
    }
    getActiveSlide() {
        return this.activeSlide;
    }
    getRail() {
        return this.rail;
    }
    getBulletsRail() {
        if (this.bulletsRail === undefined) {
            throw new ReferenceError('Impossible to get slideshow.bulletsRail as it doesn\'t exist.');
        }
        return this.bulletsRail;
    }
    getSlides() {
        return this.rail.getSlides();
    }
    calculateWidth() {
        const RECT = this.node.getBoundingClientRect();
        return RECT.width;
    }
    refresh() {
        this.width = this.calculateWidth();
        this.getSlides().forEach((slide) => {
            slide.setWidth(`${this.width}px`);
        });
        this.goTo(this.getActiveSlide().getIndex());
    }
    initializeSlides() {
        for (let i = 0; i < this.elements.length; ++i) {
            let element = this.elements[i];
            if (element instanceof HTMLElement) {
                let slide = new SmashingSlide(element, this);
                slide.setWidth(`${this.width}px`);
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
    }
    remove(slide) {
        return this.rail.remove(slide);
    }
    goTo(index) {
        if (index < 0) {
            index = this.elements.length - 1;
        }
        if (index > (this.elements.length - 1)) {
            index = index - this.elements.length;
            this.goTo(index);
        }
        else if (this.transitioning === false || this.animation === "slide") {
            const BEFORE_CHANGE_EVENT = new CustomEvent("SSBeforeChange", { detail: this });
            this.node.dispatchEvent(BEFORE_CHANGE_EVENT);
            this.transitioning = true;
            this.rail.getNode().style.left = `-${(index) * this.width}px`;
            this.activeSlide = this.getSlides()[index];
            if (this.showBullets && this.bulletsRail !== undefined) {
                const BULLETS = this.bulletsRail.getBullets();
                BULLETS[index].setActive();
            }
            setTimeout(() => {
                this.transitioning = false;
                const AFTER_CHANGE_EVENT = new CustomEvent("SSAfterChange", { detail: this });
                this.node.dispatchEvent(AFTER_CHANGE_EVENT);
            }, 500);
        }
    }
    fadeTo(index) {
        if (index > this.elements.length) {
            index = index - this.elements.length;
            this.fadeTo(index);
        }
        else if (this.transitioning === false) {
            this.rail.setOpacity(0);
            if (this.animation === "slide") {
                this.rail.setSlideTime("0s, 0.25s");
            }
            setTimeout(() => {
                this.goTo(index);
                this.rail.setOpacity(1);
                setTimeout(() => {
                    if (this.animation === "slide") {
                        this.rail.setSlideTime("0.5s, 0.25s");
                    }
                }, 500);
            }, 500);
        }
    }
    computeConfiguration(user_configuration) {
        let smashing_configuration = {
            wrapper: user_configuration.wrapper,
            width: 0,
            elements: [],
            animation: undefined,
            rail: new SmashingRail(),
            viewport: new SmashingViewport(undefined),
            showBullets: false,
            bulletsRail: undefined,
            showArrows: false,
            arrows: undefined
        };
        if (user_configuration.width === undefined) {
            const rect = smashing_configuration.wrapper.getBoundingClientRect();
            smashing_configuration.width = rect.width;
        }
        else {
            smashing_configuration.width = user_configuration.width;
        }
        if (user_configuration.elements === undefined) {
            const elements = smashing_configuration.wrapper.querySelectorAll("[data-slide]");
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
            throw new TypeError(`animation property must be string and have a value of "fade" or "slide".`);
        }
        if (user_configuration.rail !== undefined) {
            smashing_configuration.rail = user_configuration.rail;
        }
        smashing_configuration.rail.setWidth(`${smashing_configuration.width * smashing_configuration.elements.length}px`);
        if (user_configuration.viewport === undefined) {
            let viewport = document.createElement("smashing-viewport");
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
            let node;
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
    }
}
export { SmashingSlideshow };
