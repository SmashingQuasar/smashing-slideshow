"use strict";

let slideshow: SmashingSlideshow;

window.addEventListener(
    "load",
    (): void =>
    {
        let root: HTMLElement | null = document.querySelector("smashing-slideshow");

        if (root)
        {
            slideshow = new SmashingSlideshow(root);
        }
        else
        {
            throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
        }

    }
);

