class SmashingSlide {
    node;
    content;
    slideshow;
    index = 0;
    dragged = false;
    dragX = 0;
    constructor(content, slideshow) {
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
    dragStart(event) {
        this.dragged = true;
        this.slideshow.getRail().setSlideTime(`0s, 0.5s`);
        this.dragX = event.clientX;
        event.preventDefault();
    }
    drag(event) {
        if (this.dragged) {
            let calc = -((this.dragX - event.clientX) + this.index * parseFloat(`${this.getWidth()}`));
            this.slideshow.getRail().getNode().style.left = `${calc}px`;
        }
        event.preventDefault();
    }
    dragEnd(event) {
        if (this.dragged) {
            this.dragged = false;
            let left = Math.abs(parseFloat(`${this.slideshow.getRail().getNode().style.left}`)) - (this.index * parseFloat(`${this.getWidth()}`));
            let forward = event.clientX - this.dragX;
            let width = parseFloat(`${this.getWidth()}`);
            let delta = (width / 4) - Math.abs(left);
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
            this.slideshow.getRail().setSlideTime(`0.5s, 0.5s`);
        }
        event.preventDefault();
    }
    getNode() {
        return this.node;
    }
    setWidth(width) {
        this.node.style.width = width;
    }
    getWidth() {
        return this.node.style.width;
    }
    getContent() {
        return this.content;
    }
    getIndex() {
        return this.index;
    }
    setIndex(index) {
        this.index = index;
    }
}
export { SmashingSlide };
