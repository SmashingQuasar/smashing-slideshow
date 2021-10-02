import { SmashingSlide } from "./SmashingSlide.js";
class SmashingRail {
    node;
    slides = [];
    constructor() {
        this.node = document.createElement("smashing-rail");
    }
    getNode() {
        return this.node;
    }
    setWidth(width) {
        this.node.style.width = width;
    }
    setOpacity(opacity) {
        this.node.style.opacity = `${opacity}`;
    }
    setSlideTime(time) {
        this.node.style.transitionDuration = `${time}`;
    }
    add(slide) {
        this.slides.push(slide);
        this.node.appendChild(slide.getNode());
    }
    find(slide) {
        return this.slides.findIndex((element) => {
            return element.getNode() === slide.getNode();
        });
    }
    remove(slide) {
        let index;
        if (slide instanceof SmashingSlide) {
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
    }
    getSlides() {
        return this.slides;
    }
}
export { SmashingRail };
