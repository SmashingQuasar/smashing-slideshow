"use strict";

let slideshow: SmashingSlideshow;

window.addEventListener(
    "load",
    (): void =>
    {
        let root: HTMLElement | null = document.querySelector("smashing-slideshow");

        if (root)
        {
            let bullets_rail: HTMLElement;
            let viewport: HTMLElement;

            let selector: HTMLElement | null = document.querySelector("nav");

            if (selector !== null)
            {
                bullets_rail = selector;
            }
            else
            {
                bullets_rail = document.createElement("nav");
            }

            selector = document.querySelector("smashing-viewport");

            if (selector === null)
            {
                viewport = document.createElement("smashing-viewport");
            }
            else
            {
                viewport = selector;
            }

            slideshow = new SmashingSlideshow(
                {
                    wrapper: root,
                    width: undefined,
                    elements: undefined,
                    rail: undefined,
                    viewport: viewport,
                    showBullets: true,
                    bulletsRail: bullets_rail,
                    showArrows: true,
                    leftArrow:<HTMLButtonElement>document.querySelector("button"),
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

