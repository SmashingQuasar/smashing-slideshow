import type { SmashingSlideshow } from "./SmashingSlideshow.js";
import type { ArrowConfiguration } from "../interfaces/ArrowConfiguration.js";
import { Animation } from "../types/Animation.js";
import { Orientation } from "../types/Orientation.js";

class SmashingArrow
{
    private readonly node: HTMLButtonElement;
    private readonly orientation: Orientation;
    private readonly slideshow: SmashingSlideshow;

    constructor(configuration: ArrowConfiguration)
    {
        if (configuration.orientation !== Orientation.left && configuration.orientation !== Orientation.right)
        {
            throw new SyntaxError(`Arrow orientation must be either "left" or "right".`);
        }

        this.slideshow = configuration.slideshow;

        if (configuration.node === undefined || configuration.node === null)
        {
            this.node = document.createElement("button");
            this.slideshow.getNode().appendChild(this.node);
        }
        else
        {
            this.node = configuration.node;
        }

        this.orientation = configuration.orientation;
        this.node.classList.add("smashing-arrow", this.orientation);

        this.node.addEventListener(
            "click",
            (): void =>
            {
                if (this.orientation === Orientation.left)
                {
                    if (this.slideshow.getAnimation() === Animation.slide)
                    {
                        this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() - 1);
                    }
                    else
                    {
                        this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() - 1);
                    }
                }
                else if (this.orientation === Orientation.right)
                {
                    if (this.slideshow.getAnimation() === Animation.slide)
                    {
                        this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() + 1);
                    }
                    else
                    {
                        this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() + 1);
                    }
                }
            }
        );
    }
}

export { SmashingArrow };
