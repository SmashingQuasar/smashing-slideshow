import type { Animation } from "../types/Animation.js";
import type { SmashingRail } from "../elements/SmashingRail.js";
import type { SmashingViewport } from "../elements/SmashingViewport.js";
import type { SmashingBulletsRail } from "../elements/SmashingBulletsRail.js";
import type { SmashingArrow } from "../elements/SmashingArrow.js";

interface SmashingConfiguration
{
    wrapper: HTMLElement;
    width: number;
    elements: Array<Element>;
    animation: Animation|undefined;
    rail: SmashingRail;
    viewport: SmashingViewport;
    showBullets: boolean;
    bulletsRail: SmashingBulletsRail | undefined;
    showArrows: boolean;
    arrows: Array<SmashingArrow> | undefined;
}

export type { SmashingConfiguration };
