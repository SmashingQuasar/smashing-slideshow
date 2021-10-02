import type { SmashingRail } from "../elements/SmashingRail.js";
import type { Animation } from "../types/Animation.js";

interface UserConfiguration
{
    wrapper: HTMLElement;
    width?: number | undefined;
    elements?: Array<Element> | undefined;
    animation?: Animation | undefined;
    rail?: SmashingRail | undefined;
    viewport?: HTMLElement | undefined;
    showBullets?: boolean | undefined;
    bulletsRail?: HTMLElement | undefined;
    showArrows?: boolean | undefined;
    leftArrow?: HTMLButtonElement | undefined;
    rightArrow?: HTMLButtonElement | undefined;
}

export type { UserConfiguration };
