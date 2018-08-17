"use strict";

let slideshow: SmashingSlideshow;

window.addEventListener(
    "load",
    (): void =>
    {
        let root: HTMLElement | null = document.querySelector("smashing-slideshow");

        if (root)
        {
            
            slideshow = new SmashingSlideshow(
                {
                    wrapper: root,
                    width: undefined,
                    elements: undefined,
                    animation: "fade",
                    rail: undefined,
                    viewport: undefined,
                    showBullets: true,
                    bulletsRail: undefined,
                    showArrows: true,
                    leftArrow: undefined,
                    rightArrow: undefined
                }
            );
        }
        else
        {
            throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
        }

    }
);

