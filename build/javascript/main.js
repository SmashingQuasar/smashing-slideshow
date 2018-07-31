"use strict";
var SmashingSlideshow = (function () {
    function SmashingSlideshow(root) {
        var _this = this;
        this.slides = [];
        var rect = root.getBoundingClientRect();
        this.width = rect.width;
        console.log(this.width);
        this.rail = document.createElement("smashing-rail");
        var elements = root.children;
        this.elements = Array.from(elements);
        this.rail.style.width = this.width * this.elements.length + "px";
        this.elements.forEach(function (element) {
            var slide = document.createElement("smashing-slide");
            slide.style.width = _this.width + "px";
            slide.appendChild(element);
            _this.slides.push(slide);
            _this.rail.appendChild(slide);
        });
        root.appendChild(this.rail);
    }
    return SmashingSlideshow;
}());
