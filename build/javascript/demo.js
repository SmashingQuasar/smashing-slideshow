"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmashingSlideshow_js_1 = require("./elements/SmashingSlideshow.js");
var ROOT = document.querySelector("smashing-slideshow");
if (ROOT instanceof HTMLElement) {
    var SLIDESHOW_1 = new SmashingSlideshow_js_1.SmashingSlideshow({
        wrapper: ROOT,
        animation: "fade",
        showBullets: true,
        showArrows: true
    });
    window.addEventListener("resize", function () {
        SLIDESHOW_1.refresh();
    });
}
else {
    throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
}
