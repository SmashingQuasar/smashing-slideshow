import type { SmashingSlideshow } from "../elements/SmashingSlideshow.js";
import type { Orientation } from "../types/Orientation.js";

interface ArrowConfiguration
{
    node: HTMLButtonElement;
    orientation: Orientation;
    slideshow: SmashingSlideshow;
}

export type { ArrowConfiguration };
