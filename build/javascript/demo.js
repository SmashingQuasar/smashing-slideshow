"use strict";
var slideshow;
window.addEventListener("load", function () {
    var root = document.querySelector("smashing-slideshow");
    if (root) {
        slideshow = new SmashingSlideshow({
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
        });
        window.addEventListener("resize", function () {
            slideshow.refresh();
        });
    }
    else {
        throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
    }
});
