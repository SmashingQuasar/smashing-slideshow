"use strict";
var slideshow;
window.addEventListener("load", function () {
    var root = document.querySelector("smashing-slideshow");
    if (root) {
        var bullets_rail = void 0;
        var viewport = void 0;
        var selector = document.querySelector("nav");
        if (selector !== null) {
            bullets_rail = selector;
        }
        else {
            bullets_rail = document.createElement("nav");
        }
        selector = document.querySelector("smashing-viewport");
        if (selector === null) {
            viewport = document.createElement("smashing-viewport");
        }
        else {
            viewport = selector;
        }
        slideshow = new SmashingSlideshow({
            wrapper: root,
            width: undefined,
            elements: undefined,
            rail: undefined,
            viewport: viewport,
            showBullets: true,
            bulletsRail: bullets_rail,
            showArrows: true,
            leftArrow: document.querySelector("button"),
            rightArrow: undefined
        });
    }
    else {
        throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
    }
});
