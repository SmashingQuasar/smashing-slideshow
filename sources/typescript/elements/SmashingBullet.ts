import type { SmashingSlideshow } from "./SmashingSlideshow.js";
import type { SmashingBulletsRail } from "./SmashingBulletsRail.js";

class SmashingBullet
{
    private readonly node: HTMLButtonElement;
    private readonly index: number;
    private readonly slideshow: SmashingSlideshow;

    constructor(index: number, slideshow: SmashingSlideshow)
    {
        this.node = document.createElement("button");
        this.index = index;
        this.node.appendChild(document.createTextNode(`${this.index + 1}`));
        this.slideshow = slideshow;

        this.node.addEventListener(
            "click",
            () =>
            {
                if (this.slideshow.getAnimation() === "slide")
                {
                    this.slideshow.goTo(this.index);
                }
                else
                {
                    this.slideshow.fadeTo(this.index);
                }
            }
        );
    }

    /**
     * getNode
     */
    public getNode(): HTMLButtonElement
    {
        return this.node;
    }

    /**
     * setActive
     */
    public setActive(): void
    {

        const BULLETS_RAIL: SmashingBulletsRail = this.slideshow.getBulletsRail();

        const BULLETS: Array<SmashingBullet> = BULLETS_RAIL.getBullets();

        BULLETS.forEach(
            (bullet: SmashingBullet): void =>
            {
                bullet.getNode().classList.remove("active");
            }
        );

        this.node.classList.add("active");
    }
}

export { SmashingBullet };
