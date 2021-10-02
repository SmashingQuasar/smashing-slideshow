class SmashingArrow {
    node;
    orientation;
    slideshow;
    constructor(configuration) {
        if (configuration.orientation !== "left" && configuration.orientation !== "right") {
            throw new SyntaxError(`Arrow orientation must be either "left" or "right".`);
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
        this.node.addEventListener("click", () => {
            if (this.orientation === "left") {
                if (this.slideshow.getAnimation() === "slide") {
                    this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() - 1);
                }
                else {
                    this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() - 1);
                }
            }
            else if (this.orientation === "right") {
                if (this.slideshow.getAnimation() === "slide") {
                    this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() + 1);
                }
                else {
                    this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() + 1);
                }
            }
        });
    }
}
export { SmashingArrow };
