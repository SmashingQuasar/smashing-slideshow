import { SmashingSlideshow } from "./elements/SmashingSlideshow.js";
const ROOT = document.querySelector("smashing-slideshow");
if (ROOT instanceof HTMLElement) {
    const SLIDESHOW = new SmashingSlideshow({
        wrapper: ROOT,
        animation: "fade",
        showBullets: true,
        showArrows: true
    });
    window.addEventListener("resize", () => {
        SLIDESHOW.refresh();
    });
}
else {
    throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
}
