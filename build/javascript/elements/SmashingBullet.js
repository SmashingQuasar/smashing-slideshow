class SmashingBullet {
    node;
    index;
    slideshow;
    constructor(index, slideshow) {
        this.node = document.createElement("button");
        this.index = index;
        this.node.appendChild(document.createTextNode(`${this.index + 1}`));
        this.slideshow = slideshow;
        this.node.addEventListener("click", () => {
            if (this.slideshow.getAnimation() === "slide") {
                this.slideshow.goTo(this.index);
            }
            else {
                this.slideshow.fadeTo(this.index);
            }
        });
    }
    getNode() {
        return this.node;
    }
    setActive() {
        const BULLETS_RAIL = this.slideshow.getBulletsRail();
        const BULLETS = BULLETS_RAIL.getBullets();
        BULLETS.forEach((bullet) => {
            bullet.getNode().classList.remove("active");
        });
        this.node.classList.add("active");
    }
}
export { SmashingBullet };
