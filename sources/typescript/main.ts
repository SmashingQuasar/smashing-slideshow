"use strict";

class SmashingSlideshow
{

    private width: number;
    // private height: number;

    private rail: HTMLElement;

    private elements: Array<Element>;

    private slides: Array<HTMLElement> = [];

    constructor(root: HTMLElement)
    {
    
        /* Initializing root */

        let rect: ClientRect = root.getBoundingClientRect();

        this.width = rect.width;
        // this.height = rect.height;

console.log(this.width);

        /* Initializing rail */

        this.rail = document.createElement("smashing-rail");

        /* Fetching elements */

        let elements: HTMLCollection = root.children;

        this.elements = Array.from(elements);

        this.rail.style.width = `${this.width * this.elements.length}px`;

        /* Initializing slides */

        this.elements.forEach(
            (element: Element) =>
            {
                let slide: HTMLElement = document.createElement("smashing-slide");

                slide.style.width = `${this.width}px`;

                slide.appendChild(element);

                this.slides.push(slide);
                this.rail.appendChild(slide);
            }
        );

        
        root.appendChild(this.rail);

    }

}