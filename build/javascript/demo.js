"use strict";
var slideshow;
window.addEventListener("load", function () {
    var root = document.querySelector("smashing-slideshow");
    if (root) {
        slideshow = new SmashingSlideshow(root);
    }
    else {
        throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
    }
});
